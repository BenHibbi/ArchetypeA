'use client'

import { Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { FEATURES_LIST } from '@/config'
import { cn } from '@/lib/utils'

interface FeaturesScreenProps {
  selectedFeatures: string[]
  onToggle: (feature: string) => void
  onGenerate: () => void
  isSubmitting?: boolean
}

export function FeaturesScreen({
  selectedFeatures,
  onToggle,
  onGenerate,
  isSubmitting,
}: FeaturesScreenProps) {
  const t = useTranslations('questionnaire.features')
  const tCommon = useTranslations('common')

  return (
    <div className="max-w-3xl mx-auto w-full animate-slide-in-from-bottom">
      <div className="text-center mb-10">
        <span className="text-teal-600 font-bold text-xs tracking-widest uppercase mb-2 block">
          Step 8
        </span>
        <h2 className="text-4xl font-bold text-slate-900">{t('title')}</h2>
        <p className="text-slate-500 text-lg mt-2">{t('subtitle')}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {FEATURES_LIST.map((feat) => (
          <button
            key={feat}
            onClick={() => onToggle(feat)}
            className={cn(
              'px-5 py-3 rounded-full font-medium transition-all text-sm border-2',
              selectedFeatures.includes(feat)
                ? 'bg-teal-600 border-teal-600 text-white shadow-lg scale-105'
                : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600'
            )}
          >
            {feat}
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onGenerate}
          disabled={isSubmitting}
          variant="orange"
          size="xl"
        >
          {isSubmitting ? (
            tCommon('loading')
          ) : (
            <>
              {t('continue')} <Zap size={20} className="fill-yellow-300 text-yellow-300" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
