'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { sendWelcomeEmail } from '@/lib/email'
import { getUniversityByName } from '@/lib/universities'

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

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('smartcourseai_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // This would be implemented with a notification system
    console.log(`[${type.toUpperCase()}] ${message}`)
  }

  const login = async (email: string, password: string) => {
    // Simulate API call
    setLoading(true)
    try {
      // In a real app, this would be an API call
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        university: 'Georgia Institute of Technology',
        universityId: 'gt',
        level: 'Sophomore',
        interests: ['Computer Science', 'AI', 'Mathematics'],
        completedCourses: {
          'Mathematics': {
            courses: ['MATH 1551', 'MATH 1552'],
            credits: 6
          },
          'Computer Science': {
            courses: ['CS 1301', 'CS 1331'],
            credits: 6
          }
        }
      }
      
      setUser(mockUser)
      localStorage.setItem('smartcourseai_user', JSON.stringify(mockUser))
    } catch (error) {
      throw new Error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: Omit<User, 'id'> & { password: string }) => {
    setLoading(true)
    try {
      // Find university ID based on name
      const university = getUniversityByName(userData.university)
      
      if (!university) {
        throw new Error('University not found')
      }

      console.log('Registering user for university:', university.name, university.id)
      console.log('User completed courses:', userData.completedCourses)
      
      // In a real app, this would be an API call
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        university: userData.university,
        universityId: university.id,
        level: userData.level,
        interests: userData.interests,
        completedCourses: userData.completedCourses || {}
      }
      
      console.log('Created user with university ID:', newUser.universityId)
      console.log('User completed courses:', newUser.completedCourses)
      
      setUser(newUser)
      localStorage.setItem('smartcourseai_user', JSON.stringify(newUser))
      
      // Send welcome email
      try {
        await sendWelcomeEmail({
          to: userData.email,
          name: userData.name,
          university: userData.university,
          level: userData.level
        })
        showNotification('Welcome email sent successfully!', 'success')
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        showNotification('Registration successful, but welcome email failed to send.', 'error')
        // Don't fail registration if email fails
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('smartcourseai_user')
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('smartcourseai_user', JSON.stringify(updatedUser));
    showNotification('Profile updated!', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, showNotification, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 