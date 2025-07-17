import { Course, University, GraduationRequirements, CourseSection, Schedule } from './universities';
import axios from 'axios';

export interface RecommendationInput {
  user: {
    id: string;
    university: string;
    universityId?: string;
    level: string;
    interests: string[];
    completedCourses: {
      [category: string]: {
        courses: string[];
        credits: number;
      };
    };
  };
  university: University;
  preferences: {
    difficulty: string;
    semester: string;
  };
  scheduledCourses?: { course: Course; section: CourseSection }[];
}

export interface CourseWithReason extends Course {
  reason: string;
  bestProfessor?: { name: string; rating: number };
}

// Remove mock getProfessorRating
// Add async function to fetch real professor rating from API
const professorRatingCache = new Map<string, number>();
async function fetchProfessorRating(profName: string, university: string): Promise<number | null> {
  const cacheKey = `${profName}|${university}`;
  if (professorRatingCache.has(cacheKey)) {
    return professorRatingCache.get(cacheKey)!;
  }
  try {
    const res = await axios.get(`/api/professor-rating?name=${encodeURIComponent(profName)}&university=${encodeURIComponent(university)}`);
    const rating = res.data.rating;
    if (typeof rating === 'number') {
      professorRatingCache.set(cacheKey, rating);
      return rating;
    }
    return null;
  } catch {
    return null;
  }
}

// Helper: Check if all prerequisites are met
function hasCompletedPrereqs(course: Course, completedIds: Set<string>): boolean {
  return (course.prerequisites || []).every(prereq => completedIds.has(prereq));
}

// Helper: Check for time conflicts
function hasTimeConflict(course: Course, scheduledSections: CourseSection[]): boolean {
  if (!course.sections || course.sections.length === 0) return false;
  for (const section of course.sections) {
    for (const scheduled of scheduledSections) {
      for (const schedTime of scheduled.schedule) {
        for (const sectionTime of section.schedule) {
          if (
            schedTime.day === sectionTime.day &&
            ((schedTime.startTime < sectionTime.endTime && schedTime.endTime > sectionTime.startTime))
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Helper: Map user level to difficulty
function getRecommendedDifficulty(level: string): string {
  switch (level.toLowerCase()) {
    case 'freshman': return 'Beginner';
    case 'sophomore': return 'Intermediate';
    case 'junior': return 'Intermediate';
    case 'senior': return 'Advanced';
    default: return 'Intermediate';
  }
}

/**
 * Returns a list of recommended courses for a user at a given university, with reasons.
 * Enhanced: prerequisite awareness, time conflict avoidance, professor quality, personalized difficulty, category diversity.
 * Now async and uses real RateMyProfessors ratings.
 */
export async function getCourseRecommendations({ user, university, preferences, scheduledCourses = [] }: RecommendationInput): Promise<CourseWithReason[]> {
  const completedCourseIds = new Set(
    Object.values(user.completedCourses).flatMap(cat => cat.courses)
  );
  const scheduledSections = scheduledCourses.map(sc => sc.section);
  const graduationRequirements = university.graduationRequirements;
  const recommendedDifficulty = getRecommendedDifficulty(user.level);

  // 1. Filter out completed, unmet prerequisites, and time conflicts
  let availableCourses = university.courses.filter(course =>
    !completedCourseIds.has(course.id) &&
    hasCompletedPrereqs(course, completedCourseIds) &&
    !hasTimeConflict(course, scheduledSections)
  );

  // 2. Attach best professor rating (real)
  const coursesWithProfRating = await Promise.all(availableCourses.map(async course => {
    let _bestProfessor = undefined;
    if (course.professors && course.professors.length > 0) {
      let best = { name: '', rating: 0 };
      for (const prof of course.professors) {
        const rating = await fetchProfessorRating(prof.name, university.name);
        if (rating && rating > best.rating) best = { name: prof.name, rating };
      }
      _bestProfessor = best.rating > 0 ? best : undefined;
    }
    return { ...course, _bestProfessor };
  }));

  // 3. Sort by professor rating (if available)
  coursesWithProfRating.sort((a, b) => (b._bestProfessor?.rating || 0) - (a._bestProfessor?.rating || 0));

  // 4. Personalized difficulty: prefer courses matching recommended difficulty
  const difficultyPreferred = coursesWithProfRating.filter(course =>
    !course.difficulty || course.difficulty === recommendedDifficulty
  );
  const others = coursesWithProfRating.filter(course =>
    course.difficulty && course.difficulty !== recommendedDifficulty
  );
  let sortedCourses = [...difficultyPreferred, ...others];

  // 5. Ensure diversity of categories
  const categorySet = new Set<string>();
  const diverseCourses: CourseWithReason[] = [];
  for (const course of sortedCourses) {
    if (!categorySet.has(course.category)) {
      categorySet.add(course.category);
      diverseCourses.push({
        ...course,
        reason: `Recommended for category diversity: ${course.category}.`,
        bestProfessor: course._bestProfessor
      });
      if (diverseCourses.length >= 3) break; // Ensure at least 3 categories
    }
  }
  // Fill up to 6 recommendations with the rest
  for (const course of sortedCourses) {
    if (diverseCourses.length >= 6) break;
    if (!diverseCourses.some(c => c.id === course.id)) {
      diverseCourses.push({
        ...course,
        reason: course._bestProfessor
          ? `Taught by highly rated professor ${course._bestProfessor.name} (${course._bestProfessor.rating.toFixed(1)}/5.0).`
          : `Recommended based on your profile and schedule.`,
        bestProfessor: course._bestProfessor
      });
    }
  }

  return diverseCourses;
} 