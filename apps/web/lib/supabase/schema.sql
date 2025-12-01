-- Ratio Supabase Database Schema
-- Run this in your Supabase SQL editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Memoria (spaced repetition cards)
CREATE TABLE IF NOT EXISTS public.memoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  interval INTEGER NOT NULL DEFAULT 1,
  ease DECIMAL(5,2) NOT NULL DEFAULT 2.5,
  next_review DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, concept_id)
);

-- Notes
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Highlights
CREATE TABLE IF NOT EXISTS public.highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter TEXT NOT NULL,
  text TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#ffff00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  book_id TEXT NOT NULL,
  chapter TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, book_id, chapter)
);

-- Theme settings
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Puzzle results
CREATE TABLE IF NOT EXISTS public.puzzle_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  puzzle_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, puzzle_id)
);

-- Logic results
CREATE TABLE IF NOT EXISTS public.logic_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  map_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, map_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_memoria_user_id ON public.memoria(user_id);
CREATE INDEX IF NOT EXISTS idx_memoria_next_review ON public.memoria(next_review);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_book_id ON public.notes(book_id);
CREATE INDEX IF NOT EXISTS idx_highlights_user_id ON public.highlights(user_id);
CREATE INDEX IF NOT EXISTS idx_highlights_book_id ON public.highlights(book_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_book_id ON public.progress(book_id);
CREATE INDEX IF NOT EXISTS idx_puzzle_results_user_id ON public.puzzle_results(user_id);
CREATE INDEX IF NOT EXISTS idx_logic_results_user_id ON public.logic_results(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.puzzle_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logic_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own memoria" ON public.memoria
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own highlights" ON public.highlights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON public.progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own theme settings" ON public.theme_settings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own puzzle results" ON public.puzzle_results
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own logic results" ON public.logic_results
  FOR ALL USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_memoria_updated_at
  BEFORE UPDATE ON public.memoria
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at
  BEFORE UPDATE ON public.theme_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
