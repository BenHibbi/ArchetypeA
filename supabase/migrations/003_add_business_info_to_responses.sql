-- Migration: Add business_name and website_url to responses table
-- These fields capture the client's business information from the questionnaire intro

ALTER TABLE responses
ADD COLUMN IF NOT EXISTS business_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS website_url VARCHAR(500);

-- Add comment for documentation
COMMENT ON COLUMN responses.business_name IS 'Business name provided by the client at the start of the questionnaire';
COMMENT ON COLUMN responses.website_url IS 'Current website URL provided by the client (optional)';
