'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

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
        className="relative w-12 h-12 bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl flex items-center justify-center text-foreground-secondary hover:text-foreground-primary transition-all duration-300 hover:border-border hover:bg-background-secondary"
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
          className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-xl blur-sm"
        />
      </motion.button>

      {/* Theme indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-foreground-muted font-medium whitespace-nowrap"
      >
        {theme === 'dark' ? 'Dark' : 'Light'}
      </motion.div>
    </motion.div>
  )
}

// Advanced toggle with two options (Dark/Light)
export function ThemeToggleAdvanced() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'light', icon: Sun, label: 'Light' }
  ] as const

  return (
    <div className="flex items-center gap-1 bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl p-1">
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value
        
        return (
          <motion.button
            key={value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(value)}
            className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              isActive
                ? 'bg-gradient-to-r from-accent to-purple-600 text-white shadow-lg'
                : 'text-foreground-secondary hover:text-foreground-primary hover:bg-background-secondary/50'
            }`}
            title={label}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

// Compact theme toggle for mobile
export function ThemeToggleCompact() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="w-10 h-10 bg-background-secondary/50 backdrop-blur-sm border border-border/50 rounded-lg flex items-center justify-center text-foreground-secondary hover:text-foreground-primary transition-all duration-300 hover:border-border hover:bg-background-secondary"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </motion.div>
    </motion.button>
  )
} 