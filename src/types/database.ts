// Types pour Supabase
// Pour regénérer avec les vrais types: npx supabase gen types typescript --project-id <id> > src/types/database.ts

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
          user_id: string
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
          user_id: string
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
          user_id?: string
          email?: string
          company_name?: string | null
          contact_name?: string | null
          website_url?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: string
          client_id: string
          status: string
          started_at: string | null
          completed_at: string | null
          created_at: string
          showroom_status: string | null
          showroom_sent_at: string | null
        }
        Insert: {
          id: string
          client_id: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
          showroom_status?: string | null
          showroom_sent_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          status?: string
          started_at?: string | null
          completed_at?: string | null
          showroom_status?: string | null
          showroom_sent_at?: string | null
        }
        Relationships: []
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
          business_name: string | null
          website_url: string | null
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
          business_name?: string | null
          website_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
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
          business_name?: string | null
          website_url?: string | null
          updated_at?: string
        }
        Relationships: []
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
          id?: string
          session_id?: string
          prompt_type?: string
          prompt_content?: string
        }
        Relationships: []
      }
      design_proposals: {
        Row: {
          id: string
          session_id: string
          slot_number: number
          image_url: string | null
          html_code: string | null
          price: number | null
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          slot_number: number
          image_url?: string | null
          html_code?: string | null
          price?: number | null
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          slot_number?: number
          image_url?: string | null
          html_code?: string | null
          price?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
