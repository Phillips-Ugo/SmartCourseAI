'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Calendar, Clock, Zap, CheckCircle, X, Repeat, BookOpen, Sparkles, AlarmClock, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'

interface StudyReminder {
  id: string
  title: string
  description: string
  date: string // ISO
  time: string // HH:mm
  recurring: 'none' | 'daily' | 'weekly' | 'custom'
  course?: string
  type: 'study' | 'assignment' | 'exam' | 'other'
  aiSuggested?: boolean
  completed: boolean
}

export default function PersonalizedStudyReminders() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState<StudyReminder[]>([{
    id: '1',
    title: 'CS 3600: Study AI Chapter 4',
    description: 'Review search algorithms and complete practice problems.',
    date: '2024-06-10',
    time: '18:00',
    recurring: 'weekly',
    course: 'CS 3600',
    type: 'study',
    aiSuggested: true,
    completed: false
  }, {
    id: '2',
    title: 'MATH 2605: Linear Algebra Assignment',
    description: 'Finish problem set 5 before due date.',
    date: '2024-06-12',
    time: '20:00',
    recurring: 'none',
    course: 'MATH 2605',
    type: 'assignment',
    aiSuggested: false,
    completed: false
  }])
  const [showAdd, setShowAdd] = useState(false)
  const [newReminder, setNewReminder] = useState<Omit<StudyReminder, 'id' | 'completed'>>({
    title: '',
    description: '',
    date: '',
    time: '',
    recurring: 'none',
    course: '',
    type: 'study',
    aiSuggested: false
  })
  const [editId, setEditId] = useState<string | null>(null)

  // Sort reminders by date/time
  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => {
      const aDate = new Date(`${a.date}T${a.time}`)
      const bDate = new Date(`${b.date}T${b.time}`)
      return aDate.getTime() - bDate.getTime()
    })
  }, [reminders])

  // Add or edit reminder
  const handleSave = () => {
    if (!newReminder.title || !newReminder.date || !newReminder.time) return
    if (editId) {
      setReminders(reminders => reminders.map(r => r.id === editId ? { ...r, ...newReminder } : r))
      setEditId(null)
    } else {
      setReminders(reminders => [
        ...reminders,
        {
          ...newReminder,
          id: Math.random().toString(36).slice(2),
          completed: false
        }
      ])
    }
    setShowAdd(false)
    setNewReminder({
      title: '',
      description: '',
      date: '',
      time: '',
      recurring: 'none',
      course: '',
      type: 'study',
      aiSuggested: false
    })
  }

  // Mark as complete
  const handleComplete = (id: string) => {
    setReminders(reminders => reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r))
  }

  // Delete reminder
  const handleDelete = (id: string) => {
    setReminders(reminders => reminders.filter(r => r.id !== id))
  }

  // Edit reminder
  const handleEdit = (reminder: StudyReminder) => {
    setShowAdd(true)
    setEditId(reminder.id)
    setNewReminder({
      title: reminder.title,
      description: reminder.description,
      date: reminder.date,
      time: reminder.time,
      recurring: reminder.recurring,
      course: reminder.course || '',
      type: reminder.type,
      aiSuggested: reminder.aiSuggested || false
    })
  }

  // AI suggestions (mock)
  const aiSuggestions: StudyReminder[] = [
    {
      id: 'ai-1',
      title: 'AI Suggestion: Review for CS 1332 Quiz',
      description: 'Quiz on trees and graphs this Friday. Review notes and practice problems.',
      date: '2024-06-14',
      time: '19:00',
      recurring: 'none',
      course: 'CS 1332',
      type: 'study',
      aiSuggested: true,
      completed: false
    }
  ]

  // Timeline grouping
  const remindersByDate = useMemo(() => {
    const groups: { [date: string]: StudyReminder[] } = {}
    sortedReminders.forEach(reminder => {
      if (!groups[reminder.date]) groups[reminder.date] = []
      groups[reminder.date].push(reminder)
    })
    return groups
  }, [sortedReminders])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">
          Personalized Study Reminders
        </h2>
        <p className="text-gray-300">
          Never miss a study session, assignment, or exam. Let AI help you stay on track!
        </p>
      </motion.div>

      {/* Add/AI Suggestion Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Bell className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
        <button
          onClick={() => setReminders(reminders => [...reminders, ...aiSuggestions])}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Suggestions</span>
        </button>
      </motion.div>

      {/* Timeline/Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Upcoming Reminders</span>
        </h3>
        <div className="space-y-6">
          {Object.entries(remindersByDate).map(([date, reminders]) => (
            <div key={date}>
              <div className="text-sm font-medium text-blue-400 mb-2 flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="space-y-2">
                {reminders.map(reminder => (
                  <motion.div
                    key={reminder.id}
                    whileHover={{ x: 5 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-between ${
                      reminder.completed
                        ? 'bg-green-500/10 border-green-500/20'
                        : reminder.aiSuggested
                        ? 'bg-purple-500/10 border-purple-500/20'
                        : 'bg-gray-800/50 border-gray-700/50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {reminder.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                        {reminder.aiSuggested && <Sparkles className="w-4 h-4 text-purple-400" />}
                        <div className="font-semibold text-white">{reminder.title}</div>
                        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 ml-2">{reminder.type}</span>
                        {reminder.recurring !== 'none' && (
                          <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-300 ml-2 flex items-center space-x-1">
                            <Repeat className="w-3 h-3" />
                            <span>{reminder.recurring}</span>
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300 mb-1">{reminder.description}</div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{reminder.time}</span>
                        {reminder.course && <span className="text-blue-400">{reminder.course}</span>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button onClick={() => handleComplete(reminder.id)} className="p-2 text-green-400 hover:text-green-600">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleEdit(reminder)} className="p-2 text-blue-400 hover:text-blue-600">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(reminder.id)} className="p-2 text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => { setShowAdd(false); setEditId(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <AlarmClock className="w-5 h-5" />
                <span>{editId ? 'Edit Reminder' : 'Add Reminder'}</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={e => setNewReminder(r => ({ ...r, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={newReminder.description}
                    onChange={e => setNewReminder(r => ({ ...r, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={newReminder.date}
                      onChange={e => setNewReminder(r => ({ ...r, date: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                    <input
                      type="time"
                      value={newReminder.time}
                      onChange={e => setNewReminder(r => ({ ...r, time: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                    <select
                      value={newReminder.type}
                      onChange={e => setNewReminder(r => ({ ...r, type: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="study">Study</option>
                      <option value="assignment">Assignment</option>
                      <option value="exam">Exam</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Recurring</label>
                    <select
                      value={newReminder.recurring}
                      onChange={e => setNewReminder(r => ({ ...r, recurring: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                    >
                      <option value="none">None</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Course (optional)</label>
                  <input
                    type="text"
                    value={newReminder.course}
                    onChange={e => setNewReminder(r => ({ ...r, course: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-6">
                <button
                  onClick={() => { setShowAdd(false); setEditId(null); }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editId ? 'Save Changes' : 'Add Reminder'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 