'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Trash2, Plus } from 'lucide-react'
import { Course, CourseSection, Schedule } from '@/lib/universities'

interface ScheduledCourse {
  id: string
  course: Course
  section: CourseSection
  semester: string
}

interface CourseScheduleProps {
  scheduledCourses: ScheduledCourse[]
  onRemoveCourse: (courseId: string) => void
  onAddCourse: (course: Course, section: CourseSection) => void
}

export default function CourseSchedule({ 
  scheduledCourses, 
  onRemoveCourse, 
  onAddCourse 
}: CourseScheduleProps) {
  const [selectedSemester, setSelectedSemester] = useState('Fall 2024')
  const [showAddModal, setShowAddModal] = useState(false)

  const getDayColor = (day: string) => {
    const colors = {
      Monday: 'bg-red-100 text-red-800',
      Tuesday: 'bg-orange-100 text-orange-800',
      Wednesday: 'bg-yellow-100 text-yellow-800',
      Thursday: 'bg-green-100 text-green-800',
      Friday: 'bg-blue-100 text-blue-800',
      Saturday: 'bg-purple-100 text-purple-800',
      Sunday: 'bg-gray-100 text-gray-800'
    }
    return colors[day as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTimeSlot = (schedule: Schedule[]) => {
    if (schedule.length === 0) return 'TBA'
    
    const firstSlot = schedule[0]
    const lastSlot = schedule[schedule.length - 1]
    
    if (schedule.length === 1) {
      return `${firstSlot.startTime} - ${firstSlot.endTime}`
    }
    
    return `${firstSlot.startTime} - ${lastSlot.endTime}`
  }

  const getDaysString = (schedule: Schedule[]) => {
    const days = schedule.map(s => s.day.substring(0, 3))
    return days.join(', ')
  }

  const totalCredits = scheduledCourses.reduce((sum, scheduled) => sum + scheduled.course.credits, 0)

  const weeklySchedule = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    const schedule: { [key: string]: ScheduledCourse[] } = {}
    
    days.forEach(day => {
      schedule[day] = scheduledCourses.filter(scheduled => 
        scheduled.section.schedule.some(s => s.day === day)
      )
    })
    
    return schedule
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Schedule</h2>
          <p className="text-gray-600">Manage your enrolled courses and view your weekly schedule</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Semester Selector */}
      <div className="flex space-x-2">
        {['Fall 2024', 'Spring 2025', 'Summer 2025'].map((semester) => (
          <button
            key={semester}
            onClick={() => setSelectedSemester(semester)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedSemester === semester
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {semester}
          </button>
        ))}
      </div>

      {/* Credit Summary */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Credit Summary</h3>
            <p className="text-gray-600">{scheduledCourses.length} courses enrolled</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{totalCredits}</p>
            <p className="text-sm text-gray-600">Total Credits</p>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule</h3>
        <div className="grid grid-cols-5 gap-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
            <div key={day} className="space-y-2">
              <div className={`text-center py-2 rounded-lg font-medium ${getDayColor(day)}`}>
                {day.substring(0, 3)}
              </div>
              <div className="space-y-2">
                {weeklySchedule()[day]?.map((scheduled) => (
                  <div
                    key={scheduled.id}
                    className="p-2 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <p className="text-xs font-medium text-blue-900">
                      {scheduled.course.code}
                    </p>
                    <p className="text-xs text-blue-700">
                      {scheduled.section.schedule.find(s => s.day === day)?.startTime} - 
                      {scheduled.section.schedule.find(s => s.day === day)?.endTime}
                    </p>
                    <p className="text-xs text-blue-600">
                      {scheduled.section.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Courses</h3>
        {scheduledCourses.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No courses enrolled yet</p>
            <p className="text-sm text-gray-500">Add courses to see your schedule</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledCourses.map((scheduled) => (
              <div key={scheduled.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {scheduled.course.code} - {scheduled.course.name}
                      </h4>
                      <span className="text-sm text-gray-500">
                        Section {scheduled.section.sectionNumber}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeSlot(scheduled.section.schedule)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{getDaysString(scheduled.section.schedule)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{scheduled.section.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Instructor:</strong> {scheduled.section.instructor}</p>
                      <p><strong>Credits:</strong> {scheduled.course.credits}</p>
                      <p><strong>Enrollment:</strong> {scheduled.section.enrolled}/{scheduled.section.capacity}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onRemoveCourse(scheduled.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Add Course to Schedule</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-600">Course selection feature coming soon!</p>
                <p className="text-sm text-gray-500">You'll be able to browse and add courses here</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 