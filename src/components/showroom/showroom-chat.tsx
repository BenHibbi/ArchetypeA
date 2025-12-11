'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ShowroomChatProps {
  sessionId: string
  designBrief?: string | null
}

export function ShowroomChat({ sessionId, designBrief }: ShowroomChatProps) {
  const t = useTranslations('showroom.chat')
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/showroom/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: newMessages,
          designBrief,
        }),
      })

      if (!res.ok) throw new Error('Chat failed')

      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: t('errorMessage') }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300',
          'flex items-center justify-center',
          'bg-gradient-to-br from-teal-500 to-teal-600 text-white',
          'hover:from-teal-600 hover:to-teal-700 hover:scale-110',
          'active:scale-95',
          isOpen && 'rotate-90'
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-40 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)]',
          'bg-white rounded-2xl shadow-2xl border border-slate-200',
          'transition-all duration-300 origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-3 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold">Alex</h3>
              <p className="text-xs text-teal-100">{t('subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-[300px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-50 flex items-center justify-center">
                <MessageCircle size={28} className="text-teal-500" />
              </div>
              <p className="text-slate-600 font-medium mb-1">{t('welcomeTitle')}</p>
              <p className="text-sm text-slate-400">{t('welcomeSubtitle')}</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] px-4 py-2.5 rounded-2xl text-sm',
                  message.role === 'user'
                    ? 'bg-teal-500 text-white rounded-br-md'
                    : 'bg-slate-100 text-slate-700 rounded-bl-md'
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-2 text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">{t('typing')}</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('placeholder')}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-50 rounded-full text-sm border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
