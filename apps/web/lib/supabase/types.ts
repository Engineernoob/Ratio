/**
 * Supabase Database Types
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      memoria: {
        Row: {
          id: string;
          user_id: string;
          concept_id: string;
          interval: number;
          ease: number;
          next_review: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          interval: number;
          ease: number;
          next_review: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          concept_id?: string;
          interval?: number;
          ease?: number;
          next_review?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          chapter: string;
          text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          chapter?: string;
          text?: string;
          created_at?: string;
        };
      };
      highlights: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter: string;
          text: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          chapter: string;
          text: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          chapter?: string;
          text?: string;
          color?: string;
          created_at?: string;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter: string;
          percentage: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          book_id: string;
          chapter: string;
          percentage: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          book_id?: string;
          chapter?: string;
          percentage?: number;
          updated_at?: string;
        };
      };
      theme_settings: {
        Row: {
          id: string;
          user_id: string;
          theme_id: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme_id: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme_id?: string;
          updated_at?: string;
        };
      };
      puzzle_results: {
        Row: {
          id: string;
          user_id: string;
          puzzle_id: string;
          score: number;
          attempts: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          puzzle_id: string;
          score: number;
          attempts: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          puzzle_id?: string;
          score?: number;
          attempts?: number;
          created_at?: string;
        };
      };
      logic_results: {
        Row: {
          id: string;
          user_id: string;
          map_id: string;
          score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          map_id: string;
          score: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          map_id?: string;
          score?: number;
          created_at?: string;
        };
      };
    };
  };
}
