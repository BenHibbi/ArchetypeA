'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQuestionnaireStore } from '@/stores/questionnaire-store'
import { QUESTIONS } from '@/config'
import {
  ProgressHeader,
  IntroScreen,
  QuestionScreen,
  MoodboardScreen,
  FeaturesScreen,
  VoiceScreen,
  OutputScreen,
} from '@/components/questionnaire'

export default function DemoPage() {
  const router = useRouter()
  const {
    step,
    answers,
    moodboardLikes,
    features,
    customColors,
    setStep,
    nextStep,
    prevStep,
    setAnswer,
    toggleMoodboard,
    toggleFeature,
    setCustomColors,
    setVoiceData,
    reset,
  } = useQuestionnaireStore()

  const handleAnswer = (questionId: string, value: string) => {
    setAnswer(questionId, value)
    // Don't auto-advance for multi-select questions
    const currentQuestion = QUESTIONS[step - 1]
    if (!currentQuestion?.multiSelect) {
      setTimeout(() => nextStep(), 350)
    }
  }

  const handleMultiSelectConfirm = () => {
    nextStep()
  }

  const handleRestart = () => {
    reset()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col">
      <ProgressHeader step={step} />

      <main className="flex-1 flex flex-col justify-center pt-20 pb-10 px-4 md:px-8">
        {step === 0 && <IntroScreen onStart={() => setStep(1)} />}

        {step >= 1 && step <= 6 && (
          <QuestionScreen
            question={QUESTIONS[step - 1]}
            questionIndex={step - 1}
            currentAnswer={answers[QUESTIONS[step - 1].id as keyof typeof answers]}
            onAnswer={handleAnswer}
            onMultiSelectConfirm={handleMultiSelectConfirm}
            customColors={customColors}
            onCustomColorsChange={setCustomColors}
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
          />
        )}

        {step === 9 && (
          <VoiceScreen
            onComplete={(transcription, analysis) => {
              setVoiceData(transcription, analysis)
              nextStep()
            }}
            onSkip={nextStep}
          />
        )}

        {step === 10 && (
          <OutputScreen
            answers={answers}
            moodboardLikes={moodboardLikes}
            features={features}
            customColors={customColors}
            onRestart={handleRestart}
            isDemo={true}
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
