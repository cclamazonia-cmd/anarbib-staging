import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://asptfmokzykwzlshsncw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcHRmbW9renlrd3psc2hzbmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzcxNzcsImV4cCI6MjA4ODExMzE3N30.JkMLHPCV2AH5ELZV_1RfcoW250QEofLGvnDKSDpkcn0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});