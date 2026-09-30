import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Generation = {
  id: string
  content_type: 'code' | 'tutorial' | 'blog'
  topic: string
  language: string | null
  skill_level: 'beginner' | 'intermediate' | 'advanced'
  result: string
  model: string
  created_at: string
}
