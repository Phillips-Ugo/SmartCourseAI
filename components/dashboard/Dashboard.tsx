'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import Header from '@/components/layout/Header'
import CourseRecommendationForm from './CourseRecommendationForm'
import CourseRecommendations from './CourseRecommendations'
import CourseSchedule from './CourseSchedule'
import GraduationProgress from './GraduationProgress'
import UniversityInfo from './UniversityDebug'
import AIChatbot from './AIChatbot'
import AICourseMatchingQuiz from './AICourseMatchingQuiz'
import StudyBuddyMatching from './StudyBuddyMatching'
import ProfessorRecommendations from './ProfessorRecommendations'
import PrerequisiteChainVisualization from './PrerequisiteChainVisualization'
import AcademicPerformanceDashboard from './AcademicPerformanceDashboard'
import CourseLoadOptimization from './CourseLoadOptimization'
import LearningPathOptimization from './LearningPathOptimization'
import AICourseCompatibilityMatrix from './AICourseCompatibilityMatrix'
import PeerTutoringNetwork from './PeerTutoringNetwork'
import PersonalizedStudyReminders from './PersonalizedStudyReminders'
import { 
  BookOpen, MessageCircle, User, GraduationCap, Calendar, Sparkles, Brain, Users, 
  GitBranch, BarChart3, Zap, Map, Grid3X3, Bell, ChevronRight, Home, Target,
  TrendingUp, Settings, Menu, X
} from 'lucide-react'
import { Course, CourseSection } from '@/lib/universities'
import { motion, AnimatePresence } from 'framer-motion'

interface ScheduledCourse {
  id: string
  course: Course
  section: CourseSection
  semester: string
}

type FeatureCategory = 'core' | 'ai' | 'social' | 'analytics' | 'planning'
type ActiveFeature = 'recommendations' | 'schedule' | 'chatbot' | 'quiz' | 'buddies' | 'professors' | 'prerequisites' | 'performance' | 'optimization' | 'learning-path' | 'compatibility' | 'tutoring' | 'reminders'

const featureCategories = {
  core: {
    name: 'Core Features',
    icon: Home,
    features: [
      { id: 'recommendations', name: 'Course Recommendations', icon: Sparkles, description: 'AI-powered course suggestions' },
      { id: 'schedule', name: 'Course Schedule', icon: Calendar, description: 'Plan your semester' },
      { id: 'chatbot', name: 'AI Assistant', icon: MessageCircle, description: 'Get help with registration' }
    ]
  },
  ai: {
    name: 'AI Tools',
    icon: Brain,
    features: [
      { id: 'quiz', name: 'AI Matching Quiz', icon: Target, description: 'Find your perfect courses' },
      { id: 'compatibility', name: 'Compatibility Matrix', icon: Grid3X3, description: 'Advanced course matching' }
    ]
  },
  social: {
    name: 'Social & Community',
    icon: Users,
    features: [
      { id: 'buddies', name: 'Study Buddies', icon: Users, description: 'Find study partners' },
      { id: 'professors', name: 'Professor Reviews', icon: User, description: 'Rate and review professors' },
      { id: 'tutoring', name: 'Peer Tutoring', icon: GraduationCap, description: 'Connect with tutors' }
    ]
  },
  analytics: {
    name: 'Analytics & Performance',
    icon: TrendingUp,
    features: [
      { id: 'performance', name: 'Academic Dashboard', icon: BarChart3, description: 'Track your progress' },
      { id: 'prerequisites', name: 'Prerequisite Chains', icon: GitBranch, description: 'Visualize course dependencies' }
    ]
  },
  planning: {
    name: 'Planning & Optimization',
    icon: Settings,
    features: [
      { id: 'optimization', name: 'Course Load Optimization', icon: Zap, description: 'Optimize your workload' },
      { id: 'learning-path', name: 'Learning Path', icon: Map, description: 'Plan your academic journey' },
      { id: 'reminders', name: 'Study Reminders', icon: Bell, description: 'Smart study scheduling' }
    ]
  }
}

const UNIVERSITY_OPTIONS = [
  { value: 'mit', label: 'MIT' },
  { value: 'stanford', label: 'Stanford' },
  { value: 'iit', label: 'Illinois Institute of Technology' },
];

export default function Dashboard() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<(Course & { reason: string })[]>([])
  const [scheduledCourses, setScheduledCourses] = useState<ScheduledCourse[]>([])
  const [showChatbot, setShowChatbot] = useState(false)
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('recommendations')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Remove selectedUniversity state and university selector
  // Use user.university (or user.universityId) as the university prop
  const university = user?.university || user?.universityId || 'mit';

  // Optionally, reset recommendations/courses when university changes
  useEffect(() => {
    setRecommendations([]);
    setScheduledCourses([]);
  }, [university]);

  const handleGetRecommendations = (courses: (Course & { reason: string })[]) => {
    setRecommendations(courses)
  }

  const handleAddCourse = (course: Course, section: CourseSection) => {
    const newScheduledCourse: ScheduledCourse = {
      id: `${course.id}-${section.id}`,
      course,
      section,
      semester: 'Fall 2024'
    }
    setScheduledCourses(prev => [...prev, newScheduledCourse])
  }

  const handleRemoveCourse = (courseId: string) => {
    setScheduledCourses(prev => prev.filter(c => c.id !== courseId))
  }

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'recommendations':
        return (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Course Recommendations</h2>
              <p className="text-gray-300 mb-4">This is the recommendations feature. It should show course recommendation forms and results.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <CourseRecommendationForm onGetRecommendations={handleGetRecommendations} university={university} />
                  <GraduationProgress university={university} />
                  <UniversityInfo university={university} />
                </div>
              </div>
              <div className="lg:col-span-2">
                <CourseRecommendations courses={recommendations} university={university} />
              </div>
            </div>
          </div>
        )
      case 'schedule':
        return <CourseSchedule scheduledCourses={scheduledCourses} onRemoveCourse={handleRemoveCourse} onAddCourse={handleAddCourse} university={university} />
      case 'chatbot':
        return <AIChatbot university={university} />
      case 'quiz':
        return <AICourseMatchingQuiz university={university} />
      case 'buddies':
        return <StudyBuddyMatching university={university} />
      case 'professors':
        return <ProfessorRecommendations university={university} />
      case 'prerequisites':
        return <PrerequisiteChainVisualization university={university} />
      case 'performance':
        return <AcademicPerformanceDashboard university={university} />
      case 'optimization':
        return <CourseLoadOptimization university={university} />
      case 'learning-path':
        return <LearningPathOptimization university={university} />
      case 'compatibility':
        return <AICourseCompatibilityMatrix university={university} />
      case 'tutoring':
        return <PeerTutoringNetwork university={university} />
      case 'reminders':
        return <PersonalizedStudyReminders university={university} />
      default:
        return (
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Feature Not Found</h2>
            <p className="text-gray-300 mb-4">The feature "{activeFeature}" is not implemented yet.</p>
            <button 
              onClick={() => setActiveFeature('recommendations')}
              className="btn-primary"
            >
              Go to Recommendations
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="flex dashboard-layout">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : 0 }}
          className={`fixed lg:sidebar-stable z-40 w-80 bg-gray-800/90 backdrop-blur-xl border-r border-gray-700/50 shadow-2xl transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="h-full flex flex-col p-6">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">SmartCourseAI</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="mb-8 p-4 glass-card rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-gray-400">{user?.university}</p>
                </div>
              </div>
              <div className="text-sm text-gray-300">
                <p>Level: {user?.level}</p>
                <p>Interests: {user?.interests.slice(0, 2).join(', ')}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto space-y-2">
              {Object.entries(featureCategories).map(([categoryKey, category]) => (
                <div key={categoryKey} className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <category.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                      {category.name}
                    </span>
                  </div>
                  {category.features.map((feature) => (
                    <motion.button
                      key={feature.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveFeature(feature.id as ActiveFeature)
                        setSidebarOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        activeFeature === feature.id
                          ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }`}
                    >
                      <feature.icon className="w-4 h-4 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{feature.name}</p>
                        <p className="text-xs text-gray-400 truncate">{feature.description}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 lg:ml-0 overflow-hidden">
          <main className="content-scrollable p-6">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between mb-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold text-white">SmartCourseAI</h1>
              <div className="w-10" />
            </div>

            {/* Welcome Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-300 text-lg">
                Ready to discover your next courses? Let AI guide your academic journey.
              </p>
            </motion.div>

            {/* Remove the <select> and label for university selection from the main content area */}
            {/* <div className="mb-6 flex items-center gap-4">
              <label htmlFor="university-select" className="text-white font-semibold">University:</label>
              <select
                id="university-select"
                value={university}
                onChange={e => setUniversity(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {UNIVERSITY_OPTIONS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div> */}

            {/* Content Area */}
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Current feature: {activeFeature}</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[500px]"
              >
                {renderFeatureContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center z-50"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>
    </div>
  )
} 