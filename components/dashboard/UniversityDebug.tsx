'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { getUniversityById, getGraduationRequirements } from '@/lib/universities'

export default function UniversityDebug() {
  const { user } = useAuth()
  
  if (!user?.universityId) {
    return (
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Debug Info</h3>
        <p className="text-yellow-800">No university ID found for user</p>
        <p className="text-sm text-yellow-700">User university: {user?.university}</p>
      </div>
    )
  }

  const university = getUniversityById(user.universityId)
  const graduationRequirements = getGraduationRequirements(user.universityId)
  
  if (!university || !graduationRequirements) {
    return (
      <div className="card bg-red-50 border-red-200">
        <h3 className="text-lg font-semibold text-red-900 mb-2">Debug Info</h3>
        <p className="text-red-800">University or requirements not found</p>
        <p className="text-sm text-red-700">University ID: {user.universityId}</p>
      </div>
    )
  }

  return (
    <div className="card bg-blue-50 border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">University Debug Info</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>University:</strong> {university.name} ({university.id})
        </div>
        <div>
          <strong>Total Required Credits:</strong> {graduationRequirements.totalCredits}
        </div>
        <div>
          <strong>Credit System:</strong> {university.creditSystem}
        </div>
        
        <div className="mt-3">
          <strong>Graduation Requirements:</strong>
          <ul className="ml-4 mt-1 space-y-1">
            {Object.entries(graduationRequirements.categories).map(([category, req]) => (
              <li key={category}>
                {category}: {req.requiredCredits} credits - {req.description}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-3">
          <strong>User Completed Courses:</strong>
          <ul className="ml-4 mt-1 space-y-1">
            {Object.entries(user.completedCourses || {}).map(([category, data]) => (
              <li key={category}>
                {category}: {data.credits} credits ({data.courses.length} courses)
              </li>
            ))}
            {Object.keys(user.completedCourses || {}).length === 0 && (
              <li className="text-gray-600">No completed courses recorded</li>
            )}
          </ul>
        </div>
        
        <div className="mt-3">
          <strong>Available Courses:</strong> {university.courses.length}
          <ul className="ml-4 mt-1 space-y-1">
            {university.courses.slice(0, 3).map(course => (
              <li key={course.id}>
                {course.code} - {course.name} ({course.category})
              </li>
            ))}
            {university.courses.length > 3 && (
              <li className="text-gray-600">... and {university.courses.length - 3} more</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
} 