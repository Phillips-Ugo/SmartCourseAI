'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Star, MessageCircle, Video, BookOpen, Clock, MapPin, Award, CheckCircle, X, Heart, Zap, Target } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

interface Tutor {
  id: string
  name: string
  avatar: string
  university: string
  major: string
  year: string
  gpa: number
  subjects: string[]
  expertise: string[]
  rating: number
  reviewCount: number
  hourlyRate: number
  availability: string[]
  languages: string[]
  teachingStyle: 'visual' | 'hands-on' | 'theoretical' | 'mixed'
  experience: number // years
  bio: string
  certifications: string[]
  isOnline: boolean
  lastActive: string
}

interface TutoringSession {
  id: string
  tutorId: string
  studentId: string
  subject: string
  date: string
  time: string
  duration: number // minutes
  status: 'scheduled' | 'completed' | 'cancelled'
  meetingLink?: string
  notes?: string
}

interface TutoringRequest {
  id: string
  subject: string
  topics: string[]
  preferredTime: string[]
  budget: number
  urgency: 'low' | 'medium' | 'high'
  description: string
  status: 'open' | 'matched' | 'completed'
}

export default function PeerTutoringNetwork() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'find-tutor' | 'my-sessions' | 'requests' | 'become-tutor'>('find-tutor')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTutor, setSelectedTutor] = useState<string | null>(null)
  const [showTutorDetails, setShowTutorDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all')

  // Mock tutors data
  const tutors: Tutor[] = [
    {
      id: 'tutor-1',
      name: 'Sarah Johnson',
      avatar: '👩‍🎓',
      university: 'Georgia Tech',
      major: 'Computer Science',
      year: 'Senior',
      gpa: 3.9,
      subjects: ['CS 1332', 'CS 3600', 'MATH 2605', 'Data Structures', 'Algorithms'],
      expertise: ['Java Programming', 'Machine Learning', 'Linear Algebra', 'Problem Solving'],
      rating: 4.8,
      reviewCount: 47,
      hourlyRate: 25,
      availability: ['Monday', 'Wednesday', 'Friday', 'Weekends'],
      languages: ['English', 'Spanish'],
      teachingStyle: 'hands-on',
      experience: 2,
      bio: 'Passionate CS student with 2 years of tutoring experience. I love helping students understand complex algorithms and data structures through practical examples.',
      certifications: ['Python Programming', 'Data Science Fundamentals'],
      isOnline: true,
      lastActive: '2 minutes ago'
    },
    {
      id: 'tutor-2',
      name: 'Michael Chen',
      avatar: '👨‍🎓',
      university: 'Georgia Tech',
      major: 'Mathematics',
      year: 'Graduate Student',
      gpa: 3.8,
      subjects: ['MATH 1551', 'MATH 1552', 'MATH 2605', 'Calculus', 'Linear Algebra'],
      expertise: ['Calculus', 'Linear Algebra', 'Mathematical Proofs', 'Statistics'],
      rating: 4.9,
      reviewCount: 89,
      hourlyRate: 30,
      availability: ['Tuesday', 'Thursday', 'Saturday'],
      languages: ['English', 'Mandarin'],
      teachingStyle: 'theoretical',
      experience: 3,
      bio: 'Graduate student in Mathematics with a passion for teaching. I specialize in making complex mathematical concepts accessible and engaging.',
      certifications: ['Advanced Calculus', 'Mathematical Modeling'],
      isOnline: false,
      lastActive: '1 hour ago'
    },
    {
      id: 'tutor-3',
      name: 'Emily Rodriguez',
      avatar: '👩‍🎓',
      university: 'Georgia Tech',
      major: 'Computer Science',
      year: 'Junior',
      gpa: 3.7,
      subjects: ['CS 1301', 'CS 1331', 'Python', 'Object-Oriented Programming'],
      expertise: ['Python', 'Java', 'Web Development', 'Programming Fundamentals'],
      rating: 4.7,
      reviewCount: 32,
      hourlyRate: 20,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      languages: ['English', 'Portuguese'],
      teachingStyle: 'visual',
      experience: 1,
      bio: 'Junior CS student who loves teaching programming fundamentals. I use visual aids and real-world examples to make coding concepts clear.',
      certifications: ['Python Programming', 'Web Development'],
      isOnline: true,
      lastActive: '5 minutes ago'
    }
  ]

  // Mock sessions data
  const sessions: TutoringSession[] = [
    {
      id: 'session-1',
      tutorId: 'tutor-1',
      studentId: 'student-1',
      subject: 'CS 1332',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Need help with binary trees and graph algorithms'
    }
  ]

  // Mock requests data
  const requests: TutoringRequest[] = [
    {
      id: 'request-1',
      subject: 'CS 3600',
      topics: ['Search Algorithms', 'Knowledge Representation'],
      preferredTime: ['Evenings', 'Weekends'],
      budget: 30,
      urgency: 'medium',
      description: 'Need help understanding AI concepts and implementing search algorithms',
      status: 'open'
    }
  ]

  const subjects = useMemo(() => {
    const allSubjects = new Set(tutors.flatMap(tutor => tutor.subjects))
    return Array.from(allSubjects).sort()
  }, [tutors])

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutor.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesSubject = selectedSubject === 'all' || tutor.subjects.includes(selectedSubject)
      const matchesPrice = tutor.hourlyRate >= priceRange[0] && tutor.hourlyRate <= priceRange[1]
      const matchesAvailability = availabilityFilter === 'all' || tutor.availability.includes(availabilityFilter)
      
      return matchesSearch && matchesSubject && matchesPrice && matchesAvailability
    })
  }, [tutors, searchTerm, selectedSubject, priceRange, availabilityFilter])

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400'
    if (rating >= 4.0) return 'text-blue-400'
    if (rating >= 3.5) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400'
      case 'completed': return 'text-green-400'
      case 'cancelled': return 'text-red-400'
      case 'open': return 'text-yellow-400'
      case 'matched': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          Peer Tutoring Network
        </h2>
        <p className="text-gray-300">
          Connect with expert tutors and mentors for personalized learning
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex space-x-1 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl shadow-lg border border-gray-700/50"
      >
        <button
          onClick={() => setActiveTab('find-tutor')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'find-tutor'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Find Tutor</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('my-sessions')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'my-sessions'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Video className="w-4 h-4" />
            <span>My Sessions</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'requests'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Requests</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('become-tutor')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            activeTab === 'become-tutor'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Award className="w-4 h-4" />
            <span>Become Tutor</span>
          </div>
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === 'find-tutor' && (
          <motion.div
            key="find-tutor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filters */}
            <div className="glass-card p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search tutors or subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Availability</label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Any Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Weekends">Weekends</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tutors List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <motion.div
                  key={tutor.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="glass-card p-6 cursor-pointer"
                  onClick={() => {
                    setSelectedTutor(tutor.id)
                    setShowTutorDetails(true)
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{tutor.avatar}</div>
                      <div>
                        <div className="font-semibold text-white">{tutor.name}</div>
                        <div className="text-sm text-gray-400">{tutor.major} • {tutor.year}</div>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-1 ${getRatingColor(tutor.rating)}`}>
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{tutor.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Subjects</div>
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.slice(0, 3).map(subject => (
                          <span key={subject} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                        {tutor.subjects.length > 3 && (
                          <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">
                            +{tutor.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-green-400">${tutor.hourlyRate}/hr</div>
                      <div className="flex items-center space-x-2">
                        {tutor.isOnline ? (
                          <div className="flex items-center space-x-1 text-green-400">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs">Online</span>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400">
                            Last active {tutor.lastActive}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{tutor.reviewCount} reviews</span>
                      <span className="text-gray-400">{tutor.experience} years exp.</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'my-sessions' && (
          <motion.div
            key="my-sessions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">My Tutoring Sessions</h3>
              <div className="space-y-4">
                {sessions.map((session) => {
                  const tutor = tutors.find(t => t.id === session.tutorId)
                  return (
                    <div key={session.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{tutor?.avatar}</div>
                          <div>
                            <div className="font-medium text-white">{tutor?.name}</div>
                            <div className="text-sm text-gray-400">{session.subject}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </div>
                          <div className="text-sm text-gray-400">
                            {session.date} at {session.time}
                          </div>
                        </div>
                      </div>
                      {session.status === 'scheduled' && session.meetingLink && (
                        <div className="mt-3 pt-3 border-t border-gray-700/50">
                          <a
                            href={session.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Video className="w-4 h-4" />
                            <span>Join Meeting</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'requests' && (
          <motion.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Tutoring Requests</h3>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  New Request
                </button>
              </div>
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-white">{request.subject}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency} priority
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-3">{request.description}</div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">Budget: ${request.budget}/hr</span>
                        <span className="text-gray-400">Topics: {request.topics.join(', ')}</span>
                      </div>
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'become-tutor' && (
          <motion.div
            key="become-tutor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="glass-card p-6 text-center">
              <Award className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Become a Tutor</h3>
              <p className="text-gray-400 mb-6">
                Share your knowledge and earn money by helping other students succeed
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="font-semibold text-white mb-1">Flexible Hours</div>
                  <div className="text-sm text-gray-400">Set your own schedule</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="font-semibold text-white mb-1">Earn Money</div>
                  <div className="text-sm text-gray-400">Set your own rates</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="font-semibold text-white mb-1">Help Others</div>
                  <div className="text-sm text-gray-400">Make a difference</div>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300">
                Apply Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutor Details Modal */}
      <AnimatePresence>
        {showTutorDetails && selectedTutor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTutorDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const tutor = tutors.find(t => t.id === selectedTutor)
                if (!tutor) return null

                return (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-white">Tutor Profile</h3>
                      <button
                        onClick={() => setShowTutorDetails(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{tutor.avatar}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">{tutor.name}</div>
                        <div className="text-gray-400">{tutor.major} • {tutor.year} • GPA: {tutor.gpa}</div>
                        <div className="text-gray-400">{tutor.university}</div>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className={`flex items-center space-x-1 ${getRatingColor(tutor.rating)}`}>
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{tutor.rating}</span>
                          </div>
                          <span className="text-gray-400">({tutor.reviewCount} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">${tutor.hourlyRate}/hr</div>
                        <div className="text-sm text-gray-400">{tutor.experience} years experience</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-white mb-2">Bio</h4>
                      <p className="text-gray-300">{tutor.bio}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {tutor.subjects.map(subject => (
                            <span key={subject} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {tutor.expertise.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Availability</h4>
                        <div className="flex flex-wrap gap-2">
                          {tutor.availability.map(day => (
                            <span key={day} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {tutor.languages.map(lang => (
                            <span key={lang} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        <div className="flex items-center justify-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </div>
                      </button>
                      <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        <div className="flex items-center justify-center space-x-2">
                          <Video className="w-4 h-4" />
                          <span>Book Session</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 