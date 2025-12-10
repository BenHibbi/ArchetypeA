'use client'

import { Send, Check, PartyPopper } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { QuestionnaireAnswers } from '@/types'
import { QUESTIONS, SKELETONS } from '@/config'

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
  websiteUrl: _websiteUrl,
  sessionId: _sessionId,
  onRestart,
  isDemo = false,
}: OutputScreenProps) {
  const t = useTranslations('questionnaire.output')
  const tQuestions = useTranslations('questionnaire.questions')
  const [sent, setSent] = useState(false)

  const getOptionLabel = (questionId: string, optionId?: string) => {
    if (!optionId) return 'N/A'
    try {
      // Try getting label from nested object first
      return tQuestions(`${questionId}.options.${optionId}.label`)
    } catch {
      // Fall back to simple string value
      try {
        return tQuestions(`${questionId}.options.${optionId}`)
      } catch {
        return optionId
      }
    }
  }

  const getQuestionText = (questionId: string) => {
    try {
      return tQuestions(`${questionId}.question`)
    } catch {
      return questionId
    }
  }

  const handleSendBrief = () => {
    setSent(true)
  }

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-zoom-in text-center py-20">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            {t('briefSent')}
          </h2>
          <p className="text-slate-500 text-lg mb-2">
            {t('thankYouMessage')}
          </p>
          <p className="text-slate-400">
            {t('teamAnalyzeMessage')}
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
            <h2 className="text-3xl font-bold mb-1">{t('title')}</h2>
            <p className="text-slate-400">{t('subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur text-center border border-white/10">
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                {t('vibe')}
              </span>
              <span className="font-bold text-teal-400">
                {answers.ambiance?.toUpperCase()}
              </span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur text-center border border-white/10">
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">
                {t('palette')}
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
              {t('identity')}
            </h3>
            <div className="space-y-4">
              {Object.keys(answers).map((key) => {
                const answer = answers[key as keyof QuestionnaireAnswers]
                if (!answer) return null
                return (
                  <div key={key} className="flex justify-between items-center group">
                    <span className="text-slate-500 font-medium text-sm">
                      {getQuestionText(key).split('?')[0]}
                    </span>
                    <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-sm group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                      {getOptionLabel(key, answer)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Structure & Features */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">
              {t('structureAndFeatures')}
            </h3>

            <div>
              <span className="text-slate-500 font-medium block mb-2 text-sm">
                {t('inspirations')}
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
              <span className="text-slate-500 font-medium block mb-2 text-sm">{t('modules')}</span>
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
              <Check size={18} /> {t('finishDemo')}
            </Button>
          ) : (
            <Button
              onClick={handleSendBrief}
              variant="orange"
              size="xl"
              className="gap-2"
            >
              <Send size={18} /> {t('sendBrief')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
