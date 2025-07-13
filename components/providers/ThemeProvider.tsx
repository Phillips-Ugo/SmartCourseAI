'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    
    // Remove existing classes
    root.classList.remove('light', 'dark')
    
    // Add new class
    root.classList.add(newTheme)
    
    // Store preference
    localStorage.setItem('smartcourseai_theme', newTheme)
  }

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Get stored theme or default to dark
    const storedTheme = localStorage.getItem('smartcourseai_theme') as Theme
    const initialTheme = storedTheme || 'dark'
    
    setThemeState(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)
  }, [])

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return
    applyTheme(theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className="dark" 
        style={{ 
          visibility: 'hidden',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)'
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 