import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client only if credentials are provided
// This makes Supabase integration optional
export const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => supabase !== null;

// Type definitions for database tables
export interface LyricSession {
  id: string;
  user_id?: string;
  title: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    text: string;
    timestamp: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface RapBattle {
  id: string;
  user_id?: string;
  transcription: string[];
  duration_seconds: number;
  created_at: string;
}

export interface RhymeQuery {
  id: string;
  word: string;
  rhymes: string[];
  suggestions: string[];
  created_at: string;
}

// Helper functions for common operations

/**
 * Save a lyric session to Supabase
 */
export const saveLyricSession = async (session: Omit<LyricSession, 'id' | 'created_at' | 'updated_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured. Session not saved to cloud.');
    return null;
  }
  
  const { data, error } = await supabase
    .from('lyric_sessions')
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update an existing lyric session
 */
export const updateLyricSession = async (id: string, updates: Partial<LyricSession>) => {
  if (!supabase) {
    console.warn('Supabase not configured. Session not updated in cloud.');
    return null;
  }
  
  const { data, error } = await supabase
    .from('lyric_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all lyric sessions for the current user
 */
export const getLyricSessions = async (userId?: string) => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot retrieve sessions from cloud.');
    return [];
  }
  
  let query = supabase
    .from('lyric_sessions')
    .select('*')
    .order('updated_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

/**
 * Get a specific lyric session by ID
 */
export const getLyricSession = async (id: string) => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot retrieve session from cloud.');
    return null;
  }
  
  const { data, error } = await supabase
    .from('lyric_sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Delete a lyric session
 */
export const deleteLyricSession = async (id: string) => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot delete session from cloud.');
    return;
  }
  
  const { error } = await supabase
    .from('lyric_sessions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

/**
 * Save a rap battle session
 */
export const saveRapBattle = async (battle: Omit<RapBattle, 'id' | 'created_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured. Battle not saved to cloud.');
    return null;
  }
  
  const { data, error } = await supabase
    .from('rap_battles')
    .insert(battle)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get rap battle history
 */
export const getRapBattles = async (userId?: string, limit: number = 10) => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot retrieve battles from cloud.');
    return [];
  }
  
  let query = supabase
    .from('rap_battles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

/**
 * Save a rhyme query for analytics/history
 */
export const saveRhymeQuery = async (query: Omit<RhymeQuery, 'id' | 'created_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured. Query not saved to cloud.');
    return null;
  }
  
  const { data, error } = await supabase
    .from('rhyme_queries')
    .insert(query)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get recent rhyme queries
 */
export const getRecentRhymes = async (limit: number = 20) => {
  if (!supabase) {
    console.warn('Supabase not configured. Cannot retrieve rhymes from cloud.');
    return [];
  }
  
  const { data, error } = await supabase
    .from('rhyme_queries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
};
