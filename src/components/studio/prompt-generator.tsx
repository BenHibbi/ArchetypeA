'use client'

import { useState, useEffect } from 'react'
import { Copy, Check, Sparkles, ChevronDown, ChevronRight, Loader2, RefreshCw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface Response {
  ambiance: string | null
  valeurs: string | null
  structure: string | null
  typo: string | null
  ratio: string | null
  palette: string | null
  moodboard_likes: string[]
  features: string[]
  voice_analysis?: string | null
  screenshot_url?: string | null
}

interface Client {
  company_name?: string | null
  email: string
  website_url?: string | null
}

interface PromptGeneratorProps {
  client: Client
  response: Response
}

export function PromptGenerator({ client, response }: PromptGeneratorProps) {
  const t = useTranslations('studio.prompt')
  const tCommon = useTranslations('common')
  const [copied, setCopied] = useState(false)
  const [briefOpen, setBriefOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Parse voice analysis if available
  let voiceAnalysis = null
  if (response.voice_analysis) {
    try {
      voiceAnalysis = JSON.parse(response.voice_analysis)
    } catch {
      voiceAnalysis = null
    }
  }

  const generateBrief = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/analyst/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionnaire: {
            ambiance: response.ambiance,
            valeurs: response.valeurs,
            structure: response.structure,
            typo: response.typo,
            ratio: response.ratio,
            palette: response.palette,
            moodboard_likes: response.moodboard_likes,
            features: response.features,
          },
          voiceAnalysis,
          clientName: client.company_name || client.email.split('@')[0],
          websiteUrl: client.website_url,
          screenshotUrl: response.screenshot_url,
        }),
      })

      if (!res.ok) {
        throw new Error('Generation error')
      }

      const data = await res.json()
      setGeneratedBrief(data.brief)
      setBriefOpen(true)
    } catch (err) {
      console.error('Brief generation error:', err)
      setError(t('errorGenerating'))
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate brief on mount
  useEffect(() => {
    if (!generatedBrief && !isGenerating) {
      generateBrief()
    }
  }, [])

  const handleCopy = async () => {
    if (generatedBrief) {
      await navigator.clipboard.writeText(generatedBrief)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setBriefOpen(!briefOpen)}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 flex items-center justify-between hover:from-orange-600 hover:to-amber-600 transition-colors"
      >
        <div className="flex items-center gap-3">
          {briefOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          {isGenerating ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Sparkles size={20} />
          )}
          <h3 className="font-bold text-lg">
            {isGenerating ? t('generating') : t('title')}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {generatedBrief && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  generateBrief()
                }}
                disabled={isGenerating}
              >
                <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
              >
                {copied ? (
                  <><Check size={16} className="mr-2 text-green-200" /> {tCommon('copied')}</>
                ) : (
                  <><Copy size={16} className="mr-2" /> {t('copyPrompt')}</>
                )}
              </Button>
            </>
          )}
        </div>
      </button>

      {briefOpen && (
        <div className="p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Loader2 size={32} className="animate-spin mb-4 text-orange-500" />
              <p className="text-sm">{t('agentGenerating')}</p>
              <p className="text-xs text-slate-400 mt-1">{t('mayTakeMoment')}</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600 mb-3">{error}</p>
              <Button variant="outline" onClick={generateBrief}>
                <RefreshCw size={16} className="mr-2" />
                {tCommon('retry')}
              </Button>
            </div>
          ) : generatedBrief ? (
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto max-h-[500px] whitespace-pre-wrap font-mono">
              {generatedBrief}
            </pre>
          ) : null}
        </div>
      )}
    </div>
  )
}
