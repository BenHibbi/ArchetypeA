'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useQuestionnaireStore } from '@/stores/questionnaire-store'
import { QUESTIONS } from '@/config'
import { LoadingScreen } from '@/components/shared/loading'
import {
  ProgressHeader,
  IntroScreen,
  QuestionScreen,
  MoodboardScreen,
  FeaturesScreen,
  VoiceScreen,
  OutputScreen,
} from '@/components/questionnaire'

export default function QuestionnairePage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const t = useTranslations('questionnaire')

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    step,
    businessName,
    websiteUrl,
    answers,
    moodboardLikes,
    features,
    voiceTranscription,
    voiceAnalysis,
    isSubmitting,
    isCompleted,
    setSessionId,
    setBusinessInfo,
    setStep,
    nextStep,
    prevStep,
    setAnswer,
    toggleMoodboard,
    toggleFeature,
    setVoiceData,
    setSubmitting,
    setCompleted,
    reset,
  } = useQuestionnaireStore()

  // Vérifier et charger la session au démarrage
  useEffect(() => {
    async function loadSession() {
      try {
        const supabase = createClient()

        // Vérifier que la session existe
        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .single()

        if (sessionError || !session) {
          setError(t('sessionNotFound'))
          setIsLoading(false)
          return
        }

        // Si déjà complété, charger les réponses
        if (session.status === 'completed') {
          const { data: response } = await supabase
            .from('responses')
            .select('*')
            .eq('session_id', sessionId)
            .single()

          if (response) {
            // Restaurer l'état depuis la DB
            setAnswer('ambiance', response.ambiance || '')
            setAnswer('valeurs', response.valeurs || '')
            setAnswer('structure', response.structure || '')
            setAnswer('typo', response.typo || '')
            setAnswer('ratio', response.ratio || '')
            setAnswer('palette', response.palette || '')

            response.moodboard_likes?.forEach((id: string) => {
              if (!moodboardLikes.includes(id)) toggleMoodboard(id)
            })
            response.features?.forEach((feat: string) => {
              if (!features.includes(feat)) toggleFeature(feat)
            })

            setCompleted(true)
            setStep(10)
          }
        }

        setSessionId(sessionId)
        setIsLoading(false)
      } catch (err) {
        setError(t('loadingError'))
        setIsLoading(false)
      }
    }

    // Reset le store si c'est une nouvelle session
    if (useQuestionnaireStore.getState().sessionId !== sessionId) {
      reset()
    }

    loadSession()
  }, [sessionId])

  // Sauvegarder les réponses progressivement
  useEffect(() => {
    if (!sessionId || step === 0 || isLoading) return

    async function saveProgress() {
      const supabase = createClient()

      // Mettre à jour le statut de la session
      if (step === 1) {
        await supabase
          .from('sessions')
          .update({
            status: 'in_progress',
            started_at: new Date().toISOString(),
          })
          .eq('id', sessionId)
      }

      // Upsert les réponses
      await supabase.from('responses').upsert(
        {
          session_id: sessionId,
          business_name: businessName,
          website_url: websiteUrl,
          ...answers,
          moodboard_likes: moodboardLikes,
          features: features,
          voice_transcription: voiceTranscription,
          voice_analysis: voiceAnalysis,
        },
        { onConflict: 'session_id' }
      )
    }

    saveProgress()
  }, [step, businessName, websiteUrl, answers, moodboardLikes, features, voiceTranscription, voiceAnalysis])

  const handleAnswer = (questionId: string, value: string) => {
    setAnswer(questionId, value)
    setTimeout(() => nextStep(), 350)
  }

  const handleGenerate = async () => {
    setSubmitting(true)

    try {
      const supabase = createClient()

      // Marquer comme complété
      await supabase
        .from('sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId)

      setCompleted(true)
      nextStep()
    } catch (err) {
      console.error('Error completing session:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRestart = () => {
    reset()
    setSessionId(sessionId)
    setStep(0)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h1>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col">
      <ProgressHeader step={step} />

      <main className="flex-1 flex flex-col justify-center pt-20 pb-10 px-4 md:px-8">
        {step === 0 && (
          <IntroScreen
            onStart={(name, url) => {
              setBusinessInfo(name, url)
              setStep(1)
            }}
          />
        )}

        {step >= 1 && step <= 6 && (
          <QuestionScreen
            question={QUESTIONS[step - 1]}
            questionIndex={step - 1}
            currentAnswer={answers[QUESTIONS[step - 1].id as keyof typeof answers]}
            onAnswer={handleAnswer}
          />
        )}

        {step === 7 && (
          <MoodboardScreen
            likes={moodboardLikes}
            onToggle={toggleMoodboard}
            onConfirm={nextStep}
          />
        )}

        {step === 8 && (
          <FeaturesScreen
            selectedFeatures={features}
            onToggle={toggleFeature}
            onGenerate={nextStep}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 9 && (
          <VoiceScreen
            onComplete={(transcription, analysis) => {
              setVoiceData(transcription, analysis)
              handleGenerate()
            }}
            onSkip={handleGenerate}
          />
        )}

        {step === 10 && (
          <OutputScreen
            answers={answers}
            moodboardLikes={moodboardLikes}
            features={features}
            websiteUrl={websiteUrl}
            sessionId={sessionId}
            onRestart={handleRestart}
          />
        )}
      </main>

      {step > 0 && step < 10 && (
        <div className="fixed bottom-6 w-full text-center pointer-events-none">
          <button
            onClick={prevStep}
            className="pointer-events-auto bg-white border border-slate-200 text-slate-400 hover:text-slate-800 w-10 h-10 rounded-full flex items-center justify-center shadow-sm mx-auto transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
