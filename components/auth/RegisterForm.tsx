'use client'

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { getAllUniversities } from '@/lib/universities'
import { motion } from 'framer-motion'
import { User, Mail, Lock, GraduationCap, BookOpen, Eye, EyeOff, ChevronDown } from 'lucide-react'

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit} 
      className="space-y-6"
    >
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground-primary flex items-center gap-2">
          <User className="w-5 h-5 text-accent" />
          Basic Information
        </h3>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground-primary mb-2">
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
          <label htmlFor="email" className="block text-sm font-medium text-foreground-primary mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground-primary flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          Academic Information
        </h3>
        
        <div>
          <label htmlFor="university" className="block text-sm font-medium text-foreground-primary mb-2">
            University
          </label>
          <div className="relative">
            <select
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              className="input-field appearance-none pr-10"
              required
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.name}>
                  {uni.name} - {uni.location}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-foreground-primary mb-2">
            Academic Level
          </label>
          <div className="relative">
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="input-field appearance-none pr-10"
              required
            >
              <option value="">Select your level</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Graduate">Graduate</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-foreground-primary mb-2">
            Academic Interests
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
      </div>

      {/* Completed Courses Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground-primary flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-pink-400" />
          Completed Courses
        </h3>
        <p className="text-sm text-foreground-muted bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
          Help us provide better recommendations by telling us about courses you've already completed.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="completedSocialSciences" className="block text-sm font-medium text-foreground-primary mb-2">
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
            <label htmlFor="completedHumanities" className="block text-sm font-medium text-foreground-primary mb-2">
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
            <label htmlFor="completedMathematics" className="block text-sm font-medium text-foreground-primary mb-2">
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
            <label htmlFor="completedNaturalSciences" className="block text-sm font-medium text-foreground-primary mb-2">
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
            <label htmlFor="completedComputerScience" className="block text-sm font-medium text-foreground-primary mb-2">
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

      {/* Password Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground-primary flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-400" />
          Security
        </h3>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground-primary mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10 pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground-primary mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field pl-10 pr-10"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted hover:text-foreground-primary transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-4 rounded-xl backdrop-blur-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed text-lg py-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating account...</span>
          </div>
        ) : (
          'Create Account'
        )}
      </motion.button>
    </motion.form>
  )
} 