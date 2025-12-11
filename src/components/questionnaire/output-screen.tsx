'use client'

import { Send, Check, PartyPopper, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { QuestionnaireAnswers } from '@/types'
import { INSPIRATIONS } from '@/config'
import { cn } from '@/lib/utils'

interface OutputScreenProps {
  answers: QuestionnaireAnswers
  moodboardLikes: string[]
  features: string[]
  customColors?: string[]
  websiteUrl?: string
  sessionId?: string
  onRestart?: () => void
  isDemo?: boolean
}

// Mapping des couleurs pour les palettes
const PALETTE_COLORS: Record<string, string[]> = {
  cold: ['#0f172a', '#2563eb', '#22d3ee', '#6366f1', '#7dd3fc'],
  warm: ['#f97316', '#fbbf24', '#f87171', '#fde047', '#e7e5e4'],
  bw: ['#000000', '#27272a', '#71717a', '#d4d4d8', '#ffffff'],
  accent: ['#ffffff', '#f4f4f5', '#e4e4e7', '#14b8a6', '#34d399'],
  pastel: ['#fecdd3', '#fbcfe8', '#e9d5ff', '#bae6fd', '#a7f3d0'],
}

// Mapping des styles typo pour preview
const TYPO_STYLES: Record<string, { className: string; sample: string }> = {
  fine: { className: 'font-sans font-light tracking-wide', sample: 'Aa Bb' },
  bold: { className: 'font-sans font-black tracking-tight uppercase', sample: 'AA BB' },
  serif: { className: 'font-serif italic', sample: 'Aa Bb' },
  modern: { className: 'font-sans font-medium', sample: 'Aa Bb' },
  variable: { className: 'font-mono', sample: 'Aa Bb' },
  retro: { className: 'font-serif font-bold', sample: 'Aa Bb' },
}

// Mapping des ambiances avec couleurs de fond
const AMBIANCE_STYLES: Record<string, { bg: string; text: string; accent: string }> = {
  minimal: { bg: 'bg-white', text: 'text-slate-900', accent: 'border-slate-200' },
  bold: { bg: 'bg-slate-900', text: 'text-white', accent: 'border-orange-500' },
  corporate: { bg: 'bg-slate-100', text: 'text-slate-800', accent: 'border-blue-500' },
  soft: { bg: 'bg-amber-50', text: 'text-amber-900', accent: 'border-amber-300' },
  futuristic: { bg: 'bg-slate-950', text: 'text-cyan-400', accent: 'border-cyan-500' },
  editorial: { bg: 'bg-stone-100', text: 'text-stone-900', accent: 'border-stone-400' },
}

export function OutputScreen({
  answers,
  moodboardLikes,
  features,
  customColors,
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
      return tQuestions(`${questionId}.options.${optionId}.label`)
    } catch {
      try {
        return tQuestions(`${questionId}.options.${optionId}`)
      } catch {
        return optionId
      }
    }
  }

  const handleSendBrief = () => {
    setSent(true)
  }

  // Get selected inspirations
  const selectedInspirations = moodboardLikes
    .map((id) => INSPIRATIONS.find((i) => i.id === id))
    .filter(Boolean)

  // Get palette colors
  const paletteColors =
    answers.palette === 'custom' && customColors?.length
      ? customColors
      : PALETTE_COLORS[answers.palette || 'accent'] || PALETTE_COLORS.accent

  // Get typo style
  const typoStyle = TYPO_STYLES[answers.typo || 'modern'] || TYPO_STYLES.modern

  // Get ambiance style
  const ambianceStyle = AMBIANCE_STYLES[answers.ambiance || 'minimal'] || AMBIANCE_STYLES.minimal

  // Get valeurs (can be comma-separated for multi-select)
  const valeurs = answers.valeurs?.split(',').map((v) => v.trim()) || []

  if (sent) {
    return (
      <div className="h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="max-w-2xl mx-auto w-full animate-zoom-in text-center">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="text-green-600" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('briefSent')}</h2>
            <p className="text-slate-500 text-lg mb-2">{t('thankYouMessage')}</p>
            <p className="text-slate-400">{t('teamAnalyzeMessage')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-180px)] md:h-[calc(100vh-180px)] flex flex-col max-w-6xl mx-auto w-full animate-zoom-in px-4 pb-24 md:pb-0">
      {/* Header - Fixed height */}
      <div className="text-center py-4 flex-shrink-0">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-2">
          <Sparkles size={14} />
          {t('title')}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Votre Brief Visuel</h1>
        <p className="text-slate-500 text-sm">{t('subtitle')}</p>
      </div>

      {/* Content Grid - Flexible height */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Column 1 - Ambiance & Typography */}
        <div className="flex flex-col gap-3">
          {/* Ambiance Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ambiance
              </span>
            </div>
            <div
              className={cn(
                'h-full flex items-center justify-center border-l-4',
                ambianceStyle.bg,
                ambianceStyle.accent
              )}
            >
              <span className={cn('text-xl font-bold', ambianceStyle.text)}>
                {getOptionLabel('ambiance', answers.ambiance)}
              </span>
            </div>
          </div>

          {/* Typography Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Typographie
              </span>
            </div>
            <div className="p-3 h-full flex items-center justify-center">
              <div className="bg-slate-50 rounded-lg p-3 text-center w-full">
                <span className={cn('text-3xl block', typoStyle.className)}>
                  {typoStyle.sample}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {getOptionLabel('typo', answers.typo)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 - Palette & Valeurs */}
        <div className="flex flex-col gap-3">
          {/* Palette Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Palette
              </span>
              <span className="text-[10px] text-slate-500">
                {getOptionLabel('palette', answers.palette)}
              </span>
            </div>
            <div className="p-3">
              <div className="flex gap-1.5 mb-2">
                {paletteColors.slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 aspect-square rounded-lg shadow-inner border border-slate-200"
                    style={{ backgroundColor: color.startsWith('bg-') ? undefined : color }}
                    {...(color.startsWith('bg-') && {
                      className: cn(
                        'flex-1 aspect-square rounded-lg shadow-inner border border-slate-200',
                        color
                      ),
                    })}
                  />
                ))}
              </div>
              <div className="flex gap-1.5 text-[8px] font-mono text-slate-400">
                {paletteColors.slice(0, 5).map((color, i) => (
                  <div key={i} className="flex-1 text-center truncate">
                    {color.startsWith('bg-') ? color.replace('bg-', '') : color}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Valeurs Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Valeurs
              </span>
            </div>
            <div className="p-3 flex flex-wrap gap-1.5 content-start">
              {valeurs.length > 0 ? (
                valeurs.map((v) => (
                  <span
                    key={v}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {getOptionLabel('valeurs', v)}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Non renseigné</span>
              )}
            </div>
          </div>
        </div>

        {/* Column 3 - Structure & Ratio */}
        <div className="flex flex-col gap-3">
          {/* Structure Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Structure
              </span>
            </div>
            <div className="p-3 flex flex-col h-full">
              <div className="bg-slate-900 rounded-lg p-2 aspect-[4/3] flex items-center justify-center flex-1">
                <StructurePreview type={answers.structure || 'standard'} />
              </div>
              <p className="text-center text-xs font-medium text-slate-700 mt-2">
                {getOptionLabel('structure', answers.structure)}
              </p>
            </div>
          </div>

          {/* Ratio Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ratio
              </span>
            </div>
            <div className="p-3 flex flex-col h-full justify-center">
              <RatioPreview type={answers.ratio || 'mix'} />
              <p className="text-center text-xs font-medium text-slate-700 mt-2">
                {getOptionLabel('ratio', answers.ratio)}
              </p>
            </div>
          </div>
        </div>

        {/* Column 4 - Moodboard & Features */}
        <div className="flex flex-col gap-3">
          {/* Moodboard Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Moodboard
              </span>
              <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-600">
                {selectedInspirations.length}
              </span>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-2 gap-1.5">
                {selectedInspirations.slice(0, 4).map((insp) => (
                  <div
                    key={insp!.id}
                    className="relative aspect-[4/3] rounded-md overflow-hidden group"
                  >
                    <Image src={insp!.image} alt={insp!.label} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-0.5 left-0.5 right-0.5 text-[8px] font-bold text-white truncate">
                      {insp!.label}
                    </span>
                  </div>
                ))}
              </div>
              {selectedInspirations.length > 4 && (
                <p className="text-center text-[10px] text-slate-400 mt-1">
                  +{selectedInspirations.length - 4} autre
                  {selectedInspirations.length - 4 > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex-1">
            <div className="px-3 py-2 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Features
              </span>
              <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">
                {features.length}
              </span>
            </div>
            <div className="p-2 overflow-y-auto max-h-[120px]">
              <div className="flex flex-wrap gap-1">
                {features.slice(0, 8).map((f) => (
                  <span
                    key={f}
                    className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200"
                  >
                    {f}
                  </span>
                ))}
                {features.length > 8 && (
                  <span className="text-[10px] text-slate-400">+{features.length - 8}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button - Sticky on mobile, normal on desktop */}
      <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto p-4 md:py-4 flex justify-center flex-shrink-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent md:bg-none pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4">
        {isDemo ? (
          <Button onClick={onRestart} variant="orange" size="lg" className="gap-2 shadow-xl">
            <Check size={18} /> {t('finishDemo')}
          </Button>
        ) : (
          <Button
            onClick={handleSendBrief}
            variant="orange"
            size="lg"
            className="gap-2 shadow-xl hover:scale-105 transition-transform"
          >
            <Send size={18} /> {t('sendBrief')}
          </Button>
        )}
      </div>
    </div>
  )
}

// Mini component for structure preview
function StructurePreview({ type }: { type: string }) {
  const baseClass = 'bg-teal-500/80 rounded'

  switch (type) {
    case 'simple':
      return (
        <div className="w-full h-full flex flex-col gap-1 p-1">
          <div className={cn(baseClass, 'h-2/3')} />
          <div className={cn(baseClass, 'h-1/3 opacity-50')} />
        </div>
      )
    case 'standard':
      return (
        <div className="w-full h-full flex flex-col gap-1 p-1">
          <div className={cn(baseClass, 'h-1/4')} />
          <div className={cn(baseClass, 'h-1/4')} />
          <div className={cn(baseClass, 'h-1/4')} />
          <div className={cn(baseClass, 'h-1/4 opacity-50')} />
        </div>
      )
    case 'rich':
      return (
        <div className="w-full h-full grid grid-cols-2 gap-0.5 p-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cn(baseClass)} />
          ))}
        </div>
      )
    case 'fullscreen':
      return (
        <div className="w-full h-full p-1">
          <div className={cn(baseClass, 'w-full h-full flex items-center justify-center')}>
            <div className="w-1/2 h-1/3 bg-white/30 rounded" />
          </div>
        </div>
      )
    case 'masonry':
      return (
        <div className="w-full h-full grid grid-cols-3 gap-0.5 p-1">
          <div className={cn(baseClass, 'row-span-2')} />
          <div className={cn(baseClass)} />
          <div className={cn(baseClass, 'row-span-2')} />
          <div className={cn(baseClass)} />
        </div>
      )
    case 'bento':
      return (
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-0.5 p-1">
          <div className={cn(baseClass, 'col-span-2')} />
          <div className={cn(baseClass)} />
          <div className={cn(baseClass)} />
          <div className={cn(baseClass, 'col-span-2')} />
        </div>
      )
    default:
      return (
        <div className="w-full h-full flex flex-col gap-1 p-1">
          <div className={cn(baseClass, 'h-1/3')} />
          <div className={cn(baseClass, 'h-1/3')} />
          <div className={cn(baseClass, 'h-1/3')} />
        </div>
      )
  }
}

// Mini component for ratio preview
function RatioPreview({ type }: { type: string }) {
  switch (type) {
    case 'image_heavy':
      return (
        <div className="flex gap-2 h-12">
          <div className="flex-[3] bg-gradient-to-br from-teal-400 to-cyan-500 rounded-md" />
          <div className="flex-1 flex flex-col gap-0.5 justify-center">
            <div className="h-1 bg-slate-300 rounded-full" />
            <div className="h-1 bg-slate-200 rounded-full w-3/4" />
          </div>
        </div>
      )
    case 'text_heavy':
      return (
        <div className="flex gap-2 h-12">
          <div className="flex-1 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-md" />
          <div className="flex-[3] flex flex-col gap-0.5 justify-center">
            <div className="h-1 bg-slate-300 rounded-full" />
            <div className="h-1 bg-slate-200 rounded-full" />
            <div className="h-1 bg-slate-200 rounded-full w-2/3" />
          </div>
        </div>
      )
    default: // mix
      return (
        <div className="flex gap-2 h-12">
          <div className="flex-1 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-md" />
          <div className="flex-1 flex flex-col gap-0.5 justify-center">
            <div className="h-1 bg-slate-300 rounded-full" />
            <div className="h-1 bg-slate-200 rounded-full w-3/4" />
          </div>
        </div>
      )
  }
}
