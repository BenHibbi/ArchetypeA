'use client'

import { Check, Shield, Zap, Box, Star, Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Question, QuestionnaireAnswers } from '@/types'
import { cn } from '@/lib/utils'
import { VizAmbiance, VizStructure, VizRatio } from './visualizations'

// Icon pour Performance (TrendingUp personnalisé)
const TrendingUpIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const ICONS: Record<string, React.ReactNode> = {
  confiance: <Shield size={24} />,
  creativite: <Zap size={24} />,
  performance: <TrendingUpIcon size={24} />,
  simplicite: <Box size={24} />,
  luxe: <Star size={24} />,
  accessibilite: <Heart size={24} />,
}

interface QuestionScreenProps {
  question: Question
  questionIndex: number
  currentAnswer?: string
  onAnswer: (questionId: string, value: string) => void
}

export function QuestionScreen({
  question,
  questionIndex,
  currentAnswer,
  onAnswer,
}: QuestionScreenProps) {
  const t = useTranslations('questionnaire.questions')

  const handleSelect = (optionId: string) => {
    onAnswer(question.id, optionId)
  }

  // Get translated question text
  const questionText = t(`${question.id}.question`)
  const subtitleText = t(`${question.id}.subtitle`)

  // Helper to get translated option label and desc
  const getOptionTranslation = (optionId: string) => {
    const key = `${question.id}.options.${optionId}`
    try {
      // Try to get label/desc if it's an object
      const label = t(`${key}.label`)
      const desc = t(`${key}.desc`)
      return { label, desc }
    } catch {
      // Otherwise it's a simple string
      return { label: t(key), desc: undefined }
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full animate-slide-in-from-right">
      <div className="mb-8 text-center">
        <span className="text-teal-600 font-bold text-xs tracking-widest uppercase mb-2 block">
          Step {questionIndex + 1} / 6
        </span>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">{questionText}</h2>
        <p className="text-slate-500 text-lg">{subtitleText}</p>
      </div>

      <div className={cn('grid gap-4', question.layout)}>
        {question.options.map((opt) => {
          const isSelected = currentAnswer === opt.id
          const icon = ICONS[opt.id]
          const translation = getOptionTranslation(opt.id)

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                'hover:scale-[1.02] active:scale-95 flex flex-col gap-2 group',
                isSelected
                  ? 'border-teal-500 ring-2 ring-teal-50 bg-teal-50/50'
                  : 'border-slate-100 bg-white hover:border-teal-200 hover:shadow-lg',
                opt.style
              )}
            >
              <div className="w-full">
                {/* Visualisations */}
                {question.id === 'ambiance' && opt.viz && <VizAmbiance type={opt.viz} />}
                {question.id === 'structure' && opt.viz && <VizStructure type={opt.viz} />}
                {question.id === 'ratio' && opt.viz && <VizRatio type={opt.viz} />}

                {/* Palette de couleurs */}
                {opt.colors && (
                  <div className="flex gap-2 mb-2">
                    {opt.colors.map((c) => (
                      <div
                        key={c}
                        className={cn('w-8 h-8 rounded-full border border-black/5 shadow-sm', c)}
                      />
                    ))}
                  </div>
                )}

                {/* Icônes pour les valeurs */}
                {icon && (
                  <div
                    className={cn(
                      'p-3 rounded-lg bg-slate-50 w-fit mb-2',
                      isSelected ? 'text-teal-600' : 'text-slate-700'
                    )}
                  >
                    {icon}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center w-full mt-auto">
                <div>
                  <span className="text-lg font-bold block text-slate-800">{translation.label}</span>
                  {translation.desc && (
                    <span className="text-sm opacity-60 font-normal text-slate-500">
                      {translation.desc}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <div className="bg-teal-500 text-white p-1 rounded-full">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
