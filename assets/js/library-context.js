(function () {
  const STORAGE_KEY = 'anarbib.libraryContext';
  const DEFAULT_CONTEXT = Object.freeze({
    librarySlug: 'default',
    themeSlug: 'default',
    libraryName: 'AnarBib',
    source: 'fallback'
  });

  function normalizeSlug(value, fallback) {
    const v = String(value || '').trim().toLowerCase();
    return v || fallback;
  }

  function readJsonSession() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeJsonSession(ctx) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
    } catch {
      // ignore quota / privacy mode errors
    }
  }

  function fromDataset() {
    const root = document.documentElement;
    if (!root) return null;

    const librarySlug = root.dataset.librarySlug || root.dataset.bibliotecaSlug;
    const themeSlug = root.dataset.themeSlug;
    const libraryName = root.dataset.libraryName || root.dataset.bibliotecaNome;

    if (!librarySlug && !themeSlug && !libraryName) return null;

    return {
      librarySlug: normalizeSlug(librarySlug, 'default'),
      themeSlug: normalizeSlug(themeSlug || librarySlug, 'default'),
      libraryName: libraryName || 'AnarBib',
      source: 'dataset'
    };
  }

  function fromQuery() {
    const url = new URL(window.location.href);
    const librarySlug = url.searchParams.get('library') || url.searchParams.get('biblioteca');
    const themeSlug = url.searchParams.get('theme');
    const libraryName = url.searchParams.get('library_name') || url.searchParams.get('biblioteca_nome');

    if (!librarySlug && !themeSlug && !libraryName) return null;

    return {
      librarySlug: normalizeSlug(librarySlug, 'default'),
      themeSlug: normalizeSlug(themeSlug || librarySlug, 'default'),
      libraryName: libraryName || 'AnarBib',
      source: 'query'
    };
  }

  function fromLegacySession() {
    const librarySlug = sessionStorage.getItem('active_library_slug') || sessionStorage.getItem('library_slug');
    const themeSlug = sessionStorage.getItem('active_theme_slug') || sessionStorage.getItem('theme_slug');
    const libraryName = sessionStorage.getItem('active_library_name') || sessionStorage.getItem('library_name');

    if (!librarySlug && !themeSlug && !libraryName) return null;

    return {
      librarySlug: normalizeSlug(librarySlug, 'default'),
      themeSlug: normalizeSlug(themeSlug || librarySlug, 'default'),
      libraryName: libraryName || 'AnarBib',
      source: 'legacy-session'
    };
  }

  function mergeContext(base, incoming) {
    return {
      librarySlug: normalizeSlug(incoming?.librarySlug, base.librarySlug || 'default'),
      themeSlug: normalizeSlug(incoming?.themeSlug || incoming?.librarySlug, base.themeSlug || 'default'),
      libraryName: incoming?.libraryName || base.libraryName || 'AnarBib',
      source: incoming?.source || base.source || 'unknown'
    };
  }

  function resolveContext() {
    const resolved = [
      fromDataset(),
      fromQuery(),
      readJsonSession(),
      fromLegacySession(),
      window.ANARBIB_LIBRARY_CONTEXT || null,
      DEFAULT_CONTEXT
    ].filter(Boolean).reduce(mergeContext, DEFAULT_CONTEXT);

    writeJsonSession(resolved);

    try {
      document.documentElement.dataset.librarySlug = resolved.librarySlug;
      document.documentElement.dataset.themeSlug = resolved.themeSlug;
      document.documentElement.dataset.libraryName = resolved.libraryName;
    } catch {
      // no-op
    }

    return resolved;
  }

  function setContext(next) {
    const merged = mergeContext(resolveContext(), next || {});
    merged.source = next?.source || 'manual';
    writeJsonSession(merged);
    document.documentElement.dataset.librarySlug = merged.librarySlug;
    document.documentElement.dataset.themeSlug = merged.themeSlug;
    document.documentElement.dataset.libraryName = merged.libraryName;
    return merged;
  }

  window.AnarBibLibraryContext = {
    key: STORAGE_KEY,
    get: resolveContext,
    set: setContext,
    clear() {
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };
})();
