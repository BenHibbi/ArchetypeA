-- Migration: Add user isolation for multi-tenant security
-- Each user can only see their own clients

-- Step 1: Add user_id column to clients
ALTER TABLE clients ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Step 2: Create index for performance
CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Step 3: Drop old permissive policies
DROP POLICY IF EXISTS "Authenticated users can do everything on clients" ON clients;
DROP POLICY IF EXISTS "Authenticated users can do everything on sessions" ON sessions;
DROP POLICY IF EXISTS "Authenticated users can do everything on responses" ON responses;
DROP POLICY IF EXISTS "Authenticated users can do everything on generated_prompts" ON generated_prompts;

-- Step 4: Create new restrictive policies for clients
CREATE POLICY "Users can only see their own clients"
  ON clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can only insert their own clients"
  ON clients FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only update their own clients"
  ON clients FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can only delete their own clients"
  ON clients FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Step 5: Sessions - users can access sessions of their own clients
CREATE POLICY "Users can access sessions of their clients"
  ON sessions FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

-- Step 6: Responses - users can access responses of their clients' sessions
CREATE POLICY "Users can access responses of their clients"
  ON responses FOR ALL TO authenticated
  USING (session_id IN (
    SELECT s.id FROM sessions s
    JOIN clients c ON s.client_id = c.id
    WHERE c.user_id = auth.uid()
  ));

-- Step 7: Generated prompts - users can access prompts of their clients' sessions
CREATE POLICY "Users can access prompts of their clients"
  ON generated_prompts FOR ALL TO authenticated
  USING (session_id IN (
    SELECT s.id FROM sessions s
    JOIN clients c ON s.client_id = c.id
    WHERE c.user_id = auth.uid()
  ));

-- IMPORTANT: After running this migration, you need to:
-- 1. Update existing clients with your user_id:
--    UPDATE clients SET user_id = 'YOUR_USER_ID_HERE' WHERE user_id IS NULL;
-- 2. Then make user_id NOT NULL:
--    ALTER TABLE clients ALTER COLUMN user_id SET NOT NULL;
