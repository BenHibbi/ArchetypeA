// Types générés par Supabase - à remplacer avec `npm run db:generate`
// Pour l'instant, types manuels basés sur notre schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          email: string
          company_name: string | null
          contact_name: string | null
          website_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          company_name?: string | null
          contact_name?: string | null
          website_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          company_name?: string | null
          contact_name?: string | null
          website_url?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          client_id: string
          status: string
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          client_id: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          status?: string
          started_at?: string | null
          completed_at?: string | null
        }
      }
      responses: {
        Row: {
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
          voice_transcription: string | null
          voice_analysis: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          ambiance?: string | null
          valeurs?: string | null
          structure?: string | null
          typo?: string | null
          ratio?: string | null
          palette?: string | null
          moodboard_likes?: string[]
          features?: string[]
          voice_transcription?: string | null
          voice_analysis?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          ambiance?: string | null
          valeurs?: string | null
          structure?: string | null
          typo?: string | null
          ratio?: string | null
          palette?: string | null
          moodboard_likes?: string[]
          features?: string[]
          voice_transcription?: string | null
          voice_analysis?: string | null
          updated_at?: string
        }
      }
      generated_prompts: {
        Row: {
          id: string
          session_id: string
          prompt_type: string
          prompt_content: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          prompt_type: string
          prompt_content: string
          created_at?: string
        }
        Update: {
          prompt_type?: string
          prompt_content?: string
        }
      }
    }
  }
}
