'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import Dashboard from '@/components/dashboard/Dashboard'
import Header from '@/components/layout/Header'
import { motion } from 'framer-motion'
import { Brain, MessageCircle, Target, Sparkles, ArrowRight, Star, Zap } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-purple-500 opacity-20"></div>
        </div>
      </div>
    )
  }

  if (user) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">AI-Powered Course Recommendations</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold mb-6"
            >
              Welcome to{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                SmartCourseAI
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your academic journey with intelligent course recommendations. 
              Let AI guide you to the perfect classes for your future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="btn-primary group flex items-center gap-2 text-lg px-8 py-4"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className="btn-secondary text-lg px-8 py-4"
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-8 text-center group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Recommendations</h3>
              <p className="text-gray-300 leading-relaxed">
                Get personalized course suggestions based on your interests, academic level, and career goals
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-8 text-center group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">AI Chatbot Assistant</h3>
              <p className="text-gray-300 leading-relaxed">
                Chat with our intelligent assistant for course registration questions and academic guidance
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-8 text-center group cursor-pointer"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Smart Planning</h3>
              <p className="text-gray-300 leading-relaxed">
                Plan your academic journey with detailed course information and graduation progress tracking
              </p>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">500+</div>
              <div className="text-gray-300">Courses Available</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">95%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">10k+</div>
              <div className="text-gray-300">Students Helped</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
              <div className="text-gray-300">AI Support</div>
            </div>
          </motion.div>

          {/* Auth Forms */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="max-w-md mx-auto"
          >
            <div className="glass-card p-8">
              <div className="flex mb-8 bg-gray-800/50 rounded-xl p-1">
                <button
                  onClick={() => setShowLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    showLogin
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setShowLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    !showLogin
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Register
                </button>
              </div>

              <motion.div
                key={showLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: showLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {showLogin ? <LoginForm /> : <RegisterForm />}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 