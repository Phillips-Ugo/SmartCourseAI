'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface AIChatbotProps {
  university: string;
}

export default function AIChatbot({ university }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI course registration assistant. I can help you with questions about course selection, prerequisites, scheduling, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string) => {
    // Simulate AI response generation
    const responses = [
      "Based on your interests in Computer Science and AI, I'd recommend starting with CS 1332 (Data Structures) as it's a fundamental course that many advanced courses build upon.",
      "For course registration, you'll need to check your academic standing and ensure you meet any prerequisites. Have you completed the introductory programming courses?",
      "The typical course load is 12-18 credits per semester. Given your Sophomore level, I'd suggest 15-16 credits to maintain good academic progress.",
      "That's a great question! CS 3600 (Introduction to AI) would be perfect for you. It covers the basics of AI and machine learning, which aligns well with your interests.",
      "For scheduling conflicts, I recommend checking the course catalog for alternative sections or speaking with your academic advisor about course substitutions.",
      "The prerequisites for that course typically include CS 1332 and MATH 2605. Make sure you've completed these before registering.",
      "That course is usually offered in both Fall and Spring semesters. The Fall section tends to have more availability.",
      "Based on your career goals in software engineering, I'd suggest focusing on courses like Software Engineering, Database Systems, and Computer Networks.",
      "The course difficulty rating is based on student feedback and prerequisites. Intermediate courses usually require solid programming fundamentals.",
      "For credit transfer questions, you'll need to contact the registrar's office with the specific course details from your previous institution."
    ]
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Select a relevant response based on keywords
    let response = responses[Math.floor(Math.random() * responses.length)]
    
    if (userMessage.toLowerCase().includes('prerequisite')) {
      response = "The prerequisites for that course typically include CS 1332 and MATH 2605. Make sure you've completed these before registering."
    } else if (userMessage.toLowerCase().includes('schedule') || userMessage.toLowerCase().includes('time')) {
      response = "For scheduling conflicts, I recommend checking the course catalog for alternative sections or speaking with your academic advisor about course substitutions."
    } else if (userMessage.toLowerCase().includes('credit')) {
      response = "The typical course load is 12-18 credits per semester. Given your Sophomore level, I'd suggest 15-16 credits to maintain good academic progress."
    }
    
    return response
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await generateAIResponse(userMessage.text)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const suggestedQuestions = [
    "What are the prerequisites for CS 3600?",
    "How many credits should I take this semester?",
    "When is CS 1332 offered?",
    "What courses align with my AI interests?",
    "How do I resolve a scheduling conflict?"
  ]

  return (
    <div className="card h-[600px] flex flex-col">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI Course Assistant</h2>
          <p className="text-sm text-gray-600">Ask me anything about course registration and planning</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about courses, prerequisites, scheduling..."
          className="flex-1 input-field"
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
          className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
} 
