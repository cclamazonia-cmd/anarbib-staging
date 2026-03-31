import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://uflwmikiyjfnikiphtcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbHdtaWtpeWpmbmlraXBodGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzIyNDUsImV4cCI6MjA4OTQwODI0NX0.kCs7nPg08ofjb9CWwRH9xVN6BjanrAC5pj418line1o";
const PROJECT_REF = "uflwmikiyjfnikiphtcp";
const DEFAULT_AUTH_STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;
const LEGACY_AUTH_STORAGE_KEY = "anarbib-staging-auth";
const AUTH_STORAGE_KEYS = [DEFAULT_AUTH_STORAGE_KEY, LEGACY_AUTH_STORAGE_KEY];
const BROWSER_SESSION_PREFIX = "anarbib-browser-session";
const TAB_ID_SESSION_KEY = `${BROWSER_SESSION_PREFIX}:tab-id`;
const TAB_REGISTRY_STORAGE_KEY = `${BROWSER_SESSION_PREFIX}:tabs`;
const TAB_HEARTBEAT_MS = 15000;
const TAB_STALE_MS = 45000;

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

function getSafeStorage(kind = "local") {
  try {
    const target = kind === "session" ? window?.sessionStorage : window?.localStorage;
    if (!target) return memoryStorage;
    const probeKey = `__anarbib_storage_probe__:${kind}`;
    target.setItem(probeKey, "1");
    target.removeItem(probeKey);
    return target;
  } catch (error) {
    console.warn(`${kind}Storage indisponível; usando armazenamento interno transitório.`, error);
    return memoryStorage;
  }
}

const sessionStorageSafe = getSafeStorage("session");
const localStorageSafe = getSafeStorage("local");

function safeJsonParse(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function createTabId() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {}
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readTabRegistry() {
  return safeJsonParse(localStorageSafe.getItem(TAB_REGISTRY_STORAGE_KEY), {});
}

function writeTabRegistry(registry = {}) {
  localStorageSafe.setItem(TAB_REGISTRY_STORAGE_KEY, JSON.stringify(registry));
}

function pruneTabRegistry(registry = {}) {
  const now = Date.now();
  return Object.fromEntries(
    Object.entries(registry || {}).filter(([, stamp]) => Number(stamp) && now - Number(stamp) < TAB_STALE_MS)
  );
}

function clearAllAuthEntries() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorageSafe.removeItem(key);
    sessionStorageSafe.removeItem(key);
  });
}

function bootstrapBrowserSessionScope() {
  const existingTabId = sessionStorageSafe.getItem(TAB_ID_SESSION_KEY);
  const registry = pruneTabRegistry(readTabRegistry());
  const isFreshTopLevelTab = !existingTabId;

  if (isFreshTopLevelTab && Object.keys(registry).length === 0) {
    clearAllAuthEntries();
  }

  const tabId = existingTabId || createTabId();
  sessionStorageSafe.setItem(TAB_ID_SESSION_KEY, tabId);

  const heartbeat = () => {
    const nextRegistry = pruneTabRegistry(readTabRegistry());
    nextRegistry[tabId] = Date.now();
    writeTabRegistry(nextRegistry);
  };

  const unregister = () => {
    const nextRegistry = pruneTabRegistry(readTabRegistry());
    delete nextRegistry[tabId];
    writeTabRegistry(nextRegistry);
  };

  heartbeat();

  try {
    window.addEventListener("pagehide", unregister);
    window.addEventListener("beforeunload", unregister);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") heartbeat();
    });
    window.setInterval(heartbeat, TAB_HEARTBEAT_MS);
  } catch {}
}

function readAnyAuthValue() {
  for (const key of AUTH_STORAGE_KEYS) {
    const localValue = localStorageSafe.getItem(key);
    if (localValue) return localValue;
    const sessionValue = sessionStorageSafe.getItem(key);
    if (sessionValue) return sessionValue;
  }
  return null;
}

function mirrorAuthValue(value) {
  AUTH_STORAGE_KEYS.forEach((key) => {
    if (value === null) {
      localStorageSafe.removeItem(key);
      sessionStorageSafe.removeItem(key);
      return;
    }
    localStorageSafe.setItem(key, String(value));
    sessionStorageSafe.setItem(key, String(value));
  });
}

bootstrapBrowserSessionScope();
const bootstrappedAuthValue = readAnyAuthValue();
if (bootstrappedAuthValue) {
  mirrorAuthValue(bootstrappedAuthValue);
}

const authStorage = {
  getItem(key) {
    if (!AUTH_STORAGE_KEYS.includes(key)) {
      return localStorageSafe.getItem(key) ?? sessionStorageSafe.getItem(key);
    }
    const value = readAnyAuthValue();
    if (value) mirrorAuthValue(value);
    return value;
  },
  setItem(key, value) {
    if (!AUTH_STORAGE_KEYS.includes(key)) {
      localStorageSafe.setItem(key, String(value));
      return;
    }
    mirrorAuthValue(value);
  },
  removeItem(key) {
    if (!AUTH_STORAGE_KEYS.includes(key)) {
      localStorageSafe.removeItem(key);
      sessionStorageSafe.removeItem(key);
      return;
    }
    clearAllAuthEntries();
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: authStorage,
    storageKey: DEFAULT_AUTH_STORAGE_KEY,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
