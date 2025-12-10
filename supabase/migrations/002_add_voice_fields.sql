-- Migration: Add voice transcription and analysis fields
-- Run this in your Supabase SQL Editor after the initial schema

-- Add voice fields to responses table
ALTER TABLE responses
ADD COLUMN IF NOT EXISTS voice_transcription TEXT,
ADD COLUMN IF NOT EXISTS voice_analysis TEXT;
