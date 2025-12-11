'use client'

import { useState } from 'react'
import { Check, Shield, Zap, Box, Star, Heart, ChevronRight, Palette } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Question, QuestionnaireAnswers } from '@/types'
import { cn } from '@/lib/utils'
import { VizAmbiance, VizStructure, VizRatio } from './visualizations'
import { Button } from '@/components/ui/button'

// Couleurs disponibles pour le color picker - palette étendue
const COLOR_PICKER_OPTIONS = [
  // Reds
  '#dc2626', '#ef4444', '#f87171', '#fca5a5',
  // Pinks
  '#db2777', '#ec4899', '#f472b6', '#f9a8d4',
  // Oranges
  '#ea580c', '#f97316', '#fb923c', '#fdba74',
  // Yellows
  '#ca8a04', '#eab308', '#facc15', '#fde047',
  // Limes
  '#65a30d', '#84cc16', '#a3e635', '#bef264',
  // Greens
  '#16a34a', '#22c55e', '#4ade80', '#86efac',
  // Teals
  '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4',
  // Cyans
  '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9',
  // Blues
  '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
  // Indigos
  '#4f46e5', '#6366f1', '#818cf8', '#a5b4fc',
  // Purples
  '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd',
  // Fuchsias
  '#c026d3', '#d946ef', '#e879f9', '#f0abfc',
  // Roses
  '#e11d48', '#f43f5e', '#fb7185', '#fda4af',
  // Neutrals
  '#000000', '#1f2937', '#374151', '#4b5563',
  '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb',
  '#f3f4f6', '#f9fafb', '#ffffff', '#fafaf9',
]

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

// Styles de typographie représentatifs
const TYPO_STYLES: Record<string, { labelStyle: string; sampleText: string; sampleStyle: string }> = {
  fine: {
    labelStyle: 'font-light tracking-wide',
    sampleText: 'Aa',
    sampleStyle: 'text-4xl font-extralight tracking-widest text-slate-400',
  },
  bold: {
    labelStyle: 'font-black tracking-tight uppercase',
    sampleText: 'Aa',
    sampleStyle: 'text-4xl font-black tracking-tighter uppercase text-slate-900',
  },
  serif: {
    labelStyle: 'font-serif italic',
    sampleText: 'Aa',
    sampleStyle: 'text-4xl font-serif italic text-slate-700',
  },
  modern: {
    labelStyle: 'font-medium',
    sampleText: 'Aa',
    sampleStyle: 'text-4xl font-medium text-slate-600',
  },
  variable: {
    labelStyle: 'font-mono tracking-tight',
    sampleText: 'Aa',
    sampleStyle: 'text-4xl font-mono font-bold text-slate-800 tracking-tight',
  },
  retro: {
    labelStyle: 'font-serif',
    sampleText: 'Aa',
    sampleStyle: 'text-4xl font-serif font-bold text-amber-700',
  },
}

interface QuestionScreenProps {
  question: Question
  questionIndex: number
  currentAnswer?: string
  onAnswer: (questionId: string, value: string) => void
  onMultiSelectConfirm?: () => void
  customColors?: string[]
  onCustomColorsChange?: (colors: string[]) => void
}

export function QuestionScreen({
  question,
  questionIndex,
  currentAnswer,
  onAnswer,
  onMultiSelectConfirm,
  customColors = [],
  onCustomColorsChange,
}: QuestionScreenProps) {
  const t = useTranslations('questionnaire.questions')
  const tCommon = useTranslations('questionnaire.moodboard')
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Parse multi-select values
  const selectedValues = question.multiSelect && currentAnswer
    ? currentAnswer.split(',').filter(Boolean)
    : []

  const handleSelect = (optionId: string, isColorPicker?: boolean) => {
    if (isColorPicker) {
      // Toggle color picker visibility
      setShowColorPicker(true)
      return
    }

    if (question.multiSelect) {
      // Toggle selection for multi-select
      const newValues = selectedValues.includes(optionId)
        ? selectedValues.filter(v => v !== optionId)
        : [...selectedValues, optionId]
      onAnswer(question.id, newValues.join(','))
    } else {
      // Single select - auto-advance
      setShowColorPicker(false)
      onAnswer(question.id, optionId)
    }
  }

  const handleColorToggle = (color: string) => {
    if (!onCustomColorsChange) return
    const newColors = customColors.includes(color)
      ? customColors.filter(c => c !== color)
      : customColors.length < 5
        ? [...customColors, color]
        : customColors // Max 5 colors
    onCustomColorsChange(newColors)
  }

  const handleCustomConfirm = () => {
    if (customColors.length > 0) {
      setShowColorPicker(false)
      onAnswer(question.id, 'custom')
    }
  }

  const isOptionSelected = (optionId: string) => {
    if (question.multiSelect) {
      return selectedValues.includes(optionId)
    }
    return currentAnswer === optionId
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

  const isTypoQuestion = question.id === 'typo'

  return (
    <div className="max-w-4xl mx-auto w-full animate-slide-in-from-right">
      <div className="mb-8 text-center">
        <span className="text-teal-600 font-bold text-xs tracking-widest uppercase mb-2 block">
          Step {questionIndex + 1} / 6
        </span>
        <h2 className="text-4xl font-bold text-slate-900 mb-2">{questionText}</h2>
        <p className="text-slate-500 text-lg">
          {subtitleText}
          {question.multiSelect && (
            <span className="block text-sm mt-1 text-teal-600">
              ({selectedValues.length} {tCommon('selected')})
            </span>
          )}
        </p>
      </div>

      <div className={cn('grid gap-4', question.layout)}>
        {question.options.map((opt) => {
          const isSelected = isOptionSelected(opt.id)
          const icon = ICONS[opt.id]
          const translation = getOptionTranslation(opt.id)
          const typoStyle = isTypoQuestion ? TYPO_STYLES[opt.id] : null

          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id, opt.isColorPicker)}
              className={cn(
                'relative p-4 rounded-xl border-2 text-left transition-all duration-200',
                'hover:scale-[1.02] active:scale-95 flex flex-col gap-2 group',
                isSelected
                  ? 'border-teal-500 ring-2 ring-teal-50 bg-teal-50/50'
                  : 'border-slate-100 bg-white hover:border-teal-200 hover:shadow-lg'
              )}
            >
              <div className="w-full">
                {/* Visualisations */}
                {question.id === 'ambiance' && opt.viz && <VizAmbiance type={opt.viz} />}
                {question.id === 'structure' && opt.viz && <VizStructure type={opt.viz} />}
                {question.id === 'ratio' && opt.viz && <VizRatio type={opt.viz} />}

                {/* Typography preview */}
                {isTypoQuestion && typoStyle && (
                  <div className="h-16 flex items-center justify-center mb-2">
                    <span className={typoStyle.sampleStyle}>{typoStyle.sampleText}</span>
                  </div>
                )}

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

                {/* Custom color picker preview */}
                {opt.isColorPicker && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {customColors.length > 0 ? (
                      customColors.map((c) => (
                        <div
                          key={c}
                          className="w-8 h-8 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: c }}
                        />
                      ))
                    ) : (
                      <div className="p-3 rounded-lg bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
                        <Palette size={24} className="text-white" />
                      </div>
                    )}
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
                  <span className={cn(
                    'text-lg font-bold block text-slate-800',
                    isTypoQuestion && typoStyle ? typoStyle.labelStyle : ''
                  )}>
                    {translation.label}
                  </span>
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

      {/* Color Picker Modal */}
      {showColorPicker && question.id === 'palette' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-in-from-bottom">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Choisis tes couleurs
              </h3>
              <button
                onClick={() => setShowColorPicker(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-500 text-sm mb-4">
              Sélectionne jusqu'à 5 couleurs pour ta palette personnalisée
            </p>

            {/* Selected colors preview */}
            <div className="flex gap-2 mb-4 min-h-[40px] items-center">
              {customColors.length > 0 ? (
                customColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleColorToggle(c)}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform relative group"
                    style={{ backgroundColor: c }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-full">
                      <Check size={16} className="text-white" />
                    </span>
                  </button>
                ))
              ) : (
                <span className="text-slate-400 text-sm">Aucune couleur sélectionnée</span>
              )}
            </div>

            {/* Color grid */}
            <div className="grid grid-cols-8 gap-2 mb-6 max-h-[300px] overflow-y-auto">
              {COLOR_PICKER_OPTIONS.map((color) => {
                const isColorSelected = customColors.includes(color)
                return (
                  <button
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all hover:scale-110',
                      isColorSelected
                        ? 'border-teal-500 ring-2 ring-teal-200 scale-110'
                        : 'border-transparent hover:border-slate-300',
                      color === '#ffffff' && 'border-slate-200'
                    )}
                    style={{ backgroundColor: color }}
                  >
                    {isColorSelected && (
                      <Check size={16} className={cn(
                        'mx-auto',
                        ['#ffffff', '#e5e7eb', '#fde047', '#facc15', '#fca5a5', '#f9a8d4', '#fdba74', '#86efac', '#5eead4', '#93c5fd', '#67e8f9', '#c4b5fd', '#d8b4fe'].includes(color)
                          ? 'text-slate-800'
                          : 'text-white'
                      )} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowColorPicker(false)}
              >
                Annuler
              </Button>
              <Button
                variant="orange"
                className="flex-1"
                onClick={handleCustomConfirm}
                disabled={customColors.length === 0}
              >
                Confirmer ({customColors.length}/5)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Continue button for multi-select */}
      {question.multiSelect && selectedValues.length > 0 && onMultiSelectConfirm && (
        <div className="mt-8 text-center">
          <Button
            onClick={onMultiSelectConfirm}
            variant="orange"
            size="lg"
            className="gap-2"
          >
            {tCommon('continue')}
            <ChevronRight size={18} />
          </Button>
        </div>
      )}
    </div>
  )
}
