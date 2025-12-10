import { ReactNode } from 'react'

export type AmbianceType = 'minimal' | 'bold' | 'corporate' | 'soft' | 'futuristic' | 'editorial'
export type ValeurType = 'confiance' | 'creativite' | 'performance' | 'simplicite' | 'luxe' | 'accessibilite'
export type StructureType = 'simple' | 'standard' | 'rich' | 'fullscreen' | 'masonry' | 'bento'
export type TypoType = 'fine' | 'bold' | 'serif' | 'modern' | 'variable' | 'retro'
export type RatioType = 'image_heavy' | 'mix' | 'text_heavy'
export type PaletteType = 'cold' | 'warm' | 'bw' | 'accent' | 'pastel' | 'neutral'

export type SkeletonType =
  | 'hero' | 'split' | 'typo' | 'grid' | 'blocks' | 'pricing'
  | 'quote' | 'footer' | 'nav' | 'asym' | 'full' | 'col'

export interface QuestionOption {
  id: string
  label: string
  desc?: string
  icon?: ReactNode
  viz?: string
  style?: string
  colors?: string[]
}

export interface Question {
  id: string
  question: string
  subtitle: string
  layout: string
  options: QuestionOption[]
}

export interface Skeleton {
  id: string
  label: string
  type: SkeletonType
}

export interface QuestionnaireAnswers {
  ambiance?: AmbianceType
  valeurs?: ValeurType
  structure?: StructureType
  typo?: TypoType
  ratio?: RatioType
  palette?: PaletteType
}

export interface QuestionnaireState {
  step: number
  answers: QuestionnaireAnswers
  moodboardLikes: string[]
  features: string[]
}

export interface QuestionnaireResponse extends QuestionnaireAnswers {
  moodboard_likes: string[]
  features: string[]
  voice_transcription?: string | null
  voice_analysis?: string | null
}

// Structure JSON de l'analyse vocale
export interface VoiceAnalysis {
  vision_globale: string
  inspirations: Array<{
    nom: string
    elements_apprecies: string
  }>
  style_visuel: {
    ambiance?: string
    couleurs_souhaitees?: string[]
    couleurs_a_eviter?: string[]
    typographie?: string
  }
  fonctionnalites: string[]
  contenu: {
    type_contenu?: string
    sections_demandees?: string[]
    media?: string
  }
  ton_marque: string
  contraintes: string[]
  keywords: string[]
}
