'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { QUESTIONS, INSPIRATIONS, COPY_FEEDBACK_DURATION } from '@/config'

interface Inspiration {
  nom: string
  elements_apprecies?: string
}

interface VisualStyle {
  ambiance?: string
  typographie?: string
  couleurs_souhaitees?: string[]
}

interface VoiceAnalysis {
  vision_globale?: string
  inspirations?: Inspiration[]
  style_visuel?: VisualStyle
  fonctionnalites?: string[]
  ton_marque?: string
  keywords?: string[]
  raw?: string
}

interface Response {
  ambiance: string | null
  valeurs: string | null
  structure: string | null
  typo: string | null
  ratio: string | null
  palette: string | null
  moodboard_likes: string[]
  features: string[]
  voice_transcription?: string | null
  voice_analysis?: string | null
  business_name?: string | null
  website_url?: string | null
}

interface ResponseSummaryProps {
  response: Response
}

export function ResponseSummary({ response }: ResponseSummaryProps) {
  const t = useTranslations('studio.response')
  const tCommon = useTranslations('common')
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false)
  const [voiceOpen, setVoiceOpen] = useState(false)

  const getOptionLabel = (questionId: string, optionId: string | null) => {
    if (!optionId) return t('notAnswered')
    const question = QUESTIONS.find((q) => q.id === questionId)
    const option = question?.options.find((o) => o.id === optionId)
    return option?.label || optionId
  }

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), COPY_FEEDBACK_DURATION)
  }

  // Préparer le JSON des réponses questionnaire
  const questionnaireData = {
    preferences_design: {
      ambiance: { id: response.ambiance, label: getOptionLabel('ambiance', response.ambiance) },
      valeurs: { id: response.valeurs, label: getOptionLabel('valeurs', response.valeurs) },
      structure: { id: response.structure, label: getOptionLabel('structure', response.structure) },
      typographie: { id: response.typo, label: getOptionLabel('typo', response.typo) },
      ratio: { id: response.ratio, label: getOptionLabel('ratio', response.ratio) },
      palette: { id: response.palette, label: getOptionLabel('palette', response.palette) },
    },
    moodboard: response.moodboard_likes?.map(id => {
      const inspiration = INSPIRATIONS.find(i => i.id === id)
      return {
        id,
        label: inspiration?.label || id,
        concept: inspiration?.concept || '',
        prompt: inspiration?.prompt || ''
      }
    }) || [],
    features: response.features || []
  }

  // Parser l'analyse vocale si disponible
  let voiceAnalysis: VoiceAnalysis | null = null
  if (response.voice_analysis) {
    try {
      voiceAnalysis = JSON.parse(response.voice_analysis) as VoiceAnalysis
    } catch {
      voiceAnalysis = { raw: response.voice_analysis }
    }
  }

  const items = [
    { label: t('ambiance'), value: getOptionLabel('ambiance', response.ambiance), id: response.ambiance },
    { label: t('value'), value: getOptionLabel('valeurs', response.valeurs), id: response.valeurs },
    { label: t('structure'), value: getOptionLabel('structure', response.structure), id: response.structure },
    { label: t('typography'), value: getOptionLabel('typo', response.typo), id: response.typo },
    { label: t('ratio'), value: getOptionLabel('ratio', response.ratio), id: response.ratio },
    { label: t('palette'), value: getOptionLabel('palette', response.palette), id: response.palette },
  ]

  return (
    <div className="space-y-4">
      {/* Business Info */}
      {(response.business_name || response.website_url) && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3">
            <h3 className="font-bold text-white">
              {t('clientInfo')}
            </h3>
          </div>
          <div className="p-6">
            {response.business_name && (
              <div className="mb-3">
                <span className="text-xs text-teal-600 uppercase tracking-wider font-medium">{t('businessName')}</span>
                <h3 className="text-xl font-bold text-slate-900">{response.business_name}</h3>
              </div>
            )}
            {response.website_url && (
              <a
                href={response.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 hover:underline text-sm"
              >
                <ExternalLink size={14} />
                {response.website_url}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Section Questionnaire - Accordéon */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setQuestionnaireOpen(!questionnaireOpen)}
          className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-4 flex items-center justify-between hover:from-slate-700 hover:to-slate-600 transition-colors"
        >
          <div className="flex items-center gap-3">
            {questionnaireOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <h3 className="font-bold text-lg">{t('questionnaireResponses')}</h3>
          </div>
          <div
            role="button"
            tabIndex={0}
            className="inline-flex items-center text-sm text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(JSON.stringify(questionnaireData, null, 2), 'questionnaire')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
                copyToClipboard(JSON.stringify(questionnaireData, null, 2), 'questionnaire')
              }
            }}
          >
            {copiedSection === 'questionnaire' ? (
              <><Check size={16} className="mr-2 text-green-400" /> {tCommon('copied')}</>
            ) : (
              <><Copy size={16} className="mr-2" /> {t('copyJson')}</>
            )}
          </div>
        </button>

        {questionnaireOpen && (
          <div className="p-6 space-y-6">
            {/* Préférences Design */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t('designPreferences')}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {items.map((item) => (
                  <div
                    key={item.label}
                    className="bg-slate-50 rounded-lg p-3 border border-slate-100"
                  >
                    <span className="text-xs text-slate-400 block mb-1">
                      {item.label}
                    </span>
                    <span className="font-semibold text-slate-900">{item.value}</span>
                    <span className="text-xs text-slate-400 ml-2">({item.id})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Moodboard - Inspirations */}
            {response.moodboard_likes && response.moodboard_likes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {t('moodboard')} ({response.moodboard_likes.length} {t('selections')})
                </h4>
                <div className="space-y-3">
                  {response.moodboard_likes.map((id) => {
                    const inspiration = INSPIRATIONS.find((i) => i.id === id)
                    return (
                      <div
                        key={id}
                        className="bg-slate-50 rounded-lg p-4 border border-slate-100"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-bold bg-slate-900 text-white px-3 py-1 rounded-full shrink-0">
                            {inspiration?.label || id}
                          </span>
                          {inspiration?.concept && (
                            <p className="text-sm text-slate-600 italic">
                              {inspiration.concept}
                            </p>
                          )}
                        </div>
                        {inspiration?.prompt && (
                          <div className="mt-3 bg-white rounded-md p-3 border border-slate-200">
                            <span className="text-xs text-slate-400 uppercase font-medium block mb-1">Prompt</span>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {inspiration.prompt}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Features */}
            {response.features && response.features.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {t('features')} ({response.features.length} {t('selectedFeatures')})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {response.features.map((feature) => (
                    <span
                      key={feature}
                      className="text-sm font-medium bg-teal-100 text-teal-800 px-3 py-1.5 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section Analyse Vocale - Accordéon */}
      {voiceAnalysis && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setVoiceOpen(!voiceOpen)}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-4 flex items-center justify-between hover:from-orange-600 hover:to-yellow-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              {voiceOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <h3 className="font-bold text-lg">{t('voiceAnalysis')}</h3>
            </div>
            <div
              role="button"
              tabIndex={0}
              className="inline-flex items-center text-sm text-white hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                copyToClipboard(JSON.stringify(voiceAnalysis, null, 2), 'voice')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation()
                  copyToClipboard(JSON.stringify(voiceAnalysis, null, 2), 'voice')
                }
              }}
            >
              {copiedSection === 'voice' ? (
                <><Check size={16} className="mr-2 text-green-200" /> {tCommon('copied')}</>
              ) : (
                <><Copy size={16} className="mr-2" /> {t('copyJson')}</>
              )}
            </div>
          </button>

          {voiceOpen && (
            <div className="p-6 space-y-4">
              {voiceAnalysis.vision_globale && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <span className="text-xs font-bold text-orange-600 uppercase">{t('globalVision')}</span>
                  <p className="text-slate-800 mt-1">{voiceAnalysis.vision_globale}</p>
                </div>
              )}

              {voiceAnalysis.inspirations && voiceAnalysis.inspirations.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">{t('mentionedInspirations')}</span>
                  <div className="mt-2 space-y-2">
                    {voiceAnalysis.inspirations.map((insp: { nom?: string; elements_apprecies?: string }, i: number) => (
                      <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <span className="font-semibold text-slate-900">{insp.nom}</span>
                        {insp.elements_apprecies && (
                          <p className="text-sm text-slate-500 mt-1">{insp.elements_apprecies}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {voiceAnalysis.style_visuel && (voiceAnalysis.style_visuel.ambiance || voiceAnalysis.style_visuel.typographie || (voiceAnalysis.style_visuel.couleurs_souhaitees && voiceAnalysis.style_visuel.couleurs_souhaitees.length > 0)) && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">{t('desiredVisualStyle')}</span>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {voiceAnalysis.style_visuel.ambiance && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <span className="text-xs text-slate-400">{t('ambiance')}</span>
                        <p className="font-medium">{voiceAnalysis.style_visuel.ambiance}</p>
                      </div>
                    )}
                    {voiceAnalysis.style_visuel.typographie && (
                      <div className="bg-slate-50 rounded-lg p-3">
                        <span className="text-xs text-slate-400">{t('typography')}</span>
                        <p className="font-medium">{voiceAnalysis.style_visuel.typographie}</p>
                      </div>
                    )}
                    {voiceAnalysis.style_visuel.couleurs_souhaitees && voiceAnalysis.style_visuel.couleurs_souhaitees.length > 0 && (
                      <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                        <span className="text-xs text-slate-400">{t('desiredColors')}</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {voiceAnalysis.style_visuel.couleurs_souhaitees.map((c, i) => (
                            <span key={i} className="bg-white border px-2 py-1 rounded text-sm">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {voiceAnalysis.fonctionnalites && voiceAnalysis.fonctionnalites.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">{t('requestedFeatures')}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {voiceAnalysis.fonctionnalites.map((f, i) => (
                      <span key={i} className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {voiceAnalysis.ton_marque && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <span className="text-xs text-slate-400">{t('brandTone')}</span>
                  <p className="font-medium">{voiceAnalysis.ton_marque}</p>
                </div>
              )}

              {voiceAnalysis.keywords && voiceAnalysis.keywords.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase">{t('keywords')}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {voiceAnalysis.keywords.map((k, i) => (
                      <span key={i} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">{k}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
