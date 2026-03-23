import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xomdfcjblkmuqppjlspw.supabase.co'      // ← your URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvbWRmY2pibGttdXFwcGpsc3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MjA1NDIsImV4cCI6MjA4NTM5NjU0Mn0.68MV-zVNprfTdGj26OWeaS0-DLs_WWAPi9RsQbzv-fs'           

export const isDemoMode = false

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)