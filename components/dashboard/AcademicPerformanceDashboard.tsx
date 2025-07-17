'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Target, Award, BookOpen, Clock, BarChart3, PieChart, Calendar, Star, AlertTriangle, CheckCircle, Clock as ClockIcon } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

interface CourseGrade {
  id: string
  code: string
  name: string
  credits: number
  grade: string
  gradePoints: number
  semester: string
  year: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  instructor: string
}

interface SemesterPerformance {
  semester: string
  year: number
  gpa: number
  credits: number
  courses: CourseGrade[]
}

interface PerformanceMetrics {
  overallGpa: number
  semesterGpa: number
  gpaTrend: 'up' | 'down' | 'stable'
  totalCredits: number
  completedCourses: number
  averageGrade: string
  bestCategory: string
  challengingCategory: string
  improvementRate: number
}

export interface AcademicPerformanceDashboardProps {
  university: string;
}

export default function AcademicPerformanceDashboard({ university }: { university: string }) {
  const { user } = useAuth()
  const [selectedSemester, setSelectedSemester] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'semester' | 'year' | 'all'>('all')
  const [showGradeDetails, setShowGradeDetails] = useState<string | null>(null)

  // Mock academic data - in real app, this would come from the database
  const courseGrades: CourseGrade[] = [
    {
      id: '1',
      code: 'CS 1301',
      name: 'Introduction to Computing',
      credits: 3,
      grade: 'A',
      gradePoints: 4.0,
      semester: 'Fall',
      year: 2023,
      difficulty: 'Beginner',
      category: 'Computer Science',
      instructor: 'Dr. Smith'
    },
    {
      id: '2',
      code: 'CS 1331',
      name: 'Introduction to Object-Oriented Programming',
      credits: 3,
      grade: 'A-',
      gradePoints: 3.7,
      semester: 'Fall',
      year: 2023,
      difficulty: 'Beginner',
      category: 'Computer Science',
      instructor: 'Dr. Johnson'
    },
    {
      id: '3',
      code: 'MATH 1551',
      name: 'Differential Calculus',
      credits: 2,
      grade: 'B+',
      gradePoints: 3.3,
      semester: 'Fall',
      year: 2023,
      difficulty: 'Beginner',
      category: 'Mathematics',
      instructor: 'Dr. Brown'
    },
    {
      id: '4',
      code: 'CS 1332',
      name: 'Data Structures and Algorithms',
      credits: 3,
      grade: 'B',
      gradePoints: 3.0,
      semester: 'Spring',
      year: 2024,
      difficulty: 'Intermediate',
      category: 'Computer Science',
      instructor: 'Dr. Wilson'
    },
    {
      id: '5',
      code: 'MATH 1552',
      name: 'Integral Calculus',
      credits: 4,
      grade: 'B-',
      gradePoints: 2.7,
      semester: 'Spring',
      year: 2024,
      difficulty: 'Intermediate',
      category: 'Mathematics',
      instructor: 'Dr. Davis'
    },
    {
      id: '6',
      code: 'PHYS 2211',
      name: 'Introductory Physics I',
      credits: 4,
      grade: 'A-',
      gradePoints: 3.7,
      semester: 'Spring',
      year: 2024,
      difficulty: 'Intermediate',
      category: 'Natural Sciences',
      instructor: 'Dr. Miller'
    },
    {
      id: '7',
      code: 'ENGL 1101',
      name: 'English Composition I',
      credits: 3,
      grade: 'A',
      gradePoints: 4.0,
      semester: 'Fall',
      year: 2023,
      difficulty: 'Beginner',
      category: 'Humanities',
      instructor: 'Dr. Garcia'
    },
    {
      id: '8',
      code: 'PSYC 1101',
      name: 'General Psychology',
      credits: 3,
      grade: 'A-',
      gradePoints: 3.7,
      semester: 'Spring',
      year: 2024,
      difficulty: 'Beginner',
      category: 'Social Sciences',
      instructor: 'Dr. Anderson'
    }
  ]

  const semesters = useMemo(() => {
    const uniqueSemesters = new Set(courseGrades.map(course => `${course.semester} ${course.year}`))
    return Array.from(uniqueSemesters).sort()
  }, [courseGrades])

  const categories = useMemo(() => {
    const uniqueCategories = new Set(courseGrades.map(course => course.category))
    return Array.from(uniqueCategories)
  }, [courseGrades])

  const filteredGrades = useMemo(() => {
    let filtered = courseGrades

    if (selectedSemester !== 'all') {
      filtered = filtered.filter(course => `${course.semester} ${course.year}` === selectedSemester)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    if (timeRange === 'semester') {
      const currentSemester = semesters[semesters.length - 1]
      filtered = filtered.filter(course => `${course.semester} ${course.year}` === currentSemester)
    } else if (timeRange === 'year') {
      const currentYear = Math.max(...courseGrades.map(c => c.year))
      filtered = filtered.filter(course => course.year === currentYear)
    }

    return filtered
  }, [courseGrades, selectedSemester, selectedCategory, timeRange, semesters])

  const performanceMetrics: PerformanceMetrics = useMemo(() => {
    const totalCredits = filteredGrades.reduce((sum, course) => sum + course.credits, 0)
    const totalGradePoints = filteredGrades.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0)
    const overallGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

    // Calculate semester GPA for trend
    const currentSemester = semesters[semesters.length - 1]
    const currentSemesterGrades = courseGrades.filter(course => `${course.semester} ${course.year}` === currentSemester)
    const currentSemesterCredits = currentSemesterGrades.reduce((sum, course) => sum + course.credits, 0)
    const currentSemesterGradePoints = currentSemesterGrades.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0)
    const semesterGpa = currentSemesterCredits > 0 ? currentSemesterGradePoints / currentSemesterCredits : 0

    // Calculate GPA trend
    const previousSemester = semesters[semesters.length - 2]
    let gpaTrend: 'up' | 'down' | 'stable' = 'stable'
    if (previousSemester) {
      const previousSemesterGrades = courseGrades.filter(course => `${course.semester} ${course.year}` === previousSemester)
      const previousSemesterCredits = previousSemesterGrades.reduce((sum, course) => sum + course.credits, 0)
      const previousSemesterGradePoints = previousSemesterGrades.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0)
      const previousGpa = previousSemesterCredits > 0 ? previousSemesterGradePoints / previousSemesterCredits : 0
      
      if (semesterGpa > previousGpa + 0.1) gpaTrend = 'up'
      else if (semesterGpa < previousGpa - 0.1) gpaTrend = 'down'
    }

    // Calculate category performance
    const categoryGpas = categories.map(category => {
      const categoryGrades = filteredGrades.filter(course => course.category === category)
      const categoryCredits = categoryGrades.reduce((sum, course) => sum + course.credits, 0)
      const categoryGradePoints = categoryGrades.reduce((sum, course) => sum + (course.gradePoints * course.credits), 0)
      return {
        category,
        gpa: categoryCredits > 0 ? categoryGradePoints / categoryCredits : 0
      }
    })

    const bestCategory = categoryGpas.reduce((best, current) => 
      current.gpa > best.gpa ? current : best
    ).category

    const challengingCategory = categoryGpas.reduce((worst, current) => 
      current.gpa < worst.gpa ? current : worst
    ).category

    // Calculate improvement rate
    const gradeImprovements = filteredGrades
      .sort((a, b) => new Date(`${b.year}-${b.semester === 'Fall' ? '09' : '01'}-01`).getTime() - 
                       new Date(`${a.year}-${a.semester === 'Fall' ? '09' : '01'}-01`).getTime())
      .map(course => course.gradePoints)
    
    const improvementRate = gradeImprovements.length > 1 
      ? ((gradeImprovements[0] - gradeImprovements[gradeImprovements.length - 1]) / gradeImprovements[gradeImprovements.length - 1]) * 100
      : 0

    return {
      overallGpa,
      semesterGpa,
      gpaTrend,
      totalCredits,
      completedCourses: filteredGrades.length,
      averageGrade: filteredGrades.length > 0 
        ? (filteredGrades.reduce((sum, course) => sum + course.gradePoints, 0) / filteredGrades.length).toFixed(2)
        : '0.00',
      bestCategory,
      challengingCategory,
      improvementRate
    }
  }, [filteredGrades, semesters, categories])

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-400'
    if (grade.startsWith('B')) return 'text-blue-400'
    if (grade.startsWith('C')) return 'text-yellow-400'
    if (grade.startsWith('D')) return 'text-orange-400'
    return 'text-red-400'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-400'
    if (gpa >= 3.0) return 'text-blue-400'
    if (gpa >= 2.0) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          Academic Performance Dashboard
        </h2>
        <p className="text-gray-300">
          Track your academic progress and performance insights
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Semesters</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'semester' | 'year' | 'all')}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="year">This Year</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overall GPA</p>
              <p className={`text-2xl font-bold ${getGpaColor(performanceMetrics.overallGpa)}`}>
                {performanceMetrics.overallGpa.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Current Semester GPA</p>
              <p className={`text-2xl font-bold ${getGpaColor(performanceMetrics.semesterGpa)}`}>
                {performanceMetrics.semesterGpa.toFixed(2)}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                {performanceMetrics.gpaTrend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : performanceMetrics.gpaTrend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <div className="w-4 h-4 text-gray-400">—</div>
                )}
                <span className="text-xs text-gray-400">
                  {performanceMetrics.gpaTrend === 'up' ? 'Improving' : 
                   performanceMetrics.gpaTrend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Credits</p>
              <p className="text-2xl font-bold text-white">
                {performanceMetrics.totalCredits}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {performanceMetrics.completedCourses} courses completed
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, scale: 1.02 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Improvement Rate</p>
              <p className={`text-2xl font-bold ${performanceMetrics.improvementRate > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {performanceMetrics.improvementRate > 0 ? '+' : ''}{performanceMetrics.improvementRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">
                vs previous performance
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Best & Challenging Categories */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Category Performance</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-green-400">Strongest Area</span>
                </div>
                <p className="text-white font-semibold">{performanceMetrics.bestCategory}</p>
              </div>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-red-400">Needs Attention</span>
                </div>
                <p className="text-white font-semibold">{performanceMetrics.challengingCategory}</p>
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Grade Distribution</span>
            </h3>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'F'].map(grade => {
                const count = filteredGrades.filter(course => course.grade.startsWith(grade)).length
                const percentage = filteredGrades.length > 0 ? (count / filteredGrades.length) * 100 : 0
                return (
                  <div key={grade} className="flex items-center justify-between">
                    <span className={`font-medium ${getGradeColor(grade)}`}>{grade}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getGradeColor(grade).replace('text-', 'bg-')}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Course List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Course Performance</span>
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredGrades.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ x: 5 }}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 cursor-pointer transition-all duration-200"
                  onClick={() => setShowGradeDetails(showGradeDetails === course.id ? null : course.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className={`text-lg font-bold ${getGradeColor(course.grade)}`}>
                          {course.grade}
                        </div>
                        <div>
                          <div className="font-medium text-white">{course.code}</div>
                          <div className="text-sm text-gray-400">{course.name}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>{course.credits} cr</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${getDifficultyColor(course.difficulty)}`}>
                        <Star className="w-4 h-4" />
                        <span>{course.difficulty}</span>
                      </div>
                      <div className="text-gray-500">
                        {course.semester} {course.year}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {showGradeDetails === course.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-700/50"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Instructor:</span>
                            <span className="text-white ml-2">{course.instructor}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Category:</span>
                            <span className="text-white ml-2">{course.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Grade Points:</span>
                            <span className="text-white ml-2">{course.gradePoints}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Difficulty:</span>
                            <span className={`ml-2 ${getDifficultyColor(course.difficulty)}`}>
                              {course.difficulty}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 