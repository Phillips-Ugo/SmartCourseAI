'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Course, getUniversityById } from '@/lib/universities'
import { getCourseRecommendations } from '@/lib/recommendations';
import UniversityDebug from './UniversityDebug';

export interface CourseRecommendationFormProps {
  onGetRecommendations: (courses: any[]) => void;
  university: string;
}

export default function CourseRecommendationForm({ onGetRecommendations, university }: CourseRecommendationFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    additionalInterests: '',
    difficulty: 'Intermediate',
    semester: 'Fall 2024',
    careerGoals: '',
    completedCourses: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showUniversityInfo, setShowUniversityInfo] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const generateRecommendations = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    const universityData = user?.universityId ? getUniversityById(user.universityId) : null
    if (!user || !universityData) {
      onGetRecommendations([])
      setIsLoading(false)
      return
    }
    const recommendations = await getCourseRecommendations({
      user,
      university: universityData,
      preferences: {
        difficulty: formData.difficulty,
        semester: formData.semester,
      },
    });
    onGetRecommendations(recommendations)
    setIsLoading(false)
  }

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Get AI-Powered Course Recommendations</h2>
      <p className="text-gray-300 mb-6">Fill out the form below and our AI will suggest the best courses for you based on your interests, goals, and academic level.</p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Additional Interests
          </label>
          <textarea
            name="additionalInterests"
            value={formData.additionalInterests}
            onChange={handleChange}
            className="input-field bg-gray-800/50 text-white border-gray-700"
            rows={3}
            placeholder="Any additional interests or specific topics you'd like to explore?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Preferred Difficulty Level
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="input-field bg-gray-800/50 text-white border-gray-700"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Target Semester
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="input-field bg-gray-800/50 text-white border-gray-700"
          >
            <option value="Fall 2024">Fall 2024</option>
            <option value="Spring 2025">Spring 2025</option>
            <option value="Summer 2025">Summer 2025</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Career Goals
          </label>
          <textarea
            name="careerGoals"
            value={formData.careerGoals}
            onChange={handleChange}
            className="input-field bg-gray-800/50 text-white border-gray-700"
            rows={2}
            placeholder="What are your career goals? (e.g., Software Engineer, Data Scientist, Research)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Recently Completed Courses
          </label>
          <textarea
            name="completedCourses"
            value={formData.completedCourses}
            onChange={handleChange}
            className="input-field bg-gray-800/50 text-white border-gray-700"
            rows={2}
            placeholder="List any relevant courses you've recently completed"
          />
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating recommendations...</span>
            </div>
          ) : (
            'Get AI Recommendations'
          )}
        </button>
        <button
          type="button"
          className="w-full mt-2 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
          onClick={() => setShowUniversityInfo(true)}
        >
          View University Info
        </button>
      </div>
      {showUniversityInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="glass-card p-6 max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
              onClick={() => setShowUniversityInfo(false)}
              aria-label="Close"
            >
              ×
            </button>
            <UniversityDebug university={university} />
          </div>
        </div>
      )}
    </div>
  )
} 