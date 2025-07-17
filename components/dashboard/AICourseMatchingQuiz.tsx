'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Target, Clock, Users, BookOpen, Zap, ArrowRight, CheckCircle } from 'lucide-react'

interface QuizQuestion {
  id: number
  question: string
  options: {
    value: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    description: string
  }[]
  category: 'learning_style' | 'personality' | 'goals' | 'preferences'
}

interface QuizResult {
  learningStyle: string
  personality: string
  goals: string
  preferences: string
  recommendedCategories: string[]
  difficulty: string
  workload: string
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "How do you prefer to learn new concepts?",
    options: [
      {
        value: "visual",
        label: "Visual Learning",
        icon: BookOpen,
        description: "I learn best through diagrams, charts, and visual aids"
      },
      {
        value: "hands_on",
        label: "Hands-on Practice",
        icon: Target,
        description: "I prefer doing projects and practical exercises"
      },
      {
        value: "discussion",
        label: "Group Discussion",
        icon: Users,
        description: "I learn through conversations and group work"
      },
      {
        value: "reading",
        label: "Reading & Research",
        icon: Brain,
        description: "I prefer reading materials and independent study"
      }
    ],
    category: 'learning_style'
  },
  {
    id: 2,
    question: "What's your typical approach to problem-solving?",
    options: [
      {
        value: "analytical",
        label: "Analytical",
        icon: Brain,
        description: "I break down problems systematically and analyze data"
      },
      {
        value: "creative",
        label: "Creative",
        icon: Zap,
        description: "I think outside the box and explore innovative solutions"
      },
      {
        value: "collaborative",
        label: "Collaborative",
        icon: Users,
        description: "I work with others to find the best solution"
      },
      {
        value: "practical",
        label: "Practical",
        icon: Target,
        description: "I focus on real-world applications and results"
      }
    ],
    category: 'personality'
  },
  {
    id: 3,
    question: "What are your primary academic goals?",
    options: [
      {
        value: "research",
        label: "Research & Academia",
        icon: Brain,
        description: "I want to pursue research or graduate studies"
      },
      {
        value: "industry",
        label: "Industry Career",
        icon: Target,
        description: "I want to work in the tech industry or corporate world"
      },
      {
        value: "entrepreneurship",
        label: "Entrepreneurship",
        icon: Zap,
        description: "I want to start my own business or work on startups"
      },
      {
        value: "social_impact",
        label: "Social Impact",
        icon: Users,
        description: "I want to make a positive difference in society"
      }
    ],
    category: 'goals'
  },
  {
    id: 4,
    question: "How do you prefer to manage your course workload?",
    options: [
      {
        value: "intensive",
        label: "Intensive Focus",
        icon: Clock,
        description: "I prefer fewer courses with deep focus on each"
      },
      {
        value: "balanced",
        label: "Balanced Mix",
        icon: Target,
        description: "I like a mix of challenging and easier courses"
      },
      {
        value: "exploratory",
        label: "Exploratory",
        icon: BookOpen,
        description: "I want to try many different subjects and topics"
      },
      {
        value: "accelerated",
        label: "Accelerated Pace",
        icon: Zap,
        description: "I want to complete my degree as quickly as possible"
      }
    ],
    category: 'preferences'
  }
]

export interface AICourseMatchingQuizProps {
  university: string;
}

export default function AICourseMatchingQuiz({ university }: AICourseMatchingQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnswer = (value: string) => {
    const question = quizQuestions[currentQuestion]
    setAnswers(prev => ({
      ...prev,
      [question.category]: value
    }))

    if (currentQuestion < quizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 500)
    } else {
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setShowResults(true)
      }, 2000)
    }
  }

  const getResults = (): QuizResult => {
    const learningStyle = answers.learning_style || 'visual'
    const personality = answers.personality || 'analytical'
    const goals = answers.goals || 'industry'
    const preferences = answers.preferences || 'balanced'

    // AI-like recommendation logic
    let recommendedCategories = ['Computer Science']
    let difficulty = 'Intermediate'
    let workload = 'Balanced'

    if (learningStyle === 'hands_on' || personality === 'practical') {
      recommendedCategories.push('Engineering', 'Applied Sciences')
    }
    if (learningStyle === 'discussion' || personality === 'collaborative') {
      recommendedCategories.push('Social Sciences', 'Business')
    }
    if (goals === 'research') {
      recommendedCategories.push('Mathematics', 'Natural Sciences')
      difficulty = 'Advanced'
    }
    if (goals === 'entrepreneurship') {
      recommendedCategories.push('Business', 'Economics')
    }
    if (preferences === 'intensive') {
      workload = 'Focused'
    }
    if (preferences === 'accelerated') {
      workload = 'Fast-paced'
    }

    return {
      learningStyle,
      personality,
      goals,
      preferences,
      recommendedCategories: Array.from(new Set(recommendedCategories)),
      difficulty,
      workload
    }
  }

  const results = getResults()

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-2">Your AI Profile is Ready!</h3>
          <p className="text-gray-300">Here's what we discovered about your learning preferences</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">Learning Style</h4>
              <p className="text-blue-200 capitalize">{results.learningStyle.replace('_', ' ')}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-2">Personality Type</h4>
              <p className="text-purple-200 capitalize">{results.personality}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">Academic Goals</h4>
              <p className="text-green-200 capitalize">{results.goals.replace('_', ' ')}</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-orange-300 mb-2">Workload Preference</h4>
              <p className="text-orange-200">{results.workload}</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6"
        >
          <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Recommended Course Categories
          </h4>
          <div className="flex flex-wrap gap-2">
            {results.recommendedCategories.map((category, index) => (
              <motion.span
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-200"
              >
                {category}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => {
            setShowResults(false)
            setCurrentQuestion(0)
            setAnswers({})
          }}
          className="w-full mt-6 btn-primary"
        >
          Take Quiz Again
        </motion.button>
      </motion.div>
    )
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-white mb-2">Analyzing Your Profile</h3>
        <p className="text-gray-300">Our AI is processing your responses...</p>
      </motion.div>
    )
  }

  const question = quizQuestions[currentQuestion]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-8"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Question {currentQuestion + 1} of {quizQuestions.length}</span>
          <span className="text-sm text-gray-400">{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold text-white mb-6">{question.question}</h3>
      </motion.div>

      {/* Options */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {question.options.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-6 bg-gray-800/30 border border-gray-700/50 rounded-xl hover:border-blue-500/30 hover:bg-gray-700/30 transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <option.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {option.label}
                  </h4>
                  <p className="text-gray-300 text-sm">{option.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 