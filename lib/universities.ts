export interface University {
  id: string
  name: string
  location: string
  creditSystem: 'Semester' | 'Quarter' | 'Trimester'
  maxCreditsPerSemester: number
  minCreditsPerSemester: number
  graduationRequirements: GraduationRequirements
  courses: Course[]
}

export interface GraduationRequirements {
  totalCredits: number
  categories: {
    [category: string]: {
      requiredCredits: number
      description: string
      courses: string[] // Course codes that satisfy this requirement
    }
  }
}

export interface Course {
  id: string
  code: string
  name: string
  credits: number
  description: string
  prerequisites: string[]
  offered: 'Fall' | 'Spring' | 'Summer' | 'Fall/Spring' | 'All'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  department: string
  satisfiesRequirements: string[] // Which graduation requirements this course satisfies
  sections: CourseSection[]
}

export interface CourseSection {
  id: string
  sectionNumber: string
  instructor: string
  schedule: Schedule[]
  capacity: number
  enrolled: number
  location: string
}

export interface Schedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  startTime: string
  endTime: string
  type: 'Lecture' | 'Lab' | 'Discussion' | 'Recitation'
}

export const universities: University[] = [
  {
    id: 'gt',
    name: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    creditSystem: 'Semester',
    maxCreditsPerSemester: 21,
    minCreditsPerSemester: 12,
    graduationRequirements: {
      totalCredits: 122,
      categories: {
        'Social Sciences': {
          requiredCredits: 6,
          description: 'Courses in psychology, sociology, economics, political science, or history',
          courses: ['PSYC 1101', 'ECON 2100', 'HIST 2111', 'HIST 2112', 'POL 1101', 'SOC 1101']
        },
        'Humanities': {
          requiredCredits: 6,
          description: 'Courses in literature, philosophy, art, or music',
          courses: ['ENGL 1101', 'ENGL 1102', 'PHIL 3100', 'MUSI 2010', 'ARTH 1100']
        },
        'Mathematics': {
          requiredCredits: 15,
          description: 'Core mathematics courses including calculus and linear algebra',
          courses: ['MATH 1551', 'MATH 1552', 'MATH 1554', 'MATH 2605', 'MATH 3215']
        },
        'Natural Sciences': {
          requiredCredits: 8,
          description: 'Physics, chemistry, or biology courses with labs',
          courses: ['PHYS 2211', 'PHYS 2212', 'CHEM 1310', 'BIOL 1510']
        },
        'Computer Science Core': {
          requiredCredits: 30,
          description: 'Required computer science courses',
          courses: ['CS 1301', 'CS 1331', 'CS 1332', 'CS 2110', 'CS 2200', 'CS 3600', 'CS 4641']
        }
      }
    },
    courses: [
      {
        id: 'gt-cs3600',
        code: 'CS 3600',
        name: 'Introduction to Artificial Intelligence',
        credits: 3,
        description: 'Fundamental concepts and techniques in artificial intelligence including search, knowledge representation, and machine learning.',
        prerequisites: ['CS 1332', 'MATH 2605'],
        offered: 'Fall/Spring',
        difficulty: 'Intermediate',
        category: 'Computer Science',
        department: 'Computer Science',
        satisfiesRequirements: ['Computer Science Core'],
        sections: [
          {
            id: 'gt-cs3600-001',
            sectionNumber: '001',
            instructor: 'Dr. Smith',
            schedule: [
              { day: 'Monday', startTime: '09:30', endTime: '10:45', type: 'Lecture' },
              { day: 'Wednesday', startTime: '09:30', endTime: '10:45', type: 'Lecture' },
              { day: 'Friday', startTime: '09:30', endTime: '10:45', type: 'Lecture' }
            ],
            capacity: 120,
            enrolled: 85,
            location: 'Klaus Advanced Computing Building 1116'
          }
        ]
      },
      {
        id: 'gt-cs1332',
        code: 'CS 1332',
        name: 'Data Structures and Algorithms',
        credits: 3,
        description: 'Advanced data structures and algorithm analysis. Covers trees, graphs, dynamic programming, and complexity analysis.',
        prerequisites: ['CS 1331'],
        offered: 'Fall/Spring',
        difficulty: 'Intermediate',
        category: 'Computer Science',
        department: 'Computer Science',
        satisfiesRequirements: ['Computer Science Core'],
        sections: [
          {
            id: 'gt-cs1332-001',
            sectionNumber: '001',
            instructor: 'Dr. Johnson',
            schedule: [
              { day: 'Tuesday', startTime: '11:00', endTime: '12:15', type: 'Lecture' },
              { day: 'Thursday', startTime: '11:00', endTime: '12:15', type: 'Lecture' }
            ],
            capacity: 150,
            enrolled: 120,
            location: 'College of Computing 016'
          }
        ]
      },
      {
        id: 'gt-math2605',
        code: 'MATH 2605',
        name: 'Linear Algebra',
        credits: 3,
        description: 'Vector spaces, linear transformations, eigenvalues, and applications to computer science and engineering.',
        prerequisites: ['MATH 1554'],
        offered: 'Fall/Spring',
        difficulty: 'Intermediate',
        category: 'Mathematics',
        department: 'Mathematics',
        satisfiesRequirements: ['Mathematics'],
        sections: [
          {
            id: 'gt-math2605-001',
            sectionNumber: '001',
            instructor: 'Dr. Brown',
            schedule: [
              { day: 'Monday', startTime: '14:00', endTime: '15:15', type: 'Lecture' },
              { day: 'Wednesday', startTime: '14:00', endTime: '15:15', type: 'Lecture' },
              { day: 'Friday', startTime: '14:00', endTime: '15:15', type: 'Lecture' }
            ],
            capacity: 100,
            enrolled: 75,
            location: 'Skiles Classroom Building 255'
          }
        ]
      },
      {
        id: 'gt-psyc1101',
        code: 'PSYC 1101',
        name: 'General Psychology',
        credits: 3,
        description: 'Introduction to the scientific study of behavior and mental processes.',
        prerequisites: [],
        offered: 'Fall/Spring',
        difficulty: 'Beginner',
        category: 'Social Sciences',
        department: 'Psychology',
        satisfiesRequirements: ['Social Sciences'],
        sections: [
          {
            id: 'gt-psyc1101-001',
            sectionNumber: '001',
            instructor: 'Dr. Wilson',
            schedule: [
              { day: 'Tuesday', startTime: '13:30', endTime: '14:45', type: 'Lecture' },
              { day: 'Thursday', startTime: '13:30', endTime: '14:45', type: 'Lecture' }
            ],
            capacity: 200,
            enrolled: 180,
            location: 'Psychology Building 101'
          }
        ]
      },
      {
        id: 'gt-econ2100',
        code: 'ECON 2100',
        name: 'Principles of Economics',
        credits: 3,
        description: 'Introduction to microeconomic and macroeconomic principles.',
        prerequisites: [],
        offered: 'Fall/Spring',
        difficulty: 'Beginner',
        category: 'Social Sciences',
        department: 'Economics',
        satisfiesRequirements: ['Social Sciences'],
        sections: [
          {
            id: 'gt-econ2100-001',
            sectionNumber: '001',
            instructor: 'Dr. Davis',
            schedule: [
              { day: 'Monday', startTime: '16:00', endTime: '17:15', type: 'Lecture' },
              { day: 'Wednesday', startTime: '16:00', endTime: '17:15', type: 'Lecture' }
            ],
            capacity: 150,
            enrolled: 120,
            location: 'Economics Building 201'
          }
        ]
      },
      {
        id: 'gt-engl1101',
        code: 'ENGL 1101',
        name: 'English Composition I',
        credits: 3,
        description: 'Introduction to college writing with emphasis on critical thinking and argumentation.',
        prerequisites: [],
        offered: 'Fall/Spring',
        difficulty: 'Beginner',
        category: 'Humanities',
        department: 'English',
        satisfiesRequirements: ['Humanities'],
        sections: [
          {
            id: 'gt-engl1101-001',
            sectionNumber: '001',
            instructor: 'Dr. Miller',
            schedule: [
              { day: 'Monday', startTime: '10:00', endTime: '11:15', type: 'Lecture' },
              { day: 'Wednesday', startTime: '10:00', endTime: '11:15', type: 'Lecture' }
            ],
            capacity: 25,
            enrolled: 20,
            location: 'Skiles Classroom Building 308'
          }
        ]
      }
    ]
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    creditSystem: 'Semester',
    maxCreditsPerSemester: 54, // MIT uses units, roughly 3 units = 1 credit
    minCreditsPerSemester: 36,
    graduationRequirements: {
      totalCredits: 180, // MIT units
      categories: {
        'Humanities, Arts, and Social Sciences': {
          requiredCredits: 36,
          description: 'Courses in humanities, arts, and social sciences',
          courses: ['21H.001', '21L.001', '24.00', '21M.011', '21W.021']
        },
        'Science Core': {
          requiredCredits: 48,
          description: 'Physics, chemistry, and biology requirements',
          courses: ['8.01', '8.02', '5.111', '7.01', '18.02']
        },
        'Mathematics': {
          requiredCredits: 36,
          description: 'Calculus and linear algebra requirements',
          courses: ['18.01', '18.02', '18.06', '18.03']
        },
        'Computer Science Core': {
          requiredCredits: 60,
          description: 'Required computer science courses',
          courses: ['6.0001', '6.0002', '6.006', '6.034', '6.046']
        }
      }
    },
    courses: [
      {
        id: 'mit-6-034',
        code: '6.034',
        name: 'Artificial Intelligence',
        credits: 12, // MIT units
        description: 'Introduction to artificial intelligence. Search, constraint satisfaction, game playing, knowledge representation, logical inference, planning, and machine learning.',
        prerequisites: ['6.006', '18.06'],
        offered: 'Fall',
        difficulty: 'Advanced',
        category: 'Computer Science',
        department: 'Electrical Engineering and Computer Science',
        satisfiesRequirements: ['Computer Science Core'],
        sections: [
          {
            id: 'mit-6-034-001',
            sectionNumber: '001',
            instructor: 'Prof. Winston',
            schedule: [
              { day: 'Monday', startTime: '10:00', endTime: '11:30', type: 'Lecture' },
              { day: 'Wednesday', startTime: '10:00', endTime: '11:30', type: 'Lecture' },
              { day: 'Friday', startTime: '10:00', endTime: '11:30', type: 'Lecture' }
            ],
            capacity: 200,
            enrolled: 180,
            location: 'Building 34-101'
          }
        ]
      }
    ]
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    location: 'Stanford, CA',
    creditSystem: 'Quarter',
    maxCreditsPerSemester: 20,
    minCreditsPerSemester: 12,
    graduationRequirements: {
      totalCredits: 180,
      categories: {
        'Ways of Thinking': {
          requiredCredits: 40,
          description: 'Courses in aesthetic and interpretive inquiry, social inquiry, scientific method and analysis',
          courses: ['THINK 1', 'THINK 2', 'THINK 3', 'THINK 4']
        },
        'Writing and Rhetoric': {
          requiredCredits: 15,
          description: 'Writing and rhetoric requirements',
          courses: ['PWR 1', 'PWR 2']
        },
        'Mathematics': {
          requiredCredits: 20,
          description: 'Mathematics and computational thinking',
          courses: ['MATH 19', 'MATH 20', 'MATH 21', 'CS 106A']
        },
        'Computer Science Core': {
          requiredCredits: 60,
          description: 'Required computer science courses',
          courses: ['CS 106B', 'CS 103', 'CS 107', 'CS 110', 'CS 221']
        }
      }
    },
    courses: [
      {
        id: 'stanford-cs221',
        code: 'CS 221',
        name: 'Artificial Intelligence: Principles and Techniques',
        credits: 4,
        description: 'Introduction to artificial intelligence. Search, constraint satisfaction, game playing, knowledge representation, logical inference, planning, and machine learning.',
        prerequisites: ['CS 106B', 'CS 103'],
        offered: 'Fall/Spring',
        difficulty: 'Advanced',
        category: 'Computer Science',
        department: 'Computer Science',
        satisfiesRequirements: ['Computer Science Core'],
        sections: [
          {
            id: 'stanford-cs221-001',
            sectionNumber: '001',
            instructor: 'Prof. Ng',
            schedule: [
              { day: 'Monday', startTime: '14:30', endTime: '15:50', type: 'Lecture' },
              { day: 'Wednesday', startTime: '14:30', endTime: '15:50', type: 'Lecture' },
              { day: 'Friday', startTime: '14:30', endTime: '15:50', type: 'Lecture' }
            ],
            capacity: 300,
            enrolled: 280,
            location: 'Hewlett Teaching Center 200'
          }
        ]
      }
    ]
  }
]

export const getUniversityById = (id: string): University | undefined => {
  return universities.find(uni => uni.id === id)
}

export const getUniversityByName = (name: string): University | undefined => {
  return universities.find(uni => 
    uni.name.toLowerCase().includes(name.toLowerCase())
  )
}

export const getAllUniversities = (): University[] => {
  return universities
}

export const getGraduationRequirements = (universityId: string) => {
  const university = getUniversityById(universityId)
  return university?.graduationRequirements
}

export const getCoursesByCategory = (universityId: string, category: string) => {
  const university = getUniversityById(universityId)
  return university?.courses.filter(course => course.category === category) || []
}

export const getRequiredCourses = (universityId: string, category: string) => {
  const university = getUniversityById(universityId)
  const requirements = university?.graduationRequirements.categories[category]
  if (!requirements) return []
  
  return university.courses.filter(course => 
    requirements.courses.includes(course.code)
  )
} 