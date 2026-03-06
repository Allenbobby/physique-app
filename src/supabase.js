import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://fogejxcgoapkiuzwcdxu.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZ2VqeGNnb2Fwa2l1endjZHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDQxMTAsImV4cCI6MjA4ODM4MDExMH0.HJAgbnQ0rvGp_nkTqfLme5WYbhaw4mF_5iVZB07_WJ8"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)