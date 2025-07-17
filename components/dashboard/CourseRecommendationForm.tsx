'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Course, getUniversityById } from '@/lib/universities'

interface CourseRecommendationFormProps {
  onGetRecommendations: (courses: (Course & { reason: string })[]) => void
}

export default function CourseRecommendationForm({ onGetRecommendations }: CourseRecommendationFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    additionalInterests: '',
    difficulty: 'Intermediate',
    semester: 'Fall 2024',
    careerGoals: '',
    completedCourses: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const generateRecommendations = async () => {
    setIsLoading(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Get university-specific courses and requirements
    const university = user?.universityId ? getUniversityById(user.universityId) : null
    const availableCourses = university?.courses || []
    const graduationRequirements = university?.graduationRequirements
    
    if (!university || !graduationRequirements) {
      console.log('No university or graduation requirements found for:', user?.universityId)
      onGetRecommendations([])
      setIsLoading(false)
      return
    }
    
    console.log('Generating recommendations for:', university.name)
    console.log('Available courses:', availableCourses.length)
    console.log('Graduation requirements:', graduationRequirements)
    console.log('User completed courses:', user?.completedCourses)
    
    const recommendedCourses: (Course & { reason: string })[] = []
    
    // 1. Add interest-based courses (4 courses)
    const interestBasedCourses = availableCourses.filter(course => {
      const matchesInterests = user?.interests.some(interest => 
        course.category.toLowerCase().includes(interest.toLowerCase()) ||
        course.name.toLowerCase().includes(interest.toLowerCase())
      )
      const matchesDifficulty = course.difficulty === formData.difficulty
      return matchesInterests && matchesDifficulty
    }).slice(0, 4)
    
    console.log('Interest-based courses found:', interestBasedCourses.length)
    
    interestBasedCourses.forEach(course => {
      recommendedCourses.push({
        ...course,
        reason: `Recommended based on your interests in ${user?.interests.join(', ')} and ${course.difficulty} level preference.`
      })
    })
    
    // 2. Add graduation requirement courses (2 courses)
    const requirementCategories = Object.keys(graduationRequirements.categories)
    const missingRequirements: string[] = []
    
    requirementCategories.forEach(category => {
      const requiredCredits = graduationRequirements.categories[category].requiredCredits
      const completedCredits = user?.completedCourses[category]?.credits || 0
      
      console.log(`${category}: ${completedCredits}/${requiredCredits} credits`)
      
      if (completedCredits < requiredCredits) {
        missingRequirements.push(category)
      }
    })
    
    console.log('Missing requirements:', missingRequirements)
    
    // Find courses that satisfy missing requirements
    const requirementCourses = availableCourses.filter(course => {
      const satisfiesMissingRequirement = course.satisfiesRequirements.some(req => 
        missingRequirements.includes(req)
      )
      const notAlreadyRecommended = !recommendedCourses.some(rec => rec.id === course.id)
      return satisfiesMissingRequirement && notAlreadyRecommended
    }).slice(0, 2)
    
    console.log('Requirement courses found:', requirementCourses.length)
    
    requirementCourses.forEach(course => {
      const satisfiedRequirements = course.satisfiesRequirements.filter(req => 
        missingRequirements.includes(req)
      )
      const category = satisfiedRequirements[0]
      const requiredCredits = graduationRequirements.categories[category]?.requiredCredits || 0
      const completedCredits = user?.completedCourses[category]?.credits || 0
      const remainingCredits = requiredCredits - completedCredits
      
      recommendedCourses.push({
        ...course,
        reason: `Required for graduation: satisfies ${satisfiedRequirements.join(', ')} requirements. You need ${remainingCredits} more credits in this category.`
      })
    })
    
    // 3. Add additional courses to fill up to 6 total
    const remainingSlots = 6 - recommendedCourses.length
    if (remainingSlots > 0) {
      const additionalCourses = availableCourses.filter(course => 
        !recommendedCourses.some(rec => rec.id === course.id)
      ).slice(0, remainingSlots)
      
      additionalCourses.forEach(course => {
        recommendedCourses.push({
          ...course,
          reason: `Additional recommendation: ${course.difficulty} level course in ${course.category} that fits your academic level.`
        })
      })
    }
    
    console.log('Final recommendations:', recommendedCourses.length)
    onGetRecommendations(recommendedCourses)
    setIsLoading(false)
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Get Course Recommendations</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Interests
          </label>
          <textarea
            name="additionalInterests"
            value={formData.additionalInterests}
            onChange={handleChange}
            className="input-field"
            rows={3}
            placeholder="Any additional interests or specific topics you'd like to explore?"
          />
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Difficulty Level
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Semester
          </label>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Fall 2024">Fall 2024</option>
            <option value="Spring 2025">Spring 2025</option>
            <option value="Summer 2025">Summer 2025</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Career Goals
          </label>
          <textarea
            name="careerGoals"
            value={formData.careerGoals}
            onChange={handleChange}
            className="input-field"
            rows={2}
            placeholder="What are your career goals? (e.g., Software Engineer, Data Scientist, Research)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recently Completed Courses
          </label>
          <textarea
            name="completedCourses"
            value={formData.completedCourses}
            onChange={handleChange}
            className="input-field"
            rows={2}
            placeholder="List any relevant courses you've recently completed"
          />
        </div>

        <button
          onClick={generateRecommendations}
          disabled={isLoading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating recommendations...</span>
            </div>
          ) : (
            'Get AI Recommendations'
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-600 mb-2">Current Profile</h3>
        <div className="text-sm text-blue-500 space-y-1">
          <p><strong>University:</strong> {user?.university}</p>
          <p><strong>Level:</strong> {user?.level}</p>
          <p><strong>Interests:</strong> {user?.interests.join(', ')}</p>
        </div>
      </div>
    </div>
  )
} 