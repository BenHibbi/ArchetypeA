-- Migration: Add screenshot_url to responses table
-- Stores the base64 data URL of the client's website screenshot

ALTER TABLE responses
ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

COMMENT ON COLUMN responses.screenshot_url IS 'Base64 data URL of the client website screenshot captured on brief submission';
