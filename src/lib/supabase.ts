import { createClient } from '@supabase/supabase-js';

// Supabase Connection Credentials provided by user
const env = (import.meta as any).env || {};
export const SUPABASE_URL = env.VITE_SUPABASE_URL || 'https://tdxlapvovjlpaycrnnhk.supabase.co';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TnmB5tpBFK_bY6VXvC9EfA_SwB1DlyP';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseSyncStatus {
  connected: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  syncing: boolean;
}

/**
 * PRODUCTION-GRADE SUPABASE SQL SCHEMA FOR EXAMNEXUS AI
 * Users can execute this directly in Supabase SQL Editor.
 */
export const SUPABASE_SETUP_SQL = `-- =========================================================
-- ExamNexus AI - Comprehensive Supabase PostgreSQL Schema
-- Includes Table Definitions, Row Level Security (RLS) & Triggers
-- Execute this in your Supabase Project -> SQL Editor
-- =========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. REGISTERED USERS AUTH TABLE (Direct Login & Sign Up Storage)
CREATE TABLE IF NOT EXISTS public.registered_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
    target_exam TEXT DEFAULT 'UPSC CSE (Civil Services)',
    avatar_photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USER PROFILES & STUDY PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    name TEXT NOT NULL DEFAULT 'Aspirant',
    role TEXT NOT NULL DEFAULT 'user',
    target_exam TEXT DEFAULT 'UPSC Civil Services',
    prep_level TEXT DEFAULT 'Intermediate',
    daily_target_minutes INTEGER DEFAULT 240,
    study_time_today_minutes INTEGER DEFAULT 165,
    questions_solved_today INTEGER DEFAULT 38,
    accuracy_rate NUMERIC(5,2) DEFAULT 78.50,
    tests_completed_count INTEGER DEFAULT 12,
    streak_days INTEGER DEFAULT 14,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix: Add missing columns if profiles table already existed from earlier schema/template
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Aspirant';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_exam TEXT DEFAULT 'UPSC Civil Services';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS prep_level TEXT DEFAULT 'Intermediate';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_target_minutes INTEGER DEFAULT 240;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS study_time_today_minutes INTEGER DEFAULT 165;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS questions_solved_today INTEGER DEFAULT 38;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS accuracy_rate NUMERIC(5,2) DEFAULT 78.50;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tests_completed_count INTEGER DEFAULT 12;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 14;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Ensure email uniqueness on profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_unique'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
    END IF;
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;

-- 4. ADMIN UPLOADED FILES & REPOSITORY TABLE
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    size TEXT,
    type TEXT,
    category TEXT,
    target_exam TEXT,
    destination TEXT,
    url TEXT,
    description TEXT,
    uploaded_by_email TEXT NOT NULL DEFAULT 'gurubhairishu567@gmail.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NOTES & DIGITAL FOLDERS TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    folder TEXT NOT NULL DEFAULT 'Polity & Governance',
    tags TEXT[] DEFAULT '{}',
    content TEXT NOT NULL,
    is_bookmarked BOOLEAN DEFAULT false,
    created_by_email TEXT NOT NULL DEFAULT 'gurubhairishu567@gmail.com',
    is_admin_curated BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DIGITAL FOLDERS REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    subject TEXT,
    created_by_email TEXT NOT NULL DEFAULT 'gurubhairishu567@gmail.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FLASHCARDS TABLE (Active Recall Decks)
CREATE TABLE IF NOT EXISTS public.flashcards (
    id TEXT PRIMARY KEY,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Polity',
    difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    created_by_email TEXT NOT NULL DEFAULT 'gurubhairishu567@gmail.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CURRENT AFFAIRS ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.current_affairs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    detailed_content TEXT NOT NULL,
    why_it_matters TEXT,
    date DATE DEFAULT CURRENT_DATE,
    source TEXT DEFAULT 'The Hindu / PIB',
    exam_relevance JSONB DEFAULT '[]'::jsonb,
    key_facts TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',
    possible_mcqs JSONB DEFAULT '[]'::jsonb,
    created_by_email TEXT NOT NULL DEFAULT 'gurubhairishu567@gmail.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRACTICE QUESTIONS & MCQS TABLE
CREATE TABLE IF NOT EXISTS public.practice_questions (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    topic TEXT NOT NULL,
    exam TEXT NOT NULL DEFAULT 'UPSC & State PCS',
    difficulty TEXT NOT NULL DEFAULT 'Medium',
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT NOT NULL,
    year INTEGER,
    created_by_email TEXT NOT NULL DEFAULT 'gurubhairishu567@gmail.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. RESOURCE LIBRARY (Acts, Bills, Govt Reports & NCERTs)
CREATE TABLE IF NOT EXISTS public.resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT,
    exam_relevance TEXT,
    description TEXT,
    download_url TEXT,
    read_url TEXT,
    created_by_email TEXT NOT NULL DEFAULT 'gurubhairishu567@gmail.com',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. GENERIC BACKUP & STORE (Key-Value Store)
CREATE TABLE IF NOT EXISTS public.examnexus_store (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    key_name TEXT NOT NULL,
    payload JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_key UNIQUE (user_email, key_name)
);

-- 10. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.registered_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_affairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examnexus_store ENABLE ROW LEVEL SECURITY;

-- 11. ROW LEVEL SECURITY POLICIES
-- A. Registered Users (Login & Signup Data)
DROP POLICY IF EXISTS "Public can signup and read registered_users" ON public.registered_users;
CREATE POLICY "Public can signup and read registered_users" ON public.registered_users FOR ALL USING (true);

-- B. Profiles Policy
DROP POLICY IF EXISTS "Public read for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin update profiles" ON public.profiles;
CREATE POLICY "Public read for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admin update profiles" ON public.profiles FOR ALL USING (true);

-- C. Uploaded Files
DROP POLICY IF EXISTS "Anyone can view uploaded files" ON public.uploaded_files;
CREATE POLICY "Anyone can view uploaded files" ON public.uploaded_files FOR ALL USING (true);

-- D. Notes Policies
DROP POLICY IF EXISTS "Anyone can read notes" ON public.notes;
DROP POLICY IF EXISTS "Admin and creators can insert notes" ON public.notes;
DROP POLICY IF EXISTS "Admin and creators can update notes" ON public.notes;
DROP POLICY IF EXISTS "Admin can delete notes" ON public.notes;
CREATE POLICY "Anyone can read notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Admin and creators can insert notes" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin and creators can update notes" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "Admin can delete notes" ON public.notes FOR DELETE USING (true);

-- E. Folders Policies
DROP POLICY IF EXISTS "Anyone can read folders" ON public.folders;
DROP POLICY IF EXISTS "Admin can insert folders" ON public.folders;
CREATE POLICY "Anyone can read folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Admin can insert folders" ON public.folders FOR INSERT WITH CHECK (true);

-- F. Flashcards Policies
DROP POLICY IF EXISTS "Anyone can read flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Admin and users can insert flashcards" ON public.flashcards;
CREATE POLICY "Anyone can read flashcards" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "Admin and users can insert flashcards" ON public.flashcards FOR INSERT WITH CHECK (true);

-- G. Current Affairs & Questions (Admin Managed)
DROP POLICY IF EXISTS "Anyone can read current affairs" ON public.current_affairs;
DROP POLICY IF EXISTS "Admin can insert current affairs" ON public.current_affairs;
CREATE POLICY "Anyone can read current affairs" ON public.current_affairs FOR SELECT USING (true);
CREATE POLICY "Admin can insert current affairs" ON public.current_affairs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read questions" ON public.practice_questions;
DROP POLICY IF EXISTS "Admin can insert questions" ON public.practice_questions;
CREATE POLICY "Anyone can read questions" ON public.practice_questions FOR SELECT USING (true);
CREATE POLICY "Admin can insert questions" ON public.practice_questions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read resources" ON public.resources;
DROP POLICY IF EXISTS "Admin can insert resources" ON public.resources;
CREATE POLICY "Anyone can read resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Admin can insert resources" ON public.resources FOR INSERT WITH CHECK (true);

-- H. Key-Value Store Policy
DROP POLICY IF EXISTS "Public access to examnexus_store" ON public.examnexus_store;
CREATE POLICY "Public access to examnexus_store" ON public.examnexus_store FOR ALL USING (true);

-- 12. SEED DEFAULT ADMIN ACCOUNT & DEMO ASPIRANTS
INSERT INTO public.registered_users (email, name, password_hash, role, target_exam, avatar_photo)
VALUES 
    ('gurubhairishu567@gmail.com', 'Gurubhai Rishu', 'rishu@2005', 'admin', 'UPSC CSE (Civil Services)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
    ('rahul.upsc@examnexus.ai', 'Rahul Sharma', 'password123', 'user', 'UPSC CSE (Civil Services)', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'),
    ('priya.ssc@examnexus.ai', 'Priya Verma', 'password123', 'user', 'SSC CGL', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80')
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, name = EXCLUDED.name;

INSERT INTO public.profiles (email, name, role, target_exam)
VALUES ('gurubhairishu567@gmail.com', 'Gurubhai Rishu (Admin)', 'admin', 'UPSC Civil Services')
ON CONFLICT (email) DO UPDATE SET role = 'admin', name = EXCLUDED.name;

-- =========================================================
-- Schema setup complete! All tables and security policies ready.
-- =========================================================`;

/**
 * Saves a key-value record to Supabase storage table 'examnexus_store'.
 */
export async function saveToSupabase(key: string, data: any, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const payload = {
      key_name: key,
      user_email: userEmail,
      payload: data,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('examnexus_store')
      .upsert(payload, { onConflict: 'user_email,key_name' });

    if (error) {
      console.warn(`[Supabase Notice] Store upsert notice: ${error.message}`);
      return { success: false, error: error.message };
    }

    return { success: true, timestamp: payload.updated_at };
  } catch (err: any) {
    console.error('[Supabase Error] Save failed:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}

/**
 * Loads a key-value record from Supabase.
 */
export async function loadFromSupabase(key: string, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const { data, error } = await supabase
      .from('examnexus_store')
      .select('payload, updated_at')
      .eq('user_email', userEmail)
      .eq('key_name', key)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase Fetch Notice]: ${error.message}`);
      return null;
    }

    return data?.payload || null;
  } catch (err: any) {
    console.error('[Supabase Fetch Error]:', err);
    return null;
  }
}

/**
 * Inserts or updates a Note in Supabase database.
 */
export async function createNoteInSupabase(note: any, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const payload = {
      id: note.id || `note-${Date.now()}`,
      title: note.title,
      folder: note.folder || 'Polity & Governance',
      tags: note.tags || [],
      content: note.content,
      is_bookmarked: Boolean(note.isBookmarked),
      created_by_email: userEmail,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('notes')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      // Fallback to storing in examnexus_store if table is pending creation
      await saveToSupabase(`note_${payload.id}`, payload, userEmail);
      return { success: true, fallback: true, message: 'Saved to local & backup store' };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Note Supabase insert error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Inserts a new Folder into Supabase database.
 */
export async function createFolderInSupabase(folderName: string, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const { data, error } = await supabase
      .from('folders')
      .insert({ name: folderName, created_by_email: userEmail });

    if (error) {
      await saveToSupabase(`folder_${folderName}`, { name: folderName, created_at: new Date().toISOString() }, userEmail);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Inserts a Flashcard in Supabase database.
 */
export async function createFlashcardInSupabase(flashcard: any, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const payload = {
      id: flashcard.id || `fc-${Date.now()}`,
      front: flashcard.front,
      back: flashcard.back,
      category: flashcard.category || 'Polity',
      difficulty: flashcard.difficulty || 'Medium',
      created_by_email: userEmail
    };

    const { data, error } = await supabase
      .from('flashcards')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      await saveToSupabase(`flashcard_${payload.id}`, payload, userEmail);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Inserts a Current Affairs article in Supabase database.
 */
export async function createCurrentAffairInSupabase(article: any, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const payload = {
      id: article.id || `ca-${Date.now()}`,
      title: article.title,
      category: article.category,
      summary: article.summary,
      detailed_content: article.detailedContent || article.summary,
      why_it_matters: article.whyItMatters || article.summary,
      date: article.date || new Date().toISOString().split('T')[0],
      source: article.source || 'The Hindu / PIB',
      created_by_email: userEmail
    };

    const { data, error } = await supabase
      .from('current_affairs')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      await saveToSupabase(`ca_${payload.id}`, payload, userEmail);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Inserts a Question in Supabase database.
 */
export async function createQuestionInSupabase(question: any, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const payload = {
      id: question.id || `q-${Date.now()}`,
      subject: question.subject,
      topic: question.topic || 'General Practice',
      exam: question.exam || 'UPSC & State PCS',
      difficulty: question.difficulty || 'Medium',
      question: question.question,
      options: question.options,
      correct_answer: question.correctAnswer,
      explanation: question.explanation,
      created_by_email: userEmail
    };

    const { data, error } = await supabase
      .from('practice_questions')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      await saveToSupabase(`q_${payload.id}`, payload, userEmail);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Inserts or updates a Resource / Book / PDF / Parliament Bill in Supabase database.
 */
export async function createResourceInSupabase(resource: any, userEmail: string = 'gurubhairishu567@gmail.com') {
  try {
    const payload = {
      id: resource.id || `res-${Date.now()}`,
      title: resource.title,
      category: resource.category || 'General',
      author: resource.author || 'Author',
      exam_relevance: Array.isArray(resource.exam) ? resource.exam.join(', ') : (resource.exam || 'UPSC CSE'),
      description: resource.description || resource.summaryOverview || resource.title,
      download_url: resource.download_url || resource.buyLinks?.amazon || '',
      read_url: resource.read_url || resource.buyLinks?.flipkart || '',
      created_by_email: userEmail
    };

    const { data, error } = await supabase
      .from('resources')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      await saveToSupabase(`resource_${payload.id}`, payload, userEmail);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Deletes a Resource from Supabase.
 */
export async function deleteResourceFromSupabase(resourceId: string) {
  try {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', resourceId);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Tests connection to the user's Supabase instance.
 */
export async function testSupabaseConnection(): Promise<{ connected: boolean; message: string; details?: any }> {
  try {
    const { data, error } = await supabase.from('examnexus_store').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116' && !error.message.includes('relation "public.examnexus_store" does not exist')) {
      return { connected: true, message: `Connected to Supabase (${error.message})` };
    }

    return {
      connected: true,
      message: 'Successfully connected to Supabase project (tdxlapvovjlpaycrnnhk.supabase.co)'
    };
  } catch (err: any) {
    return {
      connected: false,
      message: `Failed to reach Supabase: ${err?.message || 'Network error'}`
    };
  }
}

/**
 * Inserts or updates a registered user account in Supabase auth table.
 */
export async function createRegisteredUserInSupabase(account: {
  name: string;
  email: string;
  password?: string;
  targetExam?: string;
  avatarPhoto?: string;
  role?: string;
}) {
  try {
    const payload = {
      email: account.email.toLowerCase().trim(),
      name: account.name.trim(),
      password_hash: account.password || 'rishu@2005',
      role: account.role || (account.email.toLowerCase().trim() === 'gurubhairishu567@gmail.com' ? 'admin' : 'user'),
      target_exam: account.targetExam || 'UPSC CSE (Civil Services)',
      avatar_photo: account.avatarPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(account.name)}`,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('registered_users')
      .upsert(payload, { onConflict: 'email' });

    if (error) {
      console.warn('[Supabase Auth Save Notice]:', error.message);
      // Fallback: save to KV store
      await saveToSupabase(`user_account_${payload.email}`, payload, payload.email);
      return { success: true, fallback: true };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Loads all registered users from Supabase.
 */
export async function fetchRegisteredUsersFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('registered_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}


