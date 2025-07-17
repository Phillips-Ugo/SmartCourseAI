'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/components/providers/AuthProvider'
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Star, 
  Clock, 
  Target,
  UserPlus,
  UserCheck,
  UserX,
  Send,
  Filter,
  Search,
  Heart,
  Zap
} from 'lucide-react'

interface StudyBuddy {
  id: string
  name: string
  avatar: string
  university: string
  level: string
  interests: string[]
  courses: string[]
  studyStyle: string
  availability: string[]
  location: string
  rating: number
  reviewCount: number
  bio: string
  matchScore: number
  isOnline: boolean
  lastActive: string
}

interface StudyGroup {
  id: string
  name: string
  course: string
  members: StudyBuddy[]
  maxMembers: number
  meetingTime: string
  location: string
  description: string
  isActive: boolean
}

export interface StudyBuddyMatchingProps {
  university: string;
}

export default function StudyBuddyMatching({ university }: StudyBuddyMatchingProps) {
  const { user } = useAuth()
  const [buddies, setBuddies] = useState<StudyBuddy[]>([])
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [selectedTab, setSelectedTab] = useState<'buddies' | 'groups' | 'requests'>('buddies')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBuddy, setSelectedBuddy] = useState<StudyBuddy | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockBuddies: StudyBuddy[] = [
      {
        id: '1',
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        university: 'Georgia Institute of Technology',
        level: 'Sophomore',
        interests: ['Computer Science', 'AI', 'Mathematics'],
        courses: ['CS 3600', 'MATH 2605', 'CS 1332'],
        studyStyle: 'Collaborative',
        availability: ['Monday', 'Wednesday', 'Friday'],
        location: 'Atlanta, GA',
        rating: 4.8,
        reviewCount: 12,
        bio: 'Passionate about AI and machine learning. Looking for study partners for CS courses!',
        matchScore: 95,
        isOnline: true,
        lastActive: '2 minutes ago'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        university: 'Georgia Institute of Technology',
        level: 'Junior',
        interests: ['Computer Science', 'Data Science', 'Statistics'],
        courses: ['CS 3600', 'CS 4641', 'MATH 2605'],
        studyStyle: 'Visual Learner',
        availability: ['Tuesday', 'Thursday', 'Weekends'],
        location: 'Atlanta, GA',
        rating: 4.6,
        reviewCount: 8,
        bio: 'Data science enthusiast. Great at explaining complex concepts visually.',
        matchScore: 88,
        isOnline: false,
        lastActive: '1 hour ago'
      },
      {
        id: '3',
        name: 'Mike Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        university: 'Georgia Institute of Technology',
        level: 'Senior',
        interests: ['Computer Science', 'Software Engineering', 'Web Development'],
        courses: ['CS 3600', 'CS 1332', 'CS 2200'],
        studyStyle: 'Hands-on Practice',
        availability: ['Evenings', 'Weekends'],
        location: 'Atlanta, GA',
        rating: 4.9,
        reviewCount: 15,
        bio: 'Senior CS student with internship experience. Love helping others learn!',
        matchScore: 82,
        isOnline: true,
        lastActive: '5 minutes ago'
      }
    ]

    const mockGroups: StudyGroup[] = [
      {
        id: '1',
        name: 'AI Study Squad',
        course: 'CS 3600 - Introduction to AI',
        members: mockBuddies.slice(0, 2),
        maxMembers: 5,
        meetingTime: 'Mondays 6-8 PM',
        location: 'Klaus Advanced Computing Building',
        description: 'Weekly study sessions for CS 3600. We focus on algorithms and problem-solving.',
        isActive: true
      },
      {
        id: '2',
        name: 'Math Wizards',
        course: 'MATH 2605 - Linear Algebra',
        members: [mockBuddies[0]],
        maxMembers: 4,
        meetingTime: 'Wednesdays 4-6 PM',
        location: 'Skiles Classroom Building',
        description: 'Linear algebra study group. Great for understanding complex concepts.',
        isActive: true
      }
    ]

    setTimeout(() => {
      setBuddies(mockBuddies)
      setGroups(mockGroups)
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buddy.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCourse = !filterCourse || buddy.courses.includes(filterCourse)
    const matchesLevel = !filterLevel || buddy.level === filterLevel
    return matchesSearch && matchesCourse && matchesLevel
  })

  const handleConnect = (buddyId: string) => {
    // In real app, this would send a connection request
    console.log('Connecting with buddy:', buddyId)
  }

  const handleJoinGroup = (groupId: string) => {
    // In real app, this would join the study group
    console.log('Joining group:', groupId)
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-500/10 border-green-500/20'
    if (score >= 80) return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
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
        <h3 className="text-xl font-semibold text-white mb-2">Finding Study Buddies</h3>
        <p className="text-gray-300">Our AI is matching you with compatible students...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Study Buddy Matching</h2>
          <p className="text-gray-300">Connect with students taking similar courses</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Users className="w-4 h-4" />
          <span>{filteredBuddies.length} potential matches</span>
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
              placeholder="Search by name or course..."
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
                  <select
                    value={filterCourse}
                    onChange={(e) => setFilterCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Courses</option>
                    <option value="CS 3600">CS 3600 - Introduction to AI</option>
                    <option value="MATH 2605">MATH 2605 - Linear Algebra</option>
                    <option value="CS 1332">CS 1332 - Data Structures</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Level</label>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Levels</option>
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
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
          onClick={() => setSelectedTab('buddies')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            selectedTab === 'buddies'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Study Buddies</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('groups')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            selectedTab === 'groups'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Study Groups</span>
          </div>
        </button>
        <button
          onClick={() => setSelectedTab('requests')}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
            selectedTab === 'requests'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Requests</span>
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
          {selectedTab === 'buddies' && (
            <div className="grid gap-6">
              {filteredBuddies.map((buddy, index) => (
                <motion.div
                  key={buddy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 cursor-pointer hover:border-blue-500/30 transition-all duration-300"
                  onClick={() => setSelectedBuddy(buddy)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar and Online Status */}
                    <div className="relative">
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800 ${
                        buddy.isOnline ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{buddy.name}</h3>
                          <p className="text-sm text-gray-400">{buddy.level} • {buddy.university}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getMatchScoreColor(buddy.matchScore)}`}>
                          {buddy.matchScore}% match
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-gray-300 text-sm mb-4">{buddy.bio}</p>

                      {/* Courses */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Current Courses</h4>
                        <div className="flex flex-wrap gap-2">
                          {buddy.courses.map(course => (
                            <span key={course} className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-200">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span>{buddy.rating} ({buddy.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span>{buddy.lastActive}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-green-400" />
                          <span>{buddy.location}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConnect(buddy.id)
                          }}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Connect</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'groups' && (
            <div className="grid gap-6">
              {groups.map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-400">{group.course}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-400">
                        {group.members.length}/{group.maxMembers} members
                      </div>
                      <div className={`w-2 h-2 rounded-full ${group.isActive ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{group.description}</p>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>{group.meetingTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span>{group.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span>{group.members.length} members</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleJoinGroup(group.id)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Join Group</span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}

          {selectedTab === 'requests' && (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Pending Requests</h3>
              <p className="text-gray-400">
                When students send you connection requests, they'll appear here.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Buddy Detail Modal */}
      <AnimatePresence>
        {selectedBuddy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBuddy(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={selectedBuddy.avatar}
                  alt={selectedBuddy.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedBuddy.name}</h3>
                  <p className="text-gray-400 mb-2">{selectedBuddy.level} • {selectedBuddy.university}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getMatchScoreColor(selectedBuddy.matchScore)}`}>
                    {selectedBuddy.matchScore}% compatibility match
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-white mb-3">About</h4>
                  <p className="text-gray-300">{selectedBuddy.bio}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Study Preferences</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Study Style</h5>
                      <p className="text-white">{selectedBuddy.studyStyle}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-gray-400 mb-2">Availability</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedBuddy.availability.map(day => (
                          <span key={day} className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-200">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Current Courses</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBuddy.courses.map(course => (
                      <span key={course} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-200">
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-700/50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Send Connection Request</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 