'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Star, 
  MessageSquare, 
  BookOpen, 
  Clock, 
  Target, 
  ThumbsUp, 
  ThumbsDown,
  Filter,
  Search,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  Zap,
  Heart,
  Eye
} from 'lucide-react'

interface Professor {
  id: string
  name: string
  avatar: string
  department: string
  university: string
  courses: string[]
  rating: number
  reviewCount: number
  difficulty: number
  workload: number
  clarity: number
  helpfulness: number
  availability: number
  overallScore: number
  tags: string[]
  bio: string
  officeHours: string
  officeLocation: string
  researchInterests: string[]
  isRecommended: boolean
  matchScore?: number
}

interface Review {
  id: string
  professorId: string
  studentName: string
  course: string
  semester: string
  rating: number
  difficulty: number
  workload: number
  clarity: number
  helpfulness: number
  comment: string
  date: string
  helpful: number
  notHelpful: number
}

export interface ProfessorRecommendationsProps {
  university: string;
}

export default function ProfessorRecommendations({ university }: ProfessorRecommendationsProps) {
  const [professors, setProfessors] = useState<Professor[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [selectedTab, setSelectedTab] = useState<'recommended' | 'all' | 'reviews'>('recommended')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockProfessors: Professor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        department: 'Computer Science',
        university: 'Georgia Institute of Technology',
        courses: ['CS 3600', 'CS 4641', 'CS 7641'],
        rating: 4.8,
        reviewCount: 156,
        difficulty: 3.2,
        workload: 3.5,
        clarity: 4.9,
        helpfulness: 4.7,
        availability: 4.6,
        overallScore: 4.7,
        tags: ['AI/ML Expert', 'Great Lecturer', 'Research-Oriented', 'Student-Friendly'],
        bio: 'Leading researcher in artificial intelligence and machine learning. Passionate about making complex concepts accessible to students.',
        officeHours: 'Tuesdays 2-4 PM, Thursdays 1-3 PM',
        officeLocation: 'Klaus Advanced Computing Building 2341',
        researchInterests: ['Machine Learning', 'Computer Vision', 'Natural Language Processing'],
        isRecommended: true,
        matchScore: 95
      },
      {
        id: '2',
        name: 'Dr. Michael Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        department: 'Computer Science',
        university: 'Georgia Institute of Technology',
        courses: ['CS 1332', 'CS 2200', 'CS 3210'],
        rating: 4.6,
        reviewCount: 203,
        difficulty: 3.8,
        workload: 4.1,
        clarity: 4.4,
        helpfulness: 4.8,
        availability: 4.3,
        overallScore: 4.5,
        tags: ['Systems Expert', 'Hands-on Projects', 'Industry Experience', 'Mentor'],
        bio: 'Systems and architecture specialist with 15+ years of industry experience. Focuses on practical, real-world applications.',
        officeHours: 'Mondays 3-5 PM, Wednesdays 10-12 PM',
        officeLocation: 'College of Computing 016',
        researchInterests: ['Computer Architecture', 'Operating Systems', 'Distributed Systems'],
        isRecommended: true,
        matchScore: 88
      },
      {
        id: '3',
        name: 'Dr. Emily Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        department: 'Mathematics',
        university: 'Georgia Institute of Technology',
        courses: ['MATH 2605', 'MATH 3215', 'MATH 4317'],
        rating: 4.4,
        reviewCount: 89,
        difficulty: 4.2,
        workload: 3.9,
        clarity: 4.1,
        helpfulness: 4.5,
        availability: 4.7,
        overallScore: 4.3,
        tags: ['Theoretical Focus', 'Rigorous', 'Office Hours', 'Clear Explanations'],
        bio: 'Pure mathematics researcher specializing in linear algebra and abstract algebra. Dedicated to building strong mathematical foundations.',
        officeHours: 'Tuesdays 1-3 PM, Fridays 2-4 PM',
        officeLocation: 'Skiles Classroom Building 255',
        researchInterests: ['Linear Algebra', 'Abstract Algebra', 'Number Theory'],
        isRecommended: false,
        matchScore: 72
      }
    ]

    const mockReviews: Review[] = [
      {
        id: '1',
        professorId: '1',
        studentName: 'Alex M.',
        course: 'CS 3600',
        semester: 'Fall 2024',
        rating: 5,
        difficulty: 3,
        workload: 4,
        clarity: 5,
        helpfulness: 5,
        comment: 'Dr. Chen is absolutely amazing! Her lectures are crystal clear and she makes complex AI concepts so accessible. Her office hours are incredibly helpful and she genuinely cares about student success.',
        date: '2024-12-15',
        helpful: 23,
        notHelpful: 1
      },
      {
        id: '2',
        professorId: '1',
        studentName: 'Sarah K.',
        course: 'CS 3600',
        semester: 'Fall 2024',
        rating: 4,
        difficulty: 4,
        workload: 4,
        clarity: 4,
        helpfulness: 5,
        comment: 'Great professor, very knowledgeable. The course is challenging but she provides excellent resources and support. Highly recommend!',
        date: '2024-12-10',
        helpful: 15,
        notHelpful: 2
      }
    ]

    setTimeout(() => {
      setProfessors(mockProfessors)
      setReviews(mockReviews)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professor.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesDepartment = !filterDepartment || professor.department === filterDepartment
    const matchesRating = !filterRating || professor.rating >= parseFloat(filterRating)
    const matchesTab = selectedTab === 'all' || (selectedTab === 'recommended' && professor.isRecommended)
    return matchesSearch && matchesDepartment && matchesRating && matchesTab
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400'
    if (rating >= 4.0) return 'text-blue-400'
    if (rating >= 3.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2.5) return 'text-green-400 bg-green-500/10 border-green-500/20'
    if (difficulty <= 3.5) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    return 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current text-yellow-400' : 'text-gray-400'}`}
      />
    ))
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
        <h3 className="text-xl font-semibold text-white mb-2">Loading Professors</h3>
        <p className="text-gray-300">Finding the best professors for you...</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Professor Recommendations</h2>
          <p className="text-gray-300">Find the best professors based on student reviews and AI matching</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span>{filteredProfessors.length} professors</span>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search professors or courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-400"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-700/50"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Rating</label>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-gray-700/50"
      >
        <button
          onClick={() => setSelectedTab('recommended')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            selectedTab === 'recommended'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Recommended</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('all')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            selectedTab === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>All Professors</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('reviews')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            selectedTab === 'reviews'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Recent Reviews</span>
          </div>
        </button>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {(selectedTab === 'recommended' || selectedTab === 'all') && (
            <div className="grid gap-6">
              {filteredProfessors.map((professor, index) => (
                <motion.div
                  key={professor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 cursor-pointer hover:border-blue-500/30 transition-all duration-300"
                  onClick={() => setSelectedProfessor(professor)}
                >
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={professor.avatar}
                        alt={professor.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      {professor.isRecommended && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Heart className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{professor.name}</h3>
                          <p className="text-gray-400">{professor.department} • {professor.university}</p>
                        </div>
                        {professor.matchScore && (
                          <div className="text-right">
                            <div className="text-sm text-gray-400 mb-1">Match Score</div>
                            <div className="text-2xl font-bold text-gradient">{professor.matchScore}%</div>
                          </div>
                        )}
                      </div>

                      {/* Rating and Stats */}
                      <div className="flex items-center gap-6 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(professor.rating)}</div>
                          <span className={`font-semibold ${getRatingColor(professor.rating)}`}>
                            {professor.rating}
                          </span>
                          <span className="text-gray-400">({professor.reviewCount} reviews)</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(professor.difficulty)}`}>
                          Difficulty: {professor.difficulty}/5
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{professor.bio}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {professor.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-200">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Courses */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Courses Taught</h4>
                        <div className="flex flex-wrap gap-2">
                          {professor.courses.map(course => (
                            <span key={course} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-200">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-300"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-white mb-1">{review.studentName}</h4>
                      <p className="text-sm text-gray-400">{review.course} • {review.semester}</p>
                    </div>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{review.comment}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span>Clarity: {review.clarity}/5</span>
                      <span>Helpfulness: {review.helpfulness}/5</span>
                      <span>Difficulty: {review.difficulty}/5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        <span>{review.notHelpful}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Professor Detail Modal */}
      <AnimatePresence>
        {selectedProfessor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProfessor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-6 mb-8">
                <img
                  src={selectedProfessor.avatar}
                  alt={selectedProfessor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-2">{selectedProfessor.name}</h3>
                  <p className="text-gray-400 text-lg mb-4">{selectedProfessor.department} • {selectedProfessor.university}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(selectedProfessor.rating)}</div>
                      <span className={`text-xl font-bold ${getRatingColor(selectedProfessor.rating)}`}>
                        {selectedProfessor.rating}
                      </span>
                      <span className="text-gray-400">({selectedProfessor.reviewCount} reviews)</span>
                    </div>
                    {selectedProfessor.isRecommended && (
                      <div className="flex items-center gap-2 text-red-400">
                        <Heart className="w-5 h-5 fill-current" />
                        <span className="font-medium">AI Recommended</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">About</h4>
                    <p className="text-gray-300">{selectedProfessor.bio}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">Research Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProfessor.researchInterests.map(interest => (
                        <span key={interest} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-200">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">Office Hours</h4>
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-300 mb-2">
                        <Clock className="w-4 h-4" />
                        <span>{selectedProfessor.officeHours}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedProfessor.officeLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Course Ratings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Clarity</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(selectedProfessor.clarity / 5) * 100}%` }} />
                          </div>
                          <span className="text-white font-medium">{selectedProfessor.clarity}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Helpfulness</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(selectedProfessor.helpfulness / 5) * 100}%` }} />
                          </div>
                          <span className="text-white font-medium">{selectedProfessor.helpfulness}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Difficulty</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(selectedProfessor.difficulty / 5) * 100}%` }} />
                          </div>
                          <span className="text-white font-medium">{selectedProfessor.difficulty}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Workload</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-700 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(selectedProfessor.workload / 5) * 100}%` }} />
                          </div>
                          <span className="text-white font-medium">{selectedProfessor.workload}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">Courses Taught</h4>
                    <div className="space-y-2">
                      {selectedProfessor.courses.map(course => (
                        <div key={course} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                          <span className="text-white font-medium">{course}</span>
                          <button className="text-blue-400 hover:text-blue-300 text-sm">View Details</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-700/50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReviewForm(true)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Write a Review</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-300"
                >
                  <Calendar className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 