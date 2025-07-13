'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="relative w-12 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 hover:border-gray-600/50 hover:bg-gray-700/50"
        aria-label="Toggle theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          initial={false}
          animate={{
            opacity: theme === 'dark' ? 0.3 : 0.1,
            scale: theme === 'dark' ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl blur-sm"
        />
      </motion.button>

      {/* Theme indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-medium"
      >
        {theme === 'dark' ? 'Dark' : 'Light'}
      </motion.div>
    </motion.div>
  )
}

// Alternative toggle with three options (Dark/Light/System)
export function ThemeToggleAdvanced() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'system', icon: Monitor, label: 'System' }
  ] as const

  return (
    <div className="flex items-center gap-1 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(value as 'dark' | 'light')}
          className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
            theme === value
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </motion.button>
      ))}
    </div>
  )
} 