'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Target, Clock, TrendingUp, BookOpen, Award, Users, Calendar, CheckCircle, ArrowRight, Star, Lightbulb, Zap, Info, Play, Trophy, Lock } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

interface LearningPath {
  id: string
  name: string
  description: string
  duration: number // months
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  focus: string[]
  courses: PathCourse[]
  milestones: Milestone[]
  successRate: number
  estimatedGPA: number
  totalCourses: number
  completedCourses: number
}

interface PathCourse {
  course: {
    id: string
    code: string
    name: string
    credits: number
    description: string
    prerequisites: string[]
    offered: string
    difficulty: string
    category: string
    department: string
    satisfiesRequirements: string[]
    sections: any[]
  }
  semester: number
  order: number
  prerequisites: string[]
  difficulty: number
  timeCommitment: number
  importance: 'core' | 'elective' | 'foundation'
  status: 'completed' | 'in-progress' | 'available' | 'locked'
  nextRecommended?: boolean
}

interface Milestone {
  id: string
  name: string
  description: string
  semester: number
  courses: string[]
  completed: boolean
  progress: number // 0-100
  rewards: string[]
}

interface LearningGoal {
  id: string
  name: string
  description: string
  targetDate: string
  progress: number
  courses: string[]
  priority: 'high' | 'medium' | 'low'
}

export interface LearningPathOptimizationProps {
  university: string;
}

export default function LearningPathOptimization({ university }: LearningPathOptimizationProps) {
  const { user } = useAuth()
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [showPathDetails, setShowPathDetails] = useState(false)
  const [activeSemester, setActiveSemester] = useState(1)
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([])
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  // Mock completed courses - in real app, this would come from user data
  const completedCourses = ['CS 1301', 'CS 1331', 'MATH 1551', 'MATH 1552']
  const inProgressCourses = ['CS 1332']

  // Mock learning paths data with enhanced progress tracking
  const learningPaths: LearningPath[] = [
    {
      id: 'ai-ml-specialist',
      name: 'AI & Machine Learning Specialist',
      description: 'Comprehensive path to become an AI/ML expert with strong mathematical foundations',
      duration: 24,
      difficulty: 'Advanced',
      focus: ['Artificial Intelligence', 'Machine Learning', 'Mathematics', 'Statistics'],
      successRate: 85,
      estimatedGPA: 3.6,
      totalCourses: 12,
      completedCourses: 4,
      courses: [
        {
          course: {
            id: 'gt-cs1301',
            code: 'CS 1301',
            name: 'Introduction to Computing',
            credits: 3,
            description: 'Introduction to computing principles and programming.',
            prerequisites: [],
            offered: 'Fall/Spring',
            difficulty: 'Beginner',
            category: 'Computer Science',
            department: 'Computer Science',
            satisfiesRequirements: ['Computer Science Core'],
            sections: []
          },
          semester: 1,
          order: 1,
          prerequisites: [],
          difficulty: 3,
          timeCommitment: 8,
          importance: 'foundation',
          status: 'completed'
        },
        {
          course: {
            id: 'gt-cs1331',
            code: 'CS 1331',
            name: 'Introduction to Object-Oriented Programming',
            credits: 3,
            description: 'Object-oriented programming concepts using Java.',
            prerequisites: ['CS 1301'],
            offered: 'Fall/Spring',
            difficulty: 'Beginner',
            category: 'Computer Science',
            department: 'Computer Science',
            satisfiesRequirements: ['Computer Science Core'],
            sections: []
          },
          semester: 1,
          order: 2,
          prerequisites: ['CS 1301'],
          difficulty: 4,
          timeCommitment: 10,
          importance: 'foundation',
          status: 'completed'
        },
        {
          course: {
            id: 'gt-math1551',
            code: 'MATH 1551',
            name: 'Differential Calculus',
            credits: 2,
            description: 'Differential calculus concepts and applications.',
            prerequisites: [],
            offered: 'Fall/Spring',
            difficulty: 'Beginner',
            category: 'Mathematics',
            department: 'Mathematics',
            satisfiesRequirements: ['Mathematics'],
            sections: []
          },
          semester: 1,
          order: 3,
          prerequisites: [],
          difficulty: 5,
          timeCommitment: 8,
          importance: 'foundation',
          status: 'completed'
        },
        {
          course: {
            id: 'gt-cs1332',
            code: 'CS 1332',
            name: 'Data Structures and Algorithms',
            credits: 3,
            description: 'Advanced data structures and algorithm analysis.',
            prerequisites: ['CS 1331'],
            offered: 'Fall/Spring',
            difficulty: 'Intermediate',
            category: 'Computer Science',
            department: 'Computer Science',
            satisfiesRequirements: ['Computer Science Core'],
            sections: []
          },
          semester: 2,
          order: 1,
          prerequisites: ['CS 1331'],
          difficulty: 7,
          timeCommitment: 12,
          importance: 'core',
          status: 'in-progress',
          nextRecommended: true
        },
        {
          course: {
            id: 'gt-math2605',
            code: 'MATH 2605',
            name: 'Linear Algebra',
            credits: 3,
            description: 'Vector spaces, linear transformations, eigenvalues.',
            prerequisites: ['MATH 1554'],
            offered: 'Fall/Spring',
            difficulty: 'Intermediate',
            category: 'Mathematics',
            department: 'Mathematics',
            satisfiesRequirements: ['Mathematics'],
            sections: []
          },
          semester: 2,
          order: 2,
          prerequisites: ['MATH 1554'],
          difficulty: 6,
          timeCommitment: 10,
          importance: 'core',
          status: 'available'
        },
        {
          course: {
            id: 'gt-cs3600',
            code: 'CS 3600',
            name: 'Introduction to Artificial Intelligence',
            credits: 3,
            description: 'Fundamental concepts and techniques in artificial intelligence.',
            prerequisites: ['CS 1332', 'MATH 2605'],
            offered: 'Fall/Spring',
            difficulty: 'Intermediate',
            category: 'Computer Science',
            department: 'Computer Science',
            satisfiesRequirements: ['Computer Science Core'],
            sections: []
          },
          semester: 3,
          order: 1,
          prerequisites: ['CS 1332', 'MATH 2605'],
          difficulty: 8,
          timeCommitment: 15,
          importance: 'core',
          status: 'locked'
        }
      ],
      milestones: [
        {
          id: 'milestone-1',
          name: 'Programming Foundation',
          description: 'Complete core programming courses',
          semester: 1,
          courses: ['CS 1301', 'CS 1331'],
          completed: true,
          progress: 100,
          rewards: ['Programming Badge', '100 XP', 'Unlock Advanced Courses']
        },
        {
          id: 'milestone-2',
          name: 'Data Structures Mastery',
          description: 'Master fundamental data structures and algorithms',
          semester: 2,
          courses: ['CS 1332'],
          completed: false,
          progress: 60,
          rewards: ['Algorithm Badge', '200 XP', 'AI Course Access']
        },
        {
          id: 'milestone-3',
          name: 'AI Fundamentals',
          description: 'Complete introduction to AI',
          semester: 3,
          courses: ['CS 3600'],
          completed: false,
          progress: 0,
          rewards: ['AI Badge', '300 XP', 'Machine Learning Path']
        }
      ]
    },
    {
      id: 'software-engineer',
      name: 'Software Engineering Track',
      description: 'Path focused on software development, system design, and engineering practices',
      duration: 20,
      difficulty: 'Intermediate',
      focus: ['Software Development', 'System Design', 'Web Technologies', 'Database Systems'],
      successRate: 90,
      estimatedGPA: 3.7,
      totalCourses: 10,
      completedCourses: 2,
      courses: [],
      milestones: []
    },
    {
      id: 'data-scientist',
      name: 'Data Science Pathway',
      description: 'Comprehensive data science curriculum with statistical analysis and visualization',
      duration: 22,
      difficulty: 'Advanced',
      focus: ['Data Science', 'Statistics', 'Machine Learning', 'Data Visualization'],
      successRate: 80,
      estimatedGPA: 3.5,
      totalCourses: 14,
      completedCourses: 1,
      courses: [],
      milestones: []
    }
  ]

  const selectedPathData = useMemo(() => {
    return learningPaths.find(path => path.id === selectedPath)
  }, [learningPaths, selectedPath])

  const currentSemesterCourses = useMemo(() => {
    if (!selectedPathData) return []
    return selectedPathData.courses.filter(course => course.semester === activeSemester)
  }, [selectedPathData, activeSemester])

  const pathProgress = useMemo(() => {
    if (!selectedPathData) return 0
    return (selectedPathData.completedCourses / selectedPathData.totalCourses) * 100
  }, [selectedPathData])

  const nextRecommendedCourse = useMemo(() => {
    if (!selectedPathData) return null
    return selectedPathData.courses.find(course => course.nextRecommended)
  }, [selectedPathData])

  const getCourseStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-green-600'
      case 'in-progress': return 'from-yellow-500 to-yellow-600'
      case 'available': return 'from-blue-500 to-blue-600'
      case 'locked': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getCourseStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'in-progress': return <Clock className="w-4 h-4" />
      case 'available': return <Target className="w-4 h-4" />
      case 'locked': return <Lock className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'core': return 'text-red-400'
      case 'foundation': return 'text-blue-400'
      case 'elective': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-400'
    if (difficulty <= 6) return 'text-yellow-400'
    if (difficulty <= 8) return 'text-orange-400'
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
          Learning Path Optimization
        </h2>
        <p className="text-gray-300">
          AI-powered personalized curriculum planning and milestone tracking
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Learning Paths Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Available Paths */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Map className="w-5 h-5" />
              <span>Learning Paths</span>
            </h3>
            <div className="space-y-3">
              {learningPaths.map((path) => (
                <motion.button
                  key={path.id}
                  whileHover={{ y: -2, scale: 1.02 }}
                  onClick={() => setSelectedPath(path.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedPath === path.id
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50'
                      : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="font-semibold text-white">{path.name}</div>
                    <div className="text-sm text-gray-400">{path.description}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{path.duration} months</span>
                      <span className={`font-medium ${path.difficulty === 'Advanced' ? 'text-red-400' : path.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {path.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-400">{path.successRate}% success rate</span>
                      <span className="text-green-400">GPA: {path.estimatedGPA}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(path.completedCourses / path.totalCourses) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                    <div className="text-xs text-gray-400">
                      {path.completedCourses}/{path.totalCourses} courses completed
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Learning Goals */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Learning Goals</span>
            </h3>
            <div className="space-y-3">
              {learningGoals.length === 0 ? (
                <div className="text-center py-4">
                  <Lightbulb className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No learning goals set yet</p>
                  <button className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                    Add Goal
                  </button>
                </div>
              ) : (
                learningGoals.map((goal) => (
                  <div key={goal.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-white">{goal.name}</div>
                      <span className={`text-xs font-medium ${
                        goal.priority === 'high' ? 'text-red-400' : 
                        goal.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {goal.priority}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">{goal.description}</div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <motion.div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{goal.progress}% complete</span>
                      <span>Due: {goal.targetDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Path Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {selectedPathData ? (
            <>
              {/* Path Overview */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{selectedPathData.name}</h3>
                  <button
                    onClick={() => setShowPathDetails(!showPathDetails)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    {showPathDetails ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{selectedPathData.duration}</div>
                    <div className="text-sm text-gray-400">Months</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{selectedPathData.successRate}%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{selectedPathData.estimatedGPA}</div>
                    <div className="text-sm text-gray-400">Est. GPA</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Focus Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPathData.focus.map((area) => (
                      <span key={area} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-white mb-2">Progress</h4>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${pathProgress}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{pathProgress.toFixed(0)}% complete</div>
                </div>

                {/* Next Recommended Course */}
                {nextRecommendedCourse && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Play className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-blue-400">Next Recommended Course</span>
                    </div>
                    <div className="font-medium text-white">{nextRecommendedCourse.course.code}</div>
                    <div className="text-sm text-gray-300">{nextRecommendedCourse.course.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {nextRecommendedCourse.timeCommitment}h/week • {nextRecommendedCourse.difficulty}/10 difficulty
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Semester Navigation */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Semester {activeSemester}</h3>
                <div className="flex space-x-2 mb-4">
                  {Array.from({ length: Math.ceil(selectedPathData.duration / 6) }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setActiveSemester(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        activeSemester === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {currentSemesterCourses.map((pathCourse, index) => (
                    <motion.div
                      key={pathCourse.course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                        pathCourse.nextRecommended
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50'
                          : pathCourse.status === 'completed'
                          ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50'
                          : pathCourse.status === 'in-progress'
                          ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50'
                          : pathCourse.status === 'available'
                          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50'
                          : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/50'
                      }`}
                    >
                      {/* Status Badge */}
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                        pathCourse.status === 'completed' ? 'bg-green-500' :
                        pathCourse.status === 'in-progress' ? 'bg-yellow-500' :
                        pathCourse.status === 'available' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        {getCourseStatusIcon(pathCourse.status)}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`text-lg font-bold ${getImportanceColor(pathCourse.importance)}`}>
                              {pathCourse.importance.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-white">{pathCourse.course.code}</div>
                              <div className="text-sm text-gray-400">{pathCourse.course.name}</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-center">
                            <div className={`font-semibold ${getDifficultyColor(pathCourse.difficulty)}`}>
                              {pathCourse.difficulty}/10
                            </div>
                            <div className="text-gray-400">Difficulty</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-400">{pathCourse.timeCommitment}h</div>
                            <div className="text-gray-400">Time</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-green-400">{pathCourse.course.credits} cr</div>
                            <div className="text-gray-400">Credits</div>
                          </div>
                        </div>
                      </div>

                      {pathCourse.nextRecommended && (
                        <div className="mt-3 pt-3 border-t border-blue-500/20">
                          <div className="flex items-center space-x-2 text-blue-400">
                            <Play className="w-4 h-4" />
                            <span className="text-sm font-medium">Recommended Next</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Milestones</span>
                </h3>
                <div className="space-y-4">
                  {selectedPathData.milestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`relative p-4 rounded-lg border-2 ${
                        milestone.completed
                          ? 'bg-green-500/10 border-green-500/20'
                          : 'bg-gray-800/50 border-gray-700/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {milestone.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-600 rounded-full"></div>
                          )}
                          <div>
                            <div className="font-semibold text-white">{milestone.name}</div>
                            <div className="text-sm text-gray-400">{milestone.description}</div>
                            <div className="text-xs text-gray-500 mt-1">Semester {milestone.semester}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">Rewards:</div>
                          <div className="text-xs text-gray-500">
                            {milestone.rewards.join(', ')}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className={`h-2 rounded-full ${
                            milestone.completed ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${milestone.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-1 text-center">
                        {milestone.progress}% complete
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <Map className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Learning Path
              </h3>
              <p className="text-gray-400">
                Choose a learning path to see your personalized curriculum and milestones
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 