'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Target, Star, Users, Clock, TrendingUp, CheckCircle, X, AlertTriangle, Zap, Lightbulb, BarChart3 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Course } from '@/lib/universities'

interface CompatibilityScore {
  courseId: string
  overallScore: number
  learningStyleMatch: number
  difficultyMatch: number
  interestMatch: number
  scheduleCompatibility: number
  prerequisiteReadiness: number
  careerAlignment: number
  factors: {
    positive: string[]
    negative: string[]
  }
}

interface LearningProfile {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  preferredDifficulty: number
  interests: string[]
  availableTime: number
  careerGoals: string[]
  strengths: string[]
  weaknesses: string[]
}

interface CourseMatch {
  course: Course
  compatibility: CompatibilityScore
  recommendation: 'strong' | 'good' | 'moderate' | 'weak'
  reasoning: string[]
}

export default function AICourseCompatibilityMatrix() {
  const { user } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [filterRecommendation, setFilterRecommendation] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'difficulty' | 'credits'>('score')
  const [showMatrix, setShowMatrix] = useState(false)

  // Mock learning profile
  const learningProfile: LearningProfile = {
    learningStyle: 'mixed',
    preferredDifficulty: 6,
    interests: ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Software Development'],
    availableTime: 40,
    careerGoals: ['Software Engineer', 'Data Scientist', 'AI Researcher'],
    strengths: ['Mathematics', 'Programming', 'Problem Solving'],
    weaknesses: ['Public Speaking', 'Writing']
  }

  // Mock courses with compatibility data
  const availableCourses: Course[] = [
    {
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
      id: 'gt-psyc1101',
      code: 'PSYC 1101',
      name: 'General Psychology',
      credits: 3,
      description: 'Introduction to the scientific study of behavior.',
      prerequisites: [],
      offered: 'Fall/Spring',
      difficulty: 'Beginner',
      category: 'Social Sciences',
      department: 'Psychology',
      satisfiesRequirements: ['Social Sciences'],
      sections: []
    },
    {
      id: 'gt-engl1101',
      code: 'ENGL 1101',
      name: 'English Composition I',
      credits: 3,
      description: 'Introduction to college writing and rhetoric.',
      prerequisites: [],
      offered: 'Fall/Spring',
      difficulty: 'Beginner',
      category: 'Humanities',
      department: 'English',
      satisfiesRequirements: ['Humanities'],
      sections: []
    }
  ]

  const courseMatches: CourseMatch[] = useMemo(() => {
    return availableCourses.map(course => {
      // Calculate compatibility scores
      const learningStyleMatch = course.category === 'Computer Science' ? 95 : 
                                course.category === 'Mathematics' ? 90 : 60
      
      const difficultyMatch = course.difficulty === 'Intermediate' ? 85 :
                             course.difficulty === 'Beginner' ? 70 : 95
      
      const interestMatch = learningProfile.interests.some(interest => 
        course.name.toLowerCase().includes(interest.toLowerCase()) ||
        course.description.toLowerCase().includes(interest.toLowerCase())
      ) ? 95 : 40
      
      const scheduleCompatibility = 90 // Mock value
      const prerequisiteReadiness = course.prerequisites.length === 0 ? 100 : 75
      const careerAlignment = learningProfile.careerGoals.some(goal => 
        course.category === 'Computer Science' || course.category === 'Mathematics'
      ) ? 95 : 30

      const overallScore = Math.round(
        (learningStyleMatch + difficultyMatch + interestMatch + 
         scheduleCompatibility + prerequisiteReadiness + careerAlignment) / 6
      )

      const factors = {
        positive: [] as string[],
        negative: [] as string[]
      }

      if (learningStyleMatch > 80) factors.positive.push('Matches your learning style')
      if (difficultyMatch > 80) factors.positive.push('Appropriate difficulty level')
      if (interestMatch > 80) factors.positive.push('Aligns with your interests')
      if (careerAlignment > 80) factors.positive.push('Supports career goals')
      if (prerequisiteReadiness === 100) factors.positive.push('No prerequisites required')

      if (learningStyleMatch < 70) factors.negative.push('May not match learning style')
      if (difficultyMatch < 70) factors.negative.push('Difficulty level concerns')
      if (interestMatch < 70) factors.negative.push('Limited interest alignment')
      if (careerAlignment < 70) factors.negative.push('Limited career relevance')

      const recommendation = overallScore >= 85 ? 'strong' :
                           overallScore >= 75 ? 'good' :
                           overallScore >= 60 ? 'moderate' : 'weak'

      const reasoning = [
        `Overall compatibility: ${overallScore}%`,
        `Learning style match: ${learningStyleMatch}%`,
        `Difficulty alignment: ${difficultyMatch}%`,
        `Interest relevance: ${interestMatch}%`,
        `Career alignment: ${careerAlignment}%`
      ]

      return {
        course,
        compatibility: {
          courseId: course.id,
          overallScore,
          learningStyleMatch,
          difficultyMatch,
          interestMatch,
          scheduleCompatibility,
          prerequisiteReadiness,
          careerAlignment,
          factors
        },
        recommendation,
        reasoning
      }
    })
  }, [availableCourses, learningProfile])

  const filteredMatches = useMemo(() => {
    let filtered = courseMatches

    if (filterRecommendation !== 'all') {
      filtered = filtered.filter(match => match.recommendation === filterRecommendation)
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.compatibility.overallScore - a.compatibility.overallScore
        case 'difficulty':
          return a.course.difficulty.localeCompare(b.course.difficulty)
        case 'credits':
          return a.course.credits - b.course.credits
        default:
          return 0
      }
    })

    return filtered
  }, [courseMatches, filterRecommendation, sortBy])

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'moderate': return 'text-yellow-400'
      case 'weak': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'strong': return <CheckCircle className="w-4 h-4" />
      case 'good': return <TrendingUp className="w-4 h-4" />
      case 'moderate': return <AlertTriangle className="w-4 h-4" />
      case 'weak': return <X className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400'
    if (score >= 75) return 'text-blue-400'
    if (score >= 60) return 'text-yellow-400'
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
          AI Course Compatibility Matrix
        </h2>
        <p className="text-gray-300">
          Advanced matching algorithm for optimal course selection
        </p>
      </motion.div>

      {/* Learning Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Brain className="w-5 h-5" />
          <span>Your Learning Profile</span>
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{learningProfile.learningStyle}</div>
            <div className="text-sm text-gray-400">Learning Style</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{learningProfile.preferredDifficulty}/10</div>
            <div className="text-sm text-gray-400">Preferred Difficulty</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{learningProfile.availableTime}h</div>
            <div className="text-sm text-gray-400">Available Time/Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{learningProfile.interests.length}</div>
            <div className="text-sm text-gray-400">Interest Areas</div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Recommendation</label>
              <select
                value={filterRecommendation}
                onChange={(e) => setFilterRecommendation(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Recommendations</option>
                <option value="strong">Strong Match</option>
                <option value="good">Good Match</option>
                <option value="moderate">Moderate Match</option>
                <option value="weak">Weak Match</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="score">Compatibility Score</option>
                <option value="difficulty">Difficulty Level</option>
                <option value="credits">Credits</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {showMatrix ? 'Hide Matrix' : 'Show Matrix View'}
          </button>
        </div>
      </motion.div>

      {/* Compatibility Matrix */}
      <AnimatePresence>
        {showMatrix && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Compatibility Matrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 text-gray-300">Course</th>
                    <th className="text-center py-2 text-gray-300">Overall</th>
                    <th className="text-center py-2 text-gray-300">Learning</th>
                    <th className="text-center py-2 text-gray-300">Difficulty</th>
                    <th className="text-center py-2 text-gray-300">Interest</th>
                    <th className="text-center py-2 text-gray-300">Career</th>
                    <th className="text-center py-2 text-gray-300">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((match) => (
                    <tr key={match.course.id} className="border-b border-gray-800">
                      <td className="py-3">
                        <div>
                          <div className="font-medium text-white">{match.course.code}</div>
                          <div className="text-gray-400">{match.course.name}</div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className={`font-bold ${getScoreColor(match.compatibility.overallScore)}`}>
                          {match.compatibility.overallScore}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className={getScoreColor(match.compatibility.learningStyleMatch)}>
                          {match.compatibility.learningStyleMatch}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className={getScoreColor(match.compatibility.difficultyMatch)}>
                          {match.compatibility.difficultyMatch}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className={getScoreColor(match.compatibility.interestMatch)}>
                          {match.compatibility.interestMatch}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className={getScoreColor(match.compatibility.careerAlignment)}>
                          {match.compatibility.careerAlignment}%
                        </div>
                      </td>
                      <td className="text-center">
                        <div className={`flex items-center justify-center ${getRecommendationColor(match.recommendation)}`}>
                          {getRecommendationIcon(match.recommendation)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredMatches.map((match, index) => (
          <motion.div
            key={match.course.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`text-lg font-bold ${getRecommendationColor(match.recommendation)}`}>
                    {match.compatibility.overallScore}%
                  </div>
                  <div>
                    <div className="font-semibold text-white">{match.course.code}</div>
                    <div className="text-gray-400">{match.course.name}</div>
                  </div>
                  <div className={`flex items-center space-x-1 ${getRecommendationColor(match.recommendation)}`}>
                    {getRecommendationIcon(match.recommendation)}
                    <span className="text-sm font-medium capitalize">{match.recommendation} Match</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Compatibility Factors</h4>
                    <div className="space-y-2">
                      {match.compatibility.factors.positive.map((factor, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">{factor}</span>
                        </div>
                      ))}
                      {match.compatibility.factors.negative.map((factor, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-gray-300">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-2">Detailed Scores</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Learning Style:</span>
                        <span className={`text-sm font-medium ${getScoreColor(match.compatibility.learningStyleMatch)}`}>
                          {match.compatibility.learningStyleMatch}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Difficulty Match:</span>
                        <span className={`text-sm font-medium ${getScoreColor(match.compatibility.difficultyMatch)}`}>
                          {match.compatibility.difficultyMatch}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Interest Alignment:</span>
                        <span className={`text-sm font-medium ${getScoreColor(match.compatibility.interestMatch)}`}>
                          {match.compatibility.interestMatch}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Career Relevance:</span>
                        <span className={`text-sm font-medium ${getScoreColor(match.compatibility.careerAlignment)}`}>
                          {match.compatibility.careerAlignment}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 