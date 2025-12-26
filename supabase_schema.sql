-- CypherGenius Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Lyric Sessions Table
CREATE TABLE IF NOT EXISTS lyric_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  title TEXT NOT NULL DEFAULT 'Untitled Session',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_lyric_sessions_user_id ON lyric_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_lyric_sessions_updated_at ON lyric_sessions(updated_at DESC);

-- Rap Battles Table
CREATE TABLE IF NOT EXISTS rap_battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  transcription JSONB NOT NULL DEFAULT '[]'::jsonb,
  duration_seconds INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_rap_battles_user_id ON rap_battles(user_id);
CREATE INDEX IF NOT EXISTS idx_rap_battles_created_at ON rap_battles(created_at DESC);

-- Rhyme Queries Table (for analytics and quick access)
CREATE TABLE IF NOT EXISTS rhyme_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL,
  rhymes JSONB NOT NULL DEFAULT '[]'::jsonb,
  suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for word lookups and recent queries
CREATE INDEX IF NOT EXISTS idx_rhyme_queries_word ON rhyme_queries(word);
CREATE INDEX IF NOT EXISTS idx_rhyme_queries_created_at ON rhyme_queries(created_at DESC);

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for lyric_sessions
CREATE TRIGGER update_lyric_sessions_updated_at
  BEFORE UPDATE ON lyric_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE lyric_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rap_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rhyme_queries ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous access (you can modify these based on your needs)

-- Lyric Sessions: Allow all operations for now (adjust for auth later)
CREATE POLICY "Allow all for lyric_sessions" ON lyric_sessions
  FOR ALL USING (true) WITH CHECK (true);

-- Rap Battles: Allow all operations
CREATE POLICY "Allow all for rap_battles" ON rap_battles
  FOR ALL USING (true) WITH CHECK (true);

-- Rhyme Queries: Allow all operations
CREATE POLICY "Allow all for rhyme_queries" ON rhyme_queries
  FOR ALL USING (true) WITH CHECK (true);

-- Optional: If you want to add user authentication later, replace the policies above with:
-- CREATE POLICY "Users can read their own sessions" ON lyric_sessions
--   FOR SELECT USING (auth.uid()::text = user_id);
-- 
-- CREATE POLICY "Users can insert their own sessions" ON lyric_sessions
--   FOR INSERT WITH CHECK (auth.uid()::text = user_id);
--
-- CREATE POLICY "Users can update their own sessions" ON lyric_sessions
--   FOR UPDATE USING (auth.uid()::text = user_id);
--
-- CREATE POLICY "Users can delete their own sessions" ON lyric_sessions
--   FOR DELETE USING (auth.uid()::text = user_id);

-- Comments for documentation
COMMENT ON TABLE lyric_sessions IS 'Stores user lyric writing sessions with full message history';
COMMENT ON TABLE rap_battles IS 'Records of live cypher sessions with transcriptions';
COMMENT ON TABLE rhyme_queries IS 'Cache of rhyme queries for quick lookup and analytics';

COMMENT ON COLUMN lyric_sessions.messages IS 'Array of message objects with id, role, text, and timestamp';
COMMENT ON COLUMN rap_battles.transcription IS 'Array of transcription strings from the battle';
COMMENT ON COLUMN rhyme_queries.rhymes IS 'Array of rhyme suggestions';
COMMENT ON COLUMN rhyme_queries.suggestions IS 'Array of wordplay suggestions';
