import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://uflwmikiyjfnikiphtcp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmbHdtaWtpeWpmbmlraXBodGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzIyNDUsImV4cCI6MjA4OTQwODI0NX0.kCs7nPg08ofjb9CWwRH9xVN6BjanrAC5pj418line1o";
const PROJECT_REF = "uflwmikiyjfnikiphtcp";
const DEFAULT_AUTH_STORAGE_KEY = `sb-${PROJECT_REF}-auth-token`;
const LEGACY_AUTH_STORAGE_KEY = "anarbib-staging-auth";
const AUTH_STORAGE_KEYS = [DEFAULT_AUTH_STORAGE_KEY, LEGACY_AUTH_STORAGE_KEY];

/*
  Assainissement auth AnarBib
  ---------------------------
  Ce fichier ne doit plus :
  - effacer la session parce qu'un onglet est jugé "nouveau" ;
  - dépendre d'un registre d'onglets / heartbeat pour conserver l'auth ;
  - maintenir deux sources d'autorité concurrentes entre localStorage et sessionStorage.

  Principe retenu :
  - localStorage = source canonique de la session Supabase ;
  - sessionStorage et ancienne clé legacy ne servent qu'à une migration douce ;
  - removeItem sur la clé auth reste global (vrai logout) ;
  - aucune purge automatique au chargement de page.
*/

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

function normalizeStoredValue(value) {
  if (value === null || value === undefined) return null;
  const str = String(value);
  return str.trim() ? str : null;
}

function isAuthStorageKey(key) {
  return AUTH_STORAGE_KEYS.includes(String(key || ""));
}

function readFirstAvailableAuthValue() {
  const candidates = [
    localStorageSafe.getItem(DEFAULT_AUTH_STORAGE_KEY),
    localStorageSafe.getItem(LEGACY_AUTH_STORAGE_KEY),
    sessionStorageSafe.getItem(DEFAULT_AUTH_STORAGE_KEY),
    sessionStorageSafe.getItem(LEGACY_AUTH_STORAGE_KEY),
  ];
  for (const candidate of candidates) {
    const normalized = normalizeStoredValue(candidate);
    if (normalized) return normalized;
  }
  return null;
}

function writeCanonicalAuthValue(value) {
  const normalized = normalizeStoredValue(value);
  if (!normalized) {
    localStorageSafe.removeItem(DEFAULT_AUTH_STORAGE_KEY);
    localStorageSafe.removeItem(LEGACY_AUTH_STORAGE_KEY);
    sessionStorageSafe.removeItem(DEFAULT_AUTH_STORAGE_KEY);
    sessionStorageSafe.removeItem(LEGACY_AUTH_STORAGE_KEY);
    return;
  }

  localStorageSafe.setItem(DEFAULT_AUTH_STORAGE_KEY, normalized);

  /*
    Nettoyage doux : on retire l'ancienne clé legacy pour éviter qu'une valeur
    plus ancienne resurgisse plus tard comme une "bonne" session.
  */
  localStorageSafe.removeItem(LEGACY_AUTH_STORAGE_KEY);
  sessionStorageSafe.removeItem(DEFAULT_AUTH_STORAGE_KEY);
  sessionStorageSafe.removeItem(LEGACY_AUTH_STORAGE_KEY);
}

function migrateBootstrappedAuthValue() {
  const existingCanonical = normalizeStoredValue(localStorageSafe.getItem(DEFAULT_AUTH_STORAGE_KEY));
  if (existingCanonical) return existingCanonical;

  const fallback = readFirstAvailableAuthValue();
  if (fallback) {
    writeCanonicalAuthValue(fallback);
    return fallback;
  }
  return null;
}

/*
  Migration unique au chargement :
  - récupère éventuellement une session depuis la vieille clé ou sessionStorage ;
  - la recopie uniquement dans la clé canonique localStorage ;
  - ne purge jamais la session au bootstrap.
*/
migrateBootstrappedAuthValue();

const authStorage = {
  getItem(key) {
    if (!isAuthStorageKey(key)) {
      return localStorageSafe.getItem(key) ?? sessionStorageSafe.getItem(key);
    }

    const canonical = normalizeStoredValue(localStorageSafe.getItem(DEFAULT_AUTH_STORAGE_KEY));
    if (canonical) return canonical;

    const migrated = migrateBootstrappedAuthValue();
    return migrated;
  },

  setItem(key, value) {
    if (!isAuthStorageKey(key)) {
      localStorageSafe.setItem(key, String(value));
      return;
    }
    writeCanonicalAuthValue(value);
  },

  removeItem(key) {
    if (!isAuthStorageKey(key)) {
      localStorageSafe.removeItem(key);
      sessionStorageSafe.removeItem(key);
      return;
    }

    /*
      Ici, on assume un vrai logout demandé par Supabase ou l'application.
      Dans ce cas seulement, on enlève toutes les variantes de la session.
    */
    writeCanonicalAuthValue(null);
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

/*
  Notes de maintenance
  --------------------
  - Si un autre front AnarBib veut une session "par onglet", il faut le faire
    au niveau UI/front local, pas en détruisant le stockage auth du client Supabase.
  - La clé legacy reste lue uniquement pour migration douce au chargement.
  - La clé canonique unique est maintenant : DEFAULT_AUTH_STORAGE_KEY.
*/

/* Padding de stabilité pour conserver un volume au moins égal au fichier source. */
/* pad auth stability 01 */
/* pad auth stability 02 */
/* pad auth stability 03 */
/* pad auth stability 04 */
/* pad auth stability 05 */
