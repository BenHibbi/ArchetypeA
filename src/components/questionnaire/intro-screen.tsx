'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/shared/logo'

interface IntroScreenProps {
  onStart: (businessName: string, websiteUrl: string) => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const t = useTranslations('questionnaire.intro')
  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')

  const normalizeUrl = (url: string): string => {
    if (!url) return ''
    let normalized = url.trim().toLowerCase()
    // Remove any existing protocol
    normalized = normalized.replace(/^(https?:\/\/)?(www\.)?/, '')
    // Add https://
    if (normalized) {
      normalized = `https://${normalized}`
    }
    return normalized
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (businessName.trim()) {
      onStart(businessName.trim(), normalizeUrl(websiteUrl))
    }
  }

  return (
    <div className="flex flex-col items-center justify-start md:justify-center min-h-[60vh] text-center space-y-6 md:space-y-8 animate-fade-in pb-[env(safe-area-inset-bottom)] pt-4 md:pt-0">
      <div className="relative mb-2 md:mb-4">
        <Logo size="lg" showText={false} />
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900">archetype</h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium tracking-wide">
          DESIGN INTELLIGENCE PROFILER
        </p>
      </div>

      <p className="max-w-md text-slate-400 text-sm md:text-base">{t('subtitle')}</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 pb-32 md:pb-0">
        <div className="text-left space-y-2">
          <Label htmlFor="businessName" className="text-slate-700">
            {t('businessName')} <span className="text-orange-500">*</span>
          </Label>
          <Input
            id="businessName"
            type="text"
            placeholder={t('businessPlaceholder')}
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="h-12 text-lg"
          />
        </div>

        <div className="text-left space-y-2">
          <Label htmlFor="websiteUrl" className="text-slate-700">
            {t('websiteUrl')}
          </Label>
          <Input
            id="websiteUrl"
            type="text"
            placeholder="www.example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

        <Button
          type="submit"
          variant="orange"
          size="xl"
          className="w-full mt-6"
          disabled={!businessName.trim()}
        >
          {t('start')} <ArrowRight size={20} />
        </Button>
      </form>
    </div>
  )
}
