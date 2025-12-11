import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QuestionnaireAnswers } from '@/types'

interface QuestionnaireStore {
  // Session info
  sessionId: string | null

  // Business info
  businessName: string
  websiteUrl: string

  // State
  step: number
  answers: QuestionnaireAnswers
  moodboardLikes: string[]
  features: string[]
  customColors: string[]
  voiceTranscription: string | null
  voiceAnalysis: string | null

  // Status
  isSubmitting: boolean
  isCompleted: boolean

  // Actions
  setSessionId: (id: string) => void
  setBusinessInfo: (name: string, url: string) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setAnswer: (questionId: string, value: string) => void
  toggleMoodboard: (id: string) => void
  toggleFeature: (feature: string) => void
  setCustomColors: (colors: string[]) => void
  setVoiceData: (transcription: string, analysis: string) => void
  setSubmitting: (value: boolean) => void
  setCompleted: (value: boolean) => void
  reset: () => void

  // Computed
  getProgress: () => number
}

const initialState = {
  sessionId: null,
  businessName: '',
  websiteUrl: '',
  step: 0,
  answers: {},
  moodboardLikes: [],
  features: [],
  customColors: [],
  voiceTranscription: null,
  voiceAnalysis: null,
  isSubmitting: false,
  isCompleted: false,
}

export const useQuestionnaireStore = create<QuestionnaireStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSessionId: (id) => set({ sessionId: id }),

      setBusinessInfo: (name, url) => set({ businessName: name, websiteUrl: url }),

      setStep: (step) => set({ step }),

      nextStep: () => set((state) => ({ step: state.step + 1 })),

      prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),

      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      toggleMoodboard: (id) =>
        set((state) => ({
          moodboardLikes: state.moodboardLikes.includes(id)
            ? state.moodboardLikes.filter((i) => i !== id)
            : [...state.moodboardLikes, id],
        })),

      toggleFeature: (feature) =>
        set((state) => ({
          features: state.features.includes(feature)
            ? state.features.filter((f) => f !== feature)
            : [...state.features, feature],
        })),

      setCustomColors: (colors) => set({ customColors: colors }),

      setVoiceData: (transcription, analysis) =>
        set({ voiceTranscription: transcription, voiceAnalysis: analysis }),

      setSubmitting: (value) => set({ isSubmitting: value }),

      setCompleted: (value) => set({ isCompleted: value }),

      reset: () => set(initialState),

      getProgress: () => {
        const { step } = get()
        // 10 étapes total: intro(0), 6 questions(1-6), moodboard(7), features(8), voice(9), output(10)
        return Math.min(100, Math.round((step / 10) * 100))
      },
    }),
    {
      name: 'archetype-questionnaire',
      partialize: (state) => ({
        sessionId: state.sessionId,
        step: state.step,
        answers: state.answers,
        moodboardLikes: state.moodboardLikes,
        features: state.features,
        customColors: state.customColors,
        isCompleted: state.isCompleted,
      }),
    }
  )
)
