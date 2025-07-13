'use client'

import { useAuth } from '@/components/providers/AuthProvider'
import { LogOut, User, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-background-secondary/50 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">SmartCourseAI</h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2 bg-background-secondary/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
                  <User className="w-4 h-4 text-accent" />
                  <span className="text-sm text-foreground-primary font-medium">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-sm text-foreground-secondary hover:text-foreground-primary transition-all duration-300 hover:bg-background-secondary/50 rounded-lg px-3 py-2 border border-transparent hover:border-border"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 