'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { getGraduationRequirements } from '@/lib/universities'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import React from 'react';

export interface GraduationProgressProps {
  university: string;
}

const GraduationProgress: React.FC<GraduationProgressProps> = ({ university }) => {
  const { user } = useAuth()
  
  if (!user?.universityId) {
    console.log('No university ID found for user')
    return null
  }

  const graduationRequirements = getGraduationRequirements(user.universityId)
  
  if (!graduationRequirements) {
    console.log('No graduation requirements found for university:', user.universityId)
    return null
  }

  console.log('Graduation progress for:', user.university, user.universityId)
  console.log('Requirements:', graduationRequirements)
  console.log('User completed courses:', user.completedCourses)

  const totalRequiredCredits = graduationRequirements.totalCredits
  const totalCompletedCredits = Object.values(user.completedCourses || {}).reduce(
    (sum, category) => sum + category.credits, 0
  )
  const progressPercentage = Math.min((totalCompletedCredits / totalRequiredCredits) * 100, 100)

  const getCategoryProgress = (category: string) => {
    const required = graduationRequirements.categories[category]?.requiredCredits || 0
    const completed = user.completedCourses?.[category]?.credits || 0
    const percentage = required > 0 ? Math.min((completed / required) * 100, 100) : 0
    const remaining = Math.max(required - completed, 0)
    
    return {
      required,
      completed,
      percentage,
      remaining,
      status: completed >= required ? 'completed' : completed > 0 ? 'in-progress' : 'not-started'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'in-progress':
        return 'text-yellow-600'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Graduation Progress</h3>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">
            {totalCompletedCredits} / {totalRequiredCredits} credits
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round(progressPercentage)}% complete
        </p>
      </div>

      {/* Category Progress */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Requirements by Category</h4>
        {Object.keys(graduationRequirements.categories).map((category) => {
          const progress = getCategoryProgress(category)
          
          return (
            <div key={category} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(progress.status)}
                  <span className={`text-sm font-medium ${getStatusColor(progress.status)}`}>
                    {category}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {progress.completed} / {progress.required} credits
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div 
                  className="bg-primary-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600">
                  {graduationRequirements.categories[category].description}
                </p>
                {progress.remaining > 0 && (
                  <span className="text-xs text-red-600 font-medium">
                    {progress.remaining} credits needed
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommendations */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {Object.keys(graduationRequirements.categories).map((category) => {
            const progress = getCategoryProgress(category)
            if (progress.remaining > 0) {
              return (
                <li key={category} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    Complete {progress.remaining} more credits in <strong>{category}</strong>
                  </span>
                </li>
              )
            }
            return null
          })}
        </ul>
      </div>
    </div>
  )
} 

export default GraduationProgress; 