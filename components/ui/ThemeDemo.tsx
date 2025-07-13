'use client'

import { useTheme } from '@/components/providers/ThemeProvider'
import { motion } from 'framer-motion'
import { Sun, Moon, Palette, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function ThemeDemo() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { value: 'dark' as const, icon: Moon, label: 'Dark', description: 'Dark theme for low-light environments' },
    { value: 'light' as const, icon: Sun, label: 'Light', description: 'Light theme for bright environments' }
  ]

  return (
    <div className="space-y-8">
      {/* Theme Selector */}
      <div className="theme-card">
        <h2 className="text-2xl font-bold text-foreground-primary mb-6 flex items-center gap-2">
          <Palette className="w-6 h-6 text-accent" />
          Theme Settings
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {themes.map(({ value, icon: Icon, label, description }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                theme === value
                  ? 'border-accent bg-accent/10 shadow-lg'
                  : 'border-border hover:border-border-muted bg-background-secondary/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${theme === value ? 'text-accent' : 'text-foreground-muted'}`} />
                <span className={`font-semibold ${theme === value ? 'text-accent' : 'text-foreground-primary'}`}>
                  {label}
                </span>
                {theme === value && (
                  <CheckCircle className="w-4 h-4 text-accent ml-auto" />
                )}
              </div>
              <p className="text-sm text-foreground-secondary">{description}</p>
            </motion.button>
          ))}
        </div>

        <div className="text-sm text-foreground-muted bg-background-secondary/30 rounded-lg p-3 border border-border/50">
          💡 The theme preference is saved locally and will persist across sessions.
        </div>
      </div>

      {/* UI Elements Demo */}
      <div className="theme-card">
        <h3 className="text-xl font-semibold text-foreground-primary mb-4">UI Elements Preview</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Buttons */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground-primary">Buttons</h4>
            <div className="space-y-3">
              <button className="btn-primary w-full">Primary Button</button>
              <button className="btn-secondary w-full">Secondary Button</button>
              <button className="theme-button w-full px-4 py-2 rounded-lg">Theme Button</button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground-primary">Input Fields</h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Regular input"
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email input"
                className="theme-input w-full px-4 py-3 rounded-lg"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground-primary">Cards</h4>
            <div className="space-y-3">
              <div className="card p-4">
                <h5 className="font-medium text-foreground-primary mb-2">Regular Card</h5>
                <p className="text-foreground-secondary text-sm">This is a standard card component.</p>
              </div>
              <div className="theme-card p-4">
                <h5 className="font-medium text-foreground-primary mb-2">Theme Card</h5>
                <p className="text-foreground-secondary text-sm">This card adapts to the current theme.</p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground-primary">Alerts</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-foreground-primary">Success message</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-foreground-primary">Warning message</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                <Info className="w-5 h-5 text-accent" />
                <span className="text-sm text-foreground-primary">Info message</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <div className="theme-card">
        <h3 className="text-xl font-semibold text-foreground-primary mb-4">Color Palette</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-background-primary border border-border rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-foreground-secondary">Background Primary</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-background-secondary border border-border rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-foreground-secondary">Background Secondary</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-foreground-primary border border-border rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-foreground-secondary">Foreground Primary</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent border border-border rounded-lg mx-auto mb-2"></div>
            <p className="text-xs text-foreground-secondary">Accent Color</p>
          </div>
        </div>
      </div>

      {/* Current Theme Info */}
      <div className="theme-card">
        <h3 className="text-xl font-semibold text-foreground-primary mb-4">Current Theme Information</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground-primary mb-2">Theme Settings</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Current Theme:</span>
                <span className="text-foreground-primary font-medium">{theme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">Theme Class:</span>
                <span className="text-foreground-primary font-medium">{theme}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground-primary mb-2">CSS Variables</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground-secondary">--bg-primary:</span>
                <span className="text-foreground-primary font-mono">var(--bg-primary)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">--text-primary:</span>
                <span className="text-foreground-primary font-mono">var(--text-primary)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-secondary">--accent-color:</span>
                <span className="text-foreground-primary font-mono">var(--accent-color)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 