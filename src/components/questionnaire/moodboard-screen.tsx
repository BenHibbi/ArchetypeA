'use client'

import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { INSPIRATIONS } from '@/config'
import { InspirationCard } from './visualizations'

interface MoodboardScreenProps {
  likes: string[]
  onToggle: (id: string) => void
  onConfirm: () => void
}

export function MoodboardScreen({ likes, onToggle, onConfirm }: MoodboardScreenProps) {
  const t = useTranslations('questionnaire.moodboard')

  return (
    <div className="max-w-6xl mx-auto w-full animate-zoom-in h-[calc(100vh-180px)] flex flex-col">
      <div className="text-center mb-6 flex-shrink-0">
        <span className="text-teal-600 font-bold text-xs tracking-widest uppercase mb-2 block">
          Step 7
        </span>
        <h2 className="text-4xl font-bold text-slate-900">{t('title')}</h2>
        <p className="text-slate-500 text-lg mt-2">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 flex-1 overflow-y-auto pb-4">
        {INSPIRATIONS.map((inspiration) => (
          <InspirationCard
            key={inspiration.id}
            data={inspiration}
            isSelected={likes.includes(inspiration.id)}
            onToggle={() => onToggle(inspiration.id)}
          />
        ))}
      </div>

      <div className="flex justify-center pt-6 flex-shrink-0">
        <Button
          onClick={onConfirm}
          disabled={likes.length === 0}
          variant={likes.length > 0 ? 'default' : 'secondary'}
          size="xl"
          className={likes.length > 0 ? 'bg-slate-900 hover:bg-orange-500' : ''}
        >
          {t('continue')} ({likes.length} {t('selected')}) <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  )
}
