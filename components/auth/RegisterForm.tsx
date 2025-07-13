'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { getAllUniversities } from '@/lib/universities'

interface User {
  id: string
  email: string
  name: string
  university: string
  universityId?: string
  level: string
  interests: string[]
  completedCourses: {
    [category: string]: {
      courses: string[]
      credits: number
    }
  }
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    level: '',
    interests: '',
    completedSocialSciences: 0,
    completedHumanities: 0,
    completedMathematics: 0,
    completedNaturalSciences: 0,
    completedComputerScience: 0
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()

  const universities = getAllUniversities()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      // Find university to get the correct ID and requirements
      const university = getAllUniversities().find(uni => uni.name === formData.university)
      
      if (!university) {
        setError('Selected university not found. Please try again.')
        setIsLoading(false)
        return
      }

      console.log('Registering for university:', university.name, university.id)
      console.log('University requirements:', university.graduationRequirements)

      // Build completed courses object based on university-specific requirements
      const completedCourses: User['completedCourses'] = {}
      const requirementCategories = Object.keys(university.graduationRequirements.categories)
      
      // Map form data to university-specific categories
      const categoryMapping: { [key: string]: number } = {
        'Social Sciences': formData.completedSocialSciences,
        'Humanities': formData.completedHumanities,
        'Mathematics': formData.completedMathematics,
        'Natural Sciences': formData.completedNaturalSciences,
        'Computer Science': formData.completedComputerScience,
        'Computer Science Core': formData.completedComputerScience, // For universities that use this category
        'Humanities, Arts, and Social Sciences': formData.completedSocialSciences + formData.completedHumanities, // For MIT
        'Ways of Thinking': formData.completedSocialSciences + formData.completedHumanities, // For Stanford
        'Writing and Rhetoric': formData.completedHumanities, // For Stanford
        'Science Core': formData.completedNaturalSciences, // For MIT
      }

      requirementCategories.forEach(category => {
        const completedCount = categoryMapping[category] || 0
        if (completedCount > 0) {
          // Use university-specific credit values
          const creditPerCourse = category.includes('Natural Sciences') || category.includes('Science Core') ? 4 : 3
          completedCourses[category] = {
            courses: Array(completedCount).fill('Completed Course'),
            credits: completedCount * creditPerCourse
          }
        }
      })

      console.log('Completed courses mapping:', completedCourses)

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        university: formData.university,
        level: formData.level,
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        completedCourses
      })
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
          University
        </label>
        <select
          id="university"
          name="university"
          value={formData.university}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select your university</option>
          {universities.map((uni) => (
            <option key={uni.id} value={uni.name}>
              {uni.name} - {uni.location}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
          Academic Level
        </label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select your level</option>
          <option value="Freshman">Freshman</option>
          <option value="Sophomore">Sophomore</option>
          <option value="Junior">Junior</option>
          <option value="Senior">Senior</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
          Interests (comma-separated)
        </label>
        <input
          type="text"
          id="interests"
          name="interests"
          value={formData.interests}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., Computer Science, AI, Mathematics"
          required
        />
      </div>

      {/* Completed Courses Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Completed Courses</h3>
        <p className="text-sm text-gray-600 mb-4">
          Help us provide better recommendations by telling us about courses you've already completed.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="completedSocialSciences" className="block text-sm font-medium text-gray-700 mb-1">
              Social Sciences Courses
            </label>
            <select
              id="completedSocialSciences"
              name="completedSocialSciences"
              value={formData.completedSocialSciences}
              onChange={handleChange}
              className="input-field"
            >
              <option value={0}>0 courses</option>
              <option value={1}>1 course</option>
              <option value={2}>2 courses</option>
              <option value={3}>3 courses</option>
              <option value={4}>4+ courses</option>
            </select>
          </div>

          <div>
            <label htmlFor="completedHumanities" className="block text-sm font-medium text-gray-700 mb-1">
              Humanities Courses
            </label>
            <select
              id="completedHumanities"
              name="completedHumanities"
              value={formData.completedHumanities}
              onChange={handleChange}
              className="input-field"
            >
              <option value={0}>0 courses</option>
              <option value={1}>1 course</option>
              <option value={2}>2 courses</option>
              <option value={3}>3 courses</option>
              <option value={4}>4+ courses</option>
            </select>
          </div>

          <div>
            <label htmlFor="completedMathematics" className="block text-sm font-medium text-gray-700 mb-1">
              Mathematics Courses
            </label>
            <select
              id="completedMathematics"
              name="completedMathematics"
              value={formData.completedMathematics}
              onChange={handleChange}
              className="input-field"
            >
              <option value={0}>0 courses</option>
              <option value={1}>1 course</option>
              <option value={2}>2 courses</option>
              <option value={3}>3 courses</option>
              <option value={4}>4+ courses</option>
            </select>
          </div>

          <div>
            <label htmlFor="completedNaturalSciences" className="block text-sm font-medium text-gray-700 mb-1">
              Natural Sciences Courses
            </label>
            <select
              id="completedNaturalSciences"
              name="completedNaturalSciences"
              value={formData.completedNaturalSciences}
              onChange={handleChange}
              className="input-field"
            >
              <option value={0}>0 courses</option>
              <option value={1}>1 course</option>
              <option value={2}>2 courses</option>
              <option value={3}>3 courses</option>
              <option value={4}>4+ courses</option>
            </select>
          </div>

          <div>
            <label htmlFor="completedComputerScience" className="block text-sm font-medium text-gray-700 mb-1">
              Computer Science Courses
            </label>
            <select
              id="completedComputerScience"
              name="completedComputerScience"
              value={formData.completedComputerScience}
              onChange={handleChange}
              className="input-field"
            >
              <option value={0}>0 courses</option>
              <option value={1}>1 course</option>
              <option value={2}>2 courses</option>
              <option value={3}>3 courses</option>
              <option value={4}>4+ courses</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter your password"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-field"
          placeholder="Confirm your password"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
} 