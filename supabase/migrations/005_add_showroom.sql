-- Migration: Add showroom functionality
-- Allows uploading design proposals and sending them to clients

-- Showroom status on sessions
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS showroom_status VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS showroom_sent_at TIMESTAMPTZ DEFAULT NULL;

-- Design proposals table
CREATE TABLE IF NOT EXISTS design_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(12) REFERENCES sessions(id) ON DELETE CASCADE,
  slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 1 AND 3),

  -- Design content (either image URL/base64 or HTML code)
  image_url TEXT,
  html_code TEXT,

  -- Pricing
  price DECIMAL(10,2),

  -- Metadata
  title VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One design per slot per session
  UNIQUE(session_id, slot_number)
);

-- Client selection
CREATE TABLE IF NOT EXISTS showroom_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR(12) REFERENCES sessions(id) ON DELETE CASCADE UNIQUE,
  selected_proposal_id UUID REFERENCES design_proposals(id) ON DELETE SET NULL,

  -- Quote request or signed
  action_type VARCHAR(20) CHECK (action_type IN ('quote_request', 'signed')),
  discount_applied BOOLEAN DEFAULT FALSE,
  final_price DECIMAL(10,2),

  -- Client info for quote
  client_email VARCHAR(255),
  client_phone VARCHAR(50),
  client_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_design_proposals_session ON design_proposals(session_id);
CREATE INDEX IF NOT EXISTS idx_showroom_selections_session ON showroom_selections(session_id);

-- Trigger for updated_at
CREATE TRIGGER update_design_proposals_updated_at
  BEFORE UPDATE ON design_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE design_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_selections ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users (Studio)
CREATE POLICY "Authenticated users can do everything on design_proposals"
  ON design_proposals FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can do everything on showroom_selections"
  ON showroom_selections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for anonymous users (Client showroom)
CREATE POLICY "Anyone can read design_proposals"
  ON design_proposals FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert showroom_selections"
  ON showroom_selections FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read showroom_selections"
  ON showroom_selections FOR SELECT
  TO anon
  USING (true);
