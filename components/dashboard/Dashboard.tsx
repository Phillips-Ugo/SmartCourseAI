'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import Header from '@/components/layout/Header'
import CourseRecommendationForm from './CourseRecommendationForm'
import CourseRecommendations from './CourseRecommendations'
import CourseSchedule from './CourseSchedule'
import GraduationProgress from './GraduationProgress'
import UniversityDebug from './UniversityDebug'
import AIChatbot from './AIChatbot'
import { BookOpen, MessageCircle, User, GraduationCap, Calendar } from 'lucide-react'
import { Course, CourseSection } from '@/lib/universities'

interface ScheduledCourse {
  id: string
  course: Course
  section: CourseSection
  semester: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<(Course & { reason: string })[]>([])
  const [scheduledCourses, setScheduledCourses] = useState<ScheduledCourse[]>([])
  const [showChatbot, setShowChatbot] = useState(false)
  const [activeTab, setActiveTab] = useState<'recommendations' | 'schedule' | 'chatbot'>('recommendations')

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to discover your next courses? Let AI guide your academic journey.
          </p>
        </div>

        {/* User Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">University</p>
                <p className="font-semibold">{user?.university}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-semibold">{user?.level}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Interests</p>
                <p className="font-semibold">{user?.interests.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Course Recommendations
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'schedule'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Course Schedule
          </button>
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'chatbot'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            AI Assistant
          </button>
        </div>

        {/* Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {activeTab === 'recommendations' ? (
            <>
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <CourseRecommendationForm onGetRecommendations={handleGetRecommendations} />
                  <GraduationProgress />
                  <UniversityDebug />
                </div>
              </div>
              <div className="lg:col-span-2">
                <CourseRecommendations courses={recommendations} />
              </div>
            </>
          ) : activeTab === 'schedule' ? (
            <div className="lg:col-span-3">
              <CourseSchedule 
                scheduledCourses={scheduledCourses}
                onRemoveCourse={handleRemoveCourse}
                onAddCourse={handleAddCourse}
              />
            </div>
          ) : (
            <div className="lg:col-span-3">
              <AIChatbot />
            </div>
          )}
        </div>

        {/* Floating Chat Button */}
        <button
          onClick={() => setShowChatbot(!showChatbot)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </main>
    </div>
  )
} 