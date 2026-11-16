import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://ehwasggnycngirstposa.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_mOIu-gG2Jm0YJ9sr6G7pdQ_D4qtWmW2'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
