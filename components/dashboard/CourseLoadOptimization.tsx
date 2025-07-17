'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Target, Clock, TrendingUp, AlertTriangle, CheckCircle, BookOpen, Users, Calendar, Zap, Lightbulb, BarChart3 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Course } from '@/lib/universities'

export interface CourseLoadOptimizationProps {
  university: string;
}

interface CourseLoad {
  course: Course
  difficulty: number // 1-10 scale
  timeCommitment: number // hours per week
  stressLevel: number // 1-10 scale
  successProbability: number // 0-100%
  recommendedCredits: number
}

interface OptimizationProfile {
  maxCredits: number
  preferredDifficulty: number
  availableTime: number // hours per week
  stressTolerance: number // 1-10 scale
  academicStrengths: string[]
  academicWeaknesses: string[]
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed'
  studyHabits: 'intensive' | 'steady' | 'last-minute'
}

interface OptimizationRecommendation {
  scenario: string
  courses: CourseLoad[]
  totalCredits: number
  totalTimeCommitment: number
  averageDifficulty: number
  stressLevel: number
  successProbability: number
  reasoning: string[]
}

const CourseLoadOptimization: React.FC<CourseLoadOptimizationProps> = ({ university }) => {
  const { user } = useAuth()
  const [optimizationProfile, setOptimizationProfile] = useState<OptimizationProfile>({
    maxCredits: 15,
    preferredDifficulty: 6,
    availableTime: 40,
    stressTolerance: 7,
    academicStrengths: ['Computer Science', 'Mathematics'],
    academicWeaknesses: ['Humanities'],
    learningStyle: 'mixed',
    studyHabits: 'steady'
  })
  const [selectedScenario, setSelectedScenario] = useState<string>('balanced')
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)

  // Mock course data with optimization metrics
  const availableCourses: CourseLoad[] = [
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
        sections: [],
        professors: [],
        summary: ''
      },
      difficulty: 7,
      timeCommitment: 12,
      stressLevel: 6,
      successProbability: 85,
      recommendedCredits: 3
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
        sections: [],
        professors: [],
        summary: ''
      },
      difficulty: 8,
      timeCommitment: 15,
      stressLevel: 7,
      successProbability: 75,
      recommendedCredits: 3
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
        sections: [],
        professors: [],
        summary: ''
      },
      difficulty: 6,
      timeCommitment: 10,
      stressLevel: 5,
      successProbability: 80,
      recommendedCredits: 3
    },
    {
      course: {
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
        sections: [],
        professors: [],
        summary: ''
      },
      difficulty: 3,
      timeCommitment: 6,
      stressLevel: 2,
      successProbability: 95,
      recommendedCredits: 3
    },
    {
      course: {
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
        sections: [],
        professors: [],
        summary: ''
      },
      difficulty: 4,
      timeCommitment: 8,
      stressLevel: 3,
      successProbability: 90,
      recommendedCredits: 3
    },
    {
      course: {
        id: 'gt-phys2211',
        code: 'PHYS 2211',
        name: 'Introductory Physics I',
        credits: 4,
        description: 'Classical mechanics and thermodynamics.',
        prerequisites: ['MATH 1552'],
        offered: 'Fall/Spring',
        difficulty: 'Intermediate',
        category: 'Natural Sciences',
        department: 'Physics',
        satisfiesRequirements: ['Natural Sciences'],
        sections: [],
        professors: [],
        summary: ''
      },
      difficulty: 7,
      timeCommitment: 14,
      stressLevel: 6,
      successProbability: 70,
      recommendedCredits: 4
    }
  ]

  const optimizationScenarios: OptimizationRecommendation[] = useMemo(() => {
    const scenarios = [
      {
        name: 'balanced',
        title: 'Balanced Approach',
        description: 'Optimal mix of challenge and manageability',
        courses: availableCourses.slice(0, 4),
        reasoning: [
          'Balanced difficulty across subjects',
          'Reasonable time commitment',
          'High success probability',
          'Good credit distribution'
        ]
      },
      {
        name: 'challenging',
        title: 'Challenging Load',
        description: 'Maximum academic challenge for high performers',
        courses: availableCourses.filter(c => c.difficulty >= 7),
        reasoning: [
          'High difficulty courses for growth',
          'Leverages your strengths in CS and Math',
          'Prepares for advanced coursework',
          'Requires excellent time management'
        ]
      },
      {
        name: 'conservative',
        title: 'Conservative Load',
        description: 'Focus on building confidence and GPA',
        courses: availableCourses.filter(c => c.difficulty <= 5),
        reasoning: [
          'Lower stress and time commitment',
          'High success probability',
          'Good for GPA building',
          'Allows time for other activities'
        ]
      },
      {
        name: 'strength-focused',
        title: 'Strength-Focused',
        description: 'Capitalize on your strongest subjects',
        courses: availableCourses.filter(c => 
          optimizationProfile.academicStrengths.includes(c.course.category)
        ),
        reasoning: [
          'Leverages your academic strengths',
          'Higher success probability in familiar subjects',
          'Builds confidence and momentum',
          'Prepares for advanced coursework in your field'
        ]
      }
    ]

    return scenarios.map(scenario => {
      const totalCredits = scenario.courses.reduce((sum, c) => sum + c.course.credits, 0)
      const totalTimeCommitment = scenario.courses.reduce((sum, c) => sum + c.timeCommitment, 0)
      const averageDifficulty = scenario.courses.reduce((sum, c) => sum + c.difficulty, 0) / scenario.courses.length
      const stressLevel = scenario.courses.reduce((sum, c) => sum + c.stressLevel, 0) / scenario.courses.length
      const successProbability = scenario.courses.reduce((sum, c) => sum + c.successProbability, 0) / scenario.courses.length

      return {
        scenario: scenario.name,
        courses: scenario.courses,
        totalCredits,
        totalTimeCommitment,
        averageDifficulty,
        stressLevel,
        successProbability,
        reasoning: scenario.reasoning
      }
    })
  }, [optimizationProfile])

  const selectedRecommendation = useMemo(() => {
    return optimizationScenarios.find(s => s.scenario === selectedScenario) || optimizationScenarios[0]
  }, [optimizationScenarios, selectedScenario])

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return 'text-green-400'
    if (difficulty <= 6) return 'text-yellow-400'
    if (difficulty <= 8) return 'text-orange-400'
    return 'text-red-400'
  }

  const getStressColor = (stress: number) => {
    if (stress <= 3) return 'text-green-400'
    if (stress <= 6) return 'text-yellow-400'
    if (stress <= 8) return 'text-orange-400'
    return 'text-red-400'
  }

  const getSuccessColor = (probability: number) => {
    if (probability >= 85) return 'text-green-400'
    if (probability >= 70) return 'text-blue-400'
    if (probability >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getWorkloadStatus = (timeCommitment: number) => {
    if (timeCommitment <= optimizationProfile.availableTime * 0.6) return 'light'
    if (timeCommitment <= optimizationProfile.availableTime * 0.8) return 'moderate'
    return 'heavy'
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
          Course Load Optimization
        </h2>
        <p className="text-gray-300">
          AI-powered recommendations for optimal course selection
        </p>
      </motion.div>

      {/* Profile Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>Your Optimization Profile</span>
          </h3>
          <button
            onClick={() => setShowProfileEditor(!showProfileEditor)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {showProfileEditor ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{optimizationProfile.maxCredits}</div>
            <div className="text-sm text-gray-400">Max Credits</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{optimizationProfile.availableTime}h</div>
            <div className="text-sm text-gray-400">Available Time/Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{optimizationProfile.stressTolerance}/10</div>
            <div className="text-sm text-gray-400">Stress Tolerance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-400">{optimizationProfile.studyHabits}</div>
            <div className="text-sm text-gray-400">Study Style</div>
          </div>
        </div>

        <AnimatePresence>
          {showProfileEditor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-700/50"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Credits</label>
                  <input
                    type="range"
                    min="12"
                    max="21"
                    value={optimizationProfile.maxCredits}
                    onChange={(e) => setOptimizationProfile(prev => ({ ...prev, maxCredits: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-400 mt-1">{optimizationProfile.maxCredits} credits</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Available Time (hours/week)</label>
                  <input
                    type="range"
                    min="20"
                    max="60"
                    value={optimizationProfile.availableTime}
                    onChange={(e) => setOptimizationProfile(prev => ({ ...prev, availableTime: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-400 mt-1">{optimizationProfile.availableTime} hours</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stress Tolerance</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={optimizationProfile.stressTolerance}
                    onChange={(e) => setOptimizationProfile(prev => ({ ...prev, stressTolerance: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-400 mt-1">{optimizationProfile.stressTolerance}/10</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Study Habits</label>
                  <select
                    value={optimizationProfile.studyHabits}
                    onChange={(e) => setOptimizationProfile(prev => ({ ...prev, studyHabits: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                  >
                    <option value="intensive">Intensive</option>
                    <option value="steady">Steady</option>
                    <option value="last-minute">Last-minute</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optimization Scenarios */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-4 gap-4"
      >
        {optimizationScenarios.map((scenario) => (
          <motion.button
            key={scenario.scenario}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => setSelectedScenario(scenario.scenario)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedScenario === scenario.scenario
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50'
                : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600/50'
            }`}
          >
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold text-white">
                {scenario.scenario === 'balanced' && 'Balanced'}
                {scenario.scenario === 'challenging' && 'Challenging'}
                {scenario.scenario === 'conservative' && 'Conservative'}
                {scenario.scenario === 'strength-focused' && 'Strength-Focused'}
              </div>
              <div className="text-sm text-gray-400">
                {scenario.totalCredits} credits • {scenario.totalTimeCommitment}h/week
              </div>
              <div className={`text-sm font-medium ${getSuccessColor(scenario.successProbability)}`}>
                {scenario.successProbability.toFixed(0)}% success rate
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Selected Recommendation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Recommended Course Load</span>
            </h3>

            {/* Recommendation Summary */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xl font-bold text-white">{selectedRecommendation.totalCredits}</div>
                <div className="text-sm text-gray-400">Credits</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xl font-bold text-white">{selectedRecommendation.totalTimeCommitment}h</div>
                <div className="text-sm text-gray-400">Time/Week</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className={`text-xl font-bold ${getDifficultyColor(selectedRecommendation.averageDifficulty)}`}>
                  {selectedRecommendation.averageDifficulty.toFixed(1)}
                </div>
                <div className="text-sm text-gray-400">Avg Difficulty</div>
              </div>
              <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                <div className={`text-xl font-bold ${getSuccessColor(selectedRecommendation.successProbability)}`}>
                  {selectedRecommendation.successProbability.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
            </div>

            {/* Course List */}
            <div className="space-y-3">
              {selectedRecommendation.courses.map((courseLoad) => (
                <motion.div
                  key={courseLoad.course.id}
                  whileHover={{ x: 5 }}
                  onMouseEnter={() => setHoveredCourse(courseLoad.course.id)}
                  onMouseLeave={() => setHoveredCourse(null)}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-white">{courseLoad.course.code}</div>
                      <div className="text-sm text-gray-400">{courseLoad.course.name}</div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className={`font-semibold ${getDifficultyColor(courseLoad.difficulty)}`}>
                          {courseLoad.difficulty}/10
                        </div>
                        <div className="text-gray-400">Difficulty</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-blue-400">{courseLoad.timeCommitment}h</div>
                        <div className="text-gray-400">Time</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-semibold ${getSuccessColor(courseLoad.successProbability)}`}>
                          {courseLoad.successProbability}%
                        </div>
                        <div className="text-gray-400">Success</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Reasoning */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5" />
              <span>AI Reasoning</span>
            </h3>
            <div className="space-y-3">
              {selectedRecommendation.reasoning.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start space-x-2"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{reason}</span>
                </motion.div>
              ))}
            </div>

            {/* Workload Analysis */}
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <h4 className="font-semibold text-white mb-3">Workload Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Time Utilization</span>
                  <span className="text-white">
                    {((selectedRecommendation.totalTimeCommitment / optimizationProfile.availableTime) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      getWorkloadStatus(selectedRecommendation.totalTimeCommitment) === 'light' ? 'bg-green-500' :
                      getWorkloadStatus(selectedRecommendation.totalTimeCommitment) === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((selectedRecommendation.totalTimeCommitment / optimizationProfile.availableTime) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400">
                  {getWorkloadStatus(selectedRecommendation.totalTimeCommitment) === 'light' && 'Light workload - plenty of buffer time'}
                  {getWorkloadStatus(selectedRecommendation.totalTimeCommitment) === 'moderate' && 'Moderate workload - manageable with good planning'}
                  {getWorkloadStatus(selectedRecommendation.totalTimeCommitment) === 'heavy' && 'Heavy workload - requires excellent time management'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 

export default CourseLoadOptimization; 