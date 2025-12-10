import { QuestionnaireResponse } from './questionnaire'

export type SessionStatus = 'pending' | 'in_progress' | 'completed'

export interface Client {
  id: string
  email: string
  company_name: string | null
  contact_name: string | null
  website_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Session {
  id: string // nanoid court
  client_id: string
  status: SessionStatus
  started_at: string | null
  completed_at: string | null
  created_at: string
  // Relations
  client?: Client
  response?: Response
}

export interface Response {
  id: string
  session_id: string
  ambiance: string | null
  valeurs: string | null
  structure: string | null
  typo: string | null
  ratio: string | null
  palette: string | null
  moodboard_likes: string[]
  features: string[]
  created_at: string
  updated_at: string
}

export interface GeneratedPrompt {
  id: string
  session_id: string
  prompt_type: 'v0' | 'lovable' | 'bolt' | 'midjourney' | 'custom'
  prompt_content: string
  created_at: string
}

// Forme combinée pour l'affichage dans le Studio
export interface ClientWithSession extends Client {
  sessions: Session[]
  latest_session?: Session & {
    response?: Response
  }
}

// Stats du dashboard
export interface DashboardStats {
  total_clients: number
  pending_sessions: number
  completed_sessions: number
  completion_rate: number
}

// Pour la création
export interface CreateClientInput {
  email: string
  company_name?: string
  contact_name?: string
  website_url?: string
  notes?: string
}

export interface CreateSessionInput {
  client_id: string
}
