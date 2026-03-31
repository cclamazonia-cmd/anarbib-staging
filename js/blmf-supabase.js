import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://uflwmikiyjfnikiphtcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbHdtaWtpeWpmbmlraXBodGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzIyNDUsImV4cCI6MjA4OTQwODI0NX0.kCs7nPg08ofjb9CWwRH9xVN6BjanrAC5pj418line1o";
const AUTH_STORAGE_KEY = "anarbib-staging-auth";

const memoryStorage = (() => {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
  };
})();

const authStorage = (() => {
  try {
    if (window?.sessionStorage) return window.sessionStorage;
  } catch (error) {
    console.warn('sessionStorage indisponível; usando armazenamento interno transitório.', error);
  }
  return memoryStorage;
})();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: authStorage,
    storageKey: AUTH_STORAGE_KEY,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});