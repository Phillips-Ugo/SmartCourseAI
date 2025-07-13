'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, BookOpen, Clock, Target, ArrowRight, Search, Filter, Info, X, CheckCircle, AlertCircle } from 'lucide-react'
import { Course, University } from '@/lib/universities'
import { useAuth } from '@/components/providers/AuthProvider'

interface PrerequisiteNode {
  course: Course
  level: number
  completed: boolean
  inProgress: boolean
  canTake: boolean
  prerequisites: string[]
}

interface PrerequisiteChain {
  targetCourse: Course
  nodes: PrerequisiteNode[]
  maxLevel: number
}

export default function PrerequisiteChainVisualization() {
  const { user } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showCompleted, setShowCompleted] = useState(true)
  const [showInProgress, setShowInProgress] = useState(true)
  const [showAvailable, setShowAvailable] = useState(true)
  const [showUnavailable, setShowUnavailable] = useState(true)
  const [selectedChain, setSelectedChain] = useState<PrerequisiteChain | null>(null)
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)

  // Mock university data - in real app, this would come from the user's university
  const university: University = {
    id: 'gt',
    name: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    creditSystem: 'Semester',
    maxCreditsPerSemester: 21,
    minCreditsPerSemester: 12,
    graduationRequirements: {
      totalCredits: 122,
      categories: {}
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
        sections: []
      },
      {
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
      {
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
      {
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
      {
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
      {
        id: 'gt-math1554',
        code: 'MATH 1554',
        name: 'Linear Algebra',
        credits: 2,
        description: 'Linear algebra concepts and applications.',
        prerequisites: ['MATH 1552'],
        offered: 'Fall/Spring',
        difficulty: 'Intermediate',
        category: 'Mathematics',
        department: 'Mathematics',
        satisfiesRequirements: ['Mathematics'],
        sections: []
      },
      {
        id: 'gt-math1552',
        code: 'MATH 1552',
        name: 'Integral Calculus',
        credits: 4,
        description: 'Integration techniques and applications.',
        prerequisites: ['MATH 1551'],
        offered: 'Fall/Spring',
        difficulty: 'Intermediate',
        category: 'Mathematics',
        department: 'Mathematics',
        satisfiesRequirements: ['Mathematics'],
        sections: []
      },
      {
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
      }
    ]
  }

  // Mock completed courses - in real app, this would come from user data
  const completedCourses = ['CS 1301', 'CS 1331', 'MATH 1551', 'MATH 1552']
  const inProgressCourses = ['CS 1332']

  const categories = useMemo(() => {
    const cats = new Set(university.courses.map(course => course.category))
    return Array.from(cats)
  }, [university.courses])

  const filteredCourses = useMemo(() => {
    return university.courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || course.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [university.courses, searchTerm, filterCategory])

  const buildPrerequisiteChain = (targetCourse: Course): PrerequisiteChain => {
    const nodes: PrerequisiteNode[] = []
    const visited = new Set<string>()
    
    const addNode = (course: Course, level: number): PrerequisiteNode => {
      const completed = completedCourses.includes(course.code)
      const inProgress = inProgressCourses.includes(course.code)
      const canTake = course.prerequisites.every(prereq => 
        completedCourses.includes(prereq) || inProgressCourses.includes(prereq)
      )
      
      return {
        course,
        level,
        completed,
        inProgress,
        canTake,
        prerequisites: course.prerequisites
      }
    }

    const traverse = (course: Course, level: number) => {
      if (visited.has(course.id)) return
      visited.add(course.id)
      
      nodes.push(addNode(course, level))
      
      course.prerequisites.forEach(prereqCode => {
        const prereqCourse = university.courses.find(c => c.code === prereqCode)
        if (prereqCourse) {
          traverse(prereqCourse, level + 1)
        }
      })
    }

    traverse(targetCourse, 0)
    
    return {
      targetCourse,
      nodes: nodes.sort((a, b) => b.level - a.level), // Sort by level descending
      maxLevel: Math.max(...nodes.map(n => n.level))
    }
  }

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    const chain = buildPrerequisiteChain(course)
    setSelectedChain(chain)
  }

  const getCourseStatusColor = (node: PrerequisiteNode) => {
    if (node.completed) return 'from-green-500 to-green-600'
    if (node.inProgress) return 'from-yellow-500 to-yellow-600'
    if (node.canTake) return 'from-blue-500 to-blue-600'
    return 'from-gray-500 to-gray-600'
  }

  const getCourseStatusIcon = (node: PrerequisiteNode) => {
    if (node.completed) return <CheckCircle className="w-4 h-4" />
    if (node.inProgress) return <Clock className="w-4 h-4" />
    if (node.canTake) return <Target className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
  }

  const getCourseStatusText = (node: PrerequisiteNode) => {
    if (node.completed) return 'Completed'
    if (node.inProgress) return 'In Progress'
    if (node.canTake) return 'Available'
    return 'Prerequisites Needed'
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
          Prerequisite Chain Visualization
        </h2>
        <p className="text-gray-300">
          Explore course dependencies and plan your academic path
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Course Selection Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-4"
        >
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Select Course</span>
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Status Filters */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Show Courses</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Completed</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showInProgress}
                    onChange={(e) => setShowInProgress(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">In Progress</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showAvailable}
                    onChange={(e) => setShowAvailable(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Available</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showUnavailable}
                    onChange={(e) => setShowUnavailable(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Unavailable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Course List */}
          <div className="glass-card p-6 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Available Courses</h3>
            <div className="space-y-2">
              {filteredCourses.map(course => {
                const completed = completedCourses.includes(course.code)
                const inProgress = inProgressCourses.includes(course.code)
                const canTake = course.prerequisites.every(prereq => 
                  completedCourses.includes(prereq) || inProgressCourses.includes(prereq)
                )

                if (!showCompleted && completed) return null
                if (!showInProgress && inProgress) return null
                if (!showAvailable && canTake && !completed && !inProgress) return null
                if (!showUnavailable && !canTake && !completed && !inProgress) return null

                return (
                  <motion.button
                    key={course.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCourseSelect(course)}
                    onMouseEnter={() => setHoveredCourse(course.id)}
                    onMouseLeave={() => setHoveredCourse(null)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedCourse?.id === course.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{course.code}</div>
                        <div className="text-sm opacity-75">{course.name}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {inProgress && <Clock className="w-4 h-4 text-yellow-400" />}
                        {!completed && !inProgress && canTake && <Target className="w-4 h-4 text-blue-400" />}
                        {!completed && !inProgress && !canTake && <AlertCircle className="w-4 h-4 text-gray-400" />}
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Visualization Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          {selectedChain ? (
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Prerequisite Chain for {selectedChain.targetCourse.code}
                  </h3>
                  <p className="text-gray-300">{selectedChain.targetCourse.name}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCourse(null)
                    setSelectedChain(null)
                  }}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chain Visualization */}
              <div className="space-y-6">
                {Array.from({ length: selectedChain.maxLevel + 1 }, (_, level) => {
                  const levelNodes = selectedChain.nodes.filter(node => node.level === level)
                  return (
                    <motion.div
                      key={level}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: level * 0.1 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-400">
                          Level {selectedChain.maxLevel - level + 1}
                        </div>
                        <div className="flex-1 h-px bg-gray-700"></div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {levelNodes.map((node, index) => (
                          <motion.div
                            key={node.course.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: level * 0.1 + index * 0.05 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                              node.completed
                                ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/50'
                                : node.inProgress
                                ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50'
                                : node.canTake
                                ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/50'
                                : 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/50'
                            }`}
                          >
                            {/* Status Badge */}
                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                              node.completed
                                ? 'bg-green-500'
                                : node.inProgress
                                ? 'bg-yellow-500'
                                : node.canTake
                                ? 'bg-blue-500'
                                : 'bg-gray-500'
                            }`}>
                              {getCourseStatusIcon(node)}
                            </div>

                            <div className="space-y-2">
                              <div className="font-semibold text-white">
                                {node.course.code}
                              </div>
                              <div className="text-sm text-gray-300">
                                {node.course.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                {node.course.credits} credits • {node.course.difficulty}
                              </div>
                              
                              {/* Prerequisites */}
                              {node.prerequisites.length > 0 && (
                                <div className="pt-2 border-t border-gray-700/50">
                                  <div className="text-xs text-gray-400 mb-1">Prerequisites:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {node.prerequisites.map(prereq => {
                                      const prereqCompleted = completedCourses.includes(prereq)
                                      const prereqInProgress = inProgressCourses.includes(prereq)
                                      return (
                                        <span
                                          key={prereq}
                                          className={`text-xs px-2 py-1 rounded ${
                                            prereqCompleted
                                              ? 'bg-green-500/20 text-green-300'
                                              : prereqInProgress
                                              ? 'bg-yellow-500/20 text-yellow-300'
                                              : 'bg-gray-500/20 text-gray-300'
                                          }`}
                                        >
                                          {prereq}
                                        </span>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Status Text */}
                              <div className={`text-xs font-medium ${
                                node.completed
                                  ? 'text-green-400'
                                  : node.inProgress
                                  ? 'text-yellow-400'
                                  : node.canTake
                                  ? 'text-blue-400'
                                  : 'text-gray-400'
                              }`}>
                                {getCourseStatusText(node)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Connection Lines */}
                      {level < selectedChain.maxLevel && (
                        <div className="flex justify-center">
                          <ArrowRight className="w-6 h-6 text-gray-600 transform rotate-90" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <h4 className="font-semibold text-white mb-3">Path Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">
                      {selectedChain.nodes.filter(n => n.completed).length}
                    </div>
                    <div className="text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-semibold">
                      {selectedChain.nodes.filter(n => n.inProgress).length}
                    </div>
                    <div className="text-gray-400">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-semibold">
                      {selectedChain.nodes.filter(n => n.canTake && !n.completed && !n.inProgress).length}
                    </div>
                    <div className="text-gray-400">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 font-semibold">
                      {selectedChain.nodes.filter(n => !n.canTake && !n.completed && !n.inProgress).length}
                    </div>
                    <div className="text-gray-400">Blocked</div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 text-center"
            >
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a Course
              </h3>
              <p className="text-gray-400">
                Choose a course from the list to visualize its prerequisite chain
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 