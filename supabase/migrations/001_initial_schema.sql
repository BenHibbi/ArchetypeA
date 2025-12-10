-- Archetype Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients (prospects)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  contact_name VARCHAR(255),
  website_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions de questionnaire
CREATE TABLE sessions (
  id VARCHAR(12) PRIMARY KEY,  -- nanoid court pour URL friendly
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Réponses au questionnaire
CREATE TABLE responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(12) REFERENCES sessions(id) ON DELETE CASCADE UNIQUE,

  -- Réponses aux questions
  ambiance VARCHAR(50),
  valeurs VARCHAR(50),
  structure VARCHAR(50),
  typo VARCHAR(50),
  ratio VARCHAR(50),
  palette VARCHAR(50),

  -- Moodboard & Features (stored as JSON arrays)
  moodboard_likes TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompts générés (historique)
CREATE TABLE generated_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(12) REFERENCES sessions(id) ON DELETE CASCADE,
  prompt_type VARCHAR(50) NOT NULL,
  prompt_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes pour performance
CREATE INDEX idx_sessions_client_id ON sessions(client_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_responses_session_id ON responses(session_id);
CREATE INDEX idx_clients_email ON clients(email);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at
  BEFORE UPDATE ON responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_prompts ENABLE ROW LEVEL SECURITY;

-- Policies pour accès authentifié (Studio)
CREATE POLICY "Authenticated users can do everything on clients"
  ON clients FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can do everything on sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can do everything on responses"
  ON responses FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can do everything on generated_prompts"
  ON generated_prompts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies pour accès anonyme (questionnaire public)
CREATE POLICY "Anyone can read sessions by id"
  ON sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update session status"
  ON sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert responses"
  ON responses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update responses"
  ON responses FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read responses"
  ON responses FOR SELECT
  TO anon
  USING (true);
