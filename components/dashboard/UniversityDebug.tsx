'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { getUniversityById, getGraduationRequirements } from '@/lib/universities'
import React from 'react';

export interface UniversityDebugProps {
  university: string;
}

const UniversityDebug: React.FC<UniversityDebugProps> = ({ university }) => {
  const { user } = useAuth()
  
  if (!user?.universityId) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Debug Info</h3>
        <p className="text-gray-300">No university ID found for user</p>
        <p className="text-sm text-gray-400">User university: {user?.university}</p>
      </div>
    )
  }

  const universityData = getUniversityById(user.universityId)
  const graduationRequirements = getGraduationRequirements(user.universityId)
  
  if (!universityData || !graduationRequirements) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Debug Info</h3>
        <p className="text-gray-300">University or requirements not found</p>
        <p className="text-sm text-gray-400">University ID: {user.universityId}</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-white mb-2">University Debug Info</h3>
      
      <div className="space-y-2 text-sm text-gray-300">
        <div>
          <strong className="text-gray-100">University:</strong> {universityData.name} ({universityData.id})
        </div>
        <div>
          <strong className="text-gray-100">Total Required Credits:</strong> {graduationRequirements.totalCredits}
        </div>
        <div>
          <strong className="text-gray-100">Credit System:</strong> {universityData.creditSystem}
        </div>
        
        <div className="mt-3">
          <strong className="text-gray-100">Graduation Requirements:</strong>
          <ul className="ml-4 mt-1 space-y-1">
            {Object.entries(graduationRequirements.categories).map(([category, req]) => (
              <li key={category} className="text-gray-400">
                {category}: {req.requiredCredits} credits - {req.description}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-3">
          <strong className="text-gray-100">User Completed Courses:</strong>
          <ul className="ml-4 mt-1 space-y-1">
            {Object.entries(user.completedCourses || {}).map(([category, data]) => (
              <li key={category} className="text-gray-400">
                {category}: {data.credits} credits ({data.courses.length} courses)
              </li>
            ))}
            {Object.keys(user.completedCourses || {}).length === 0 && (
              <li className="text-gray-400">No completed courses recorded</li>
            )}
          </ul>
        </div>
        
        <div className="mt-3">
          <strong className="text-gray-100">Available Courses:</strong> {universityData.courses.length}
          <ul className="ml-4 mt-1 space-y-1">
            {universityData.courses.slice(0, 3).map(course => (
              <li key={course.id} className="text-gray-400">
                {course.code} - {course.name} ({course.category})
              </li>
            ))}
            {universityData.courses.length > 3 && (
              <li className="text-gray-400">... and {universityData.courses.length - 3} more</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UniversityDebug; 