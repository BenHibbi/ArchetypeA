'use client'

import { Send, Check, PartyPopper, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { QuestionnaireAnswers } from '@/types'
import { QUESTIONS, SKELETONS } from '@/config'
import { createClient } from '@/lib/supabase/client'

interface OutputScreenProps {
  answers: QuestionnaireAnswers
  moodboardLikes: string[]
  features: string[]
  websiteUrl?: string
  sessionId?: string
  onRestart?: () => void
  isDemo?: boolean
}

export function OutputScreen({
  answers,
  moodboardLikes,
  features,
  websiteUrl,
  sessionId,
  onRestart,
  isDemo = false,
}: OutputScreenProps) {
  const [sent, setSent] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const getOptionLabel = (questionId: string, optionId?: string) => {
    if (!optionId) return 'Non défini'
    const question = QUESTIONS.find((q) => q.id === questionId)
    const option = question?.options.find((o) => o.id === optionId)
    return option?.label || optionId
  }

  const handleSendBrief = async () => {
    setIsSending(true)

    try {
      // Capture screenshot if website URL is provided
      if (websiteUrl && sessionId) {
        try {
          const screenshotResponse = await fetch('/api/screenshot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: websiteUrl }),
          })

          if (screenshotResponse.ok) {
            const { screenshot } = await screenshotResponse.json()

            // Save screenshot to response in DB
            const supabase = createClient()
            await supabase
              .from('responses')
              .update({ screenshot_url: screenshot })
              .eq('session_id', sessionId)
          }
        } catch (err) {
          console.error('Screenshot capture failed:', err)
          // Continue anyway - screenshot is not critical
        }
      }

      setSent(true)
    } finally {
      setIsSending(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-zoom-in text-center py-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Brief envoyé !
          </h2>
          <p className="text-slate-500 text-lg mb-2">
            Merci d'avoir complété le questionnaire.
          </p>
          <p className="text-slate-400">
            Notre équipe va analyser vos préférences et vous recontacter très vite
            avec une proposition personnalisée.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-zoom-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-teal-500" />
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="font-bold tracking-tight ml-2">archetype</span>
            </div>
            <h2 className="text-3xl font-bold mb-1">Votre Brief</h2>
            <p className="text-slate-400">Vérifiez vos choix avant d'envoyer.</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur text-center border border-white/10">
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Vibe
              </span>
              <span className="font-bold text-teal-400">
                {answers.ambiance?.toUpperCase()}
              </span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur text-center border border-white/10">
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                Palette
              </span>
              <span className="font-bold text-orange-400">
                {answers.palette?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Identité */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
              Identité
            </h3>
            <div className="space-y-4">
              {Object.keys(answers).map((key) => {
                const q = QUESTIONS.find((q) => q.id === key)
                const answer = answers[key as keyof QuestionnaireAnswers]
                const a = q?.options.find((o) => o.id === answer)
                if (!a) return null
                return (
                  <div key={key} className="flex justify-between items-center group">
                    <span className="text-slate-500 font-medium text-sm">
                      {q?.question.split('?')[0]}
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-sm group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      {a.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Structure & Features */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
              Structure & Features
            </h3>

            <div>
              <span className="text-slate-500 font-medium block mb-2 text-sm">
                Inspirations (Moodboard)
              </span>
              <div className="flex flex-wrap gap-2">
                {moodboardLikes.map((like) => (
                  <span
                    key={like}
                    className="text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded"
                  >
                    {SKELETONS.find((s) => s.id === like)?.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-medium block mb-2 text-sm">Modules</span>
              <div className="flex flex-wrap gap-2">
                {features.slice(0, 8).map((f) => (
                  <span
                    key={f}
                    className="text-xs border border-slate-200 text-slate-600 px-2 py-1 rounded bg-slate-50"
                  >
                    {f}
                  </span>
                ))}
                {features.length > 8 && (
                  <span className="text-xs text-slate-400 px-2 py-1">
                    +{features.length - 8}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 flex flex-col sm:flex-row gap-4 justify-center border-t border-slate-100">
          {isDemo ? (
            <Button onClick={onRestart} variant="orange" className="gap-2">
              <Check size={18} /> Terminer la démo
            </Button>
          ) : (
            <Button
              onClick={handleSendBrief}
              variant="orange"
              size="xl"
              className="gap-2"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Capture en cours...
                </>
              ) : (
                <>
                  <Send size={18} /> Envoyer mon brief
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
