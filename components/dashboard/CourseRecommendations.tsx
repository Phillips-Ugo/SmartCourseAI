'use client'

import { useState } from 'react'
import { Course } from '@/lib/universities'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Clock, Users, Star, ChevronRight, Calendar, Target, Zap } from 'lucide-react'

interface CourseWithReason extends Course {
  reason: string
}

interface Props {
  courses: CourseWithReason[]
}

export default function CourseRecommendations({ courses }: Props) {
  const [selectedCourse, setSelectedCourse] = useState<CourseWithReason | null>(null)
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/10 border-green-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Computer Science': 'from-blue-500 to-blue-600',
      'Mathematics': 'from-purple-500 to-purple-600',
      'Natural Sciences': 'from-green-500 to-green-600',
      'Social Sciences': 'from-orange-500 to-orange-600',
      'Humanities': 'from-pink-500 to-pink-600',
      'default': 'from-gray-500 to-gray-600'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  if (courses.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-400">
            Fill out the form to get personalized course recommendations based on your interests and academic level.
          </p>
        </div>
      </div>
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
          <h2 className="text-2xl font-bold text-white mb-2">Recommended Courses</h2>
          <p className="text-gray-300">AI-powered suggestions tailored to your profile</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Zap className="w-4 h-4" />
          <span>{courses.length} recommendations</span>
        </div>
      </motion.div>

      {/* Course Grid */}
      <div className="grid gap-6">
        <AnimatePresence>
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredCourse(course.id)}
                onHoverEnd={() => setHoveredCourse(null)}
                className="glass-card p-6 cursor-pointer border-2 border-transparent hover:border-blue-500/30 transition-all duration-300"
                onClick={() => setSelectedCourse(selectedCourse?.id === course.id ? null : course)}
              >
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(course.category)} rounded-xl flex items-center justify-center`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {course.code}
                        </h3>
                        <p className="text-sm text-gray-400">{course.category}</p>
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                      {course.name}
                    </h4>
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </div>
                </div>

                                 {/* Course Details */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <Clock className="w-4 h-4 text-blue-400" />
                     <span>{course.credits} credits</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <Users className="w-4 h-4 text-purple-400" />
                     <span>{course.sections?.[0]?.enrolled || 0} enrolled</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <Star className="w-4 h-4 text-yellow-400" />
                     <span>4.2/5.0</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-300">
                     <Calendar className="w-4 h-4 text-green-400" />
                     <span>{course.offered}</span>
                   </div>
                 </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* AI Recommendation Reason */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-300 mb-1">Why this course?</p>
                      <p className="text-sm text-blue-200">{course.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>

              {/* Expanded Course Details */}
              <AnimatePresence>
                {selectedCourse?.id === course.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 glass-card p-6 border border-blue-500/20"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">Course Details</h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-300 mb-2">Prerequisites</h5>
                        <p className="text-sm text-gray-400">
                          {course.prerequisites || 'No prerequisites required'}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-300 mb-2">Learning Outcomes</h5>
                        <ul className="text-sm text-gray-400 space-y-1">
                          <li>• Understand core concepts and principles</li>
                          <li>• Apply theoretical knowledge to practical problems</li>
                          <li>• Develop critical thinking and analytical skills</li>
                        </ul>
                      </div>
                    </div>

                                         <div className="mt-6 pt-4 border-t border-gray-700/50">
                       <h5 className="font-medium text-gray-300 mb-3">Available Sections</h5>
                       <div className="space-y-2">
                         {course.sections?.slice(0, 3).map((section) => (
                           <div key={section.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                             <div>
                               <p className="text-sm font-medium text-white">{section.instructor}</p>
                               <p className="text-xs text-gray-400">
                                 {section.schedule.map(s => `${s.day} ${s.startTime}-${s.endTime}`).join(', ')}
                               </p>
                             </div>
                             <div className="text-right">
                               <p className="text-sm text-gray-300">{section.location}</p>
                               <p className="text-xs text-gray-400">{section.capacity - section.enrolled} seats left</p>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
} 