import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://uflwmikiyjfnikiphtcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbHdraWtpampmbmlraXBodGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NjM0MTksImV4cCI6MjA4NTUzOTQxOX0.x-qCVvWD2pfjpDEp7hifQ2wCKAzOsO3gaA7KNdzD60I";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: window.sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
