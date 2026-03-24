(function () {
  const PROJECT_REF = 'uflwmikiyjfnikiphtcp';
  const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzcHRmbW9renlrd3psc2hzbmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzcxNzcsImV4cCI6MjA4ODExMzE3N30.JkMLHPCV2AH5ELZV_1RfcoW250QEofLGvnDKSDpkcn0.';
  const THEME_BUCKET = 'library-ui-assets';
  const DEFAULT_THEME = 'default';
  const MANIFEST_FILENAME = 'manifest.json';

  const PALETTE_PRESETS = {
    default: null,
    contraste_suave: {
      primary: '#9f1220',
      secondary: '#c81e2f',
      accent: '#f3d2a2',
      panelBg: 'rgba(18,18,18,.78)',
      panelBorder: 'rgba(255,255,255,.12)',
      text: '#f4f1eb',
      muted: '#d7d0c8',
      link: '#f3d2a2',
      bgOverlay: 'linear-gradient(180deg, rgba(0,0,0,.48), rgba(0,0,0,.72))',
      buttonText: '#fff6ea'
    },
    vermelho_escuro: {
      primary: '#7d0d16',
      secondary: '#aa1521',
      accent: '#e8d7b7',
      panelBg: 'rgba(12,10,10,.82)',
      panelBorder: 'rgba(180,40,55,.26)',
      text: '#f4efea',
      muted: '#d5cbc3',
      link: '#f0c37a',
      bgOverlay: 'linear-gradient(180deg, rgba(0,0,0,.58), rgba(0,0,0,.78))',
      buttonText: '#fff7ef'
    },
    cinza_vermelho: {
      primary: '#8f1b25',
      secondary: '#b82833',
      accent: '#d8d8d8',
      panelBg: 'rgba(20,20,20,.80)',
      panelBorder: 'rgba(255,255,255,.10)',
      text: '#f2f2f2',
      muted: '#cfcfcf',
      link: '#f1d17a',
      bgOverlay: 'linear-gradient(180deg, rgba(0,0,0,.52), rgba(0,0,0,.76))',
      buttonText: '#fff7ef'
    }
  };

  const FONT_PACK_PRESETS = {
    default: {
      heading: { family: 'Noto Sans Variable', url: 'catalog/fonts/title-noto-sans.woff2', weight: '100 900', display: 'swap' },
      body: { family: 'Noto Sans Variable', url: 'catalog/fonts/ui-noto-sans.woff2', weight: '100 900', display: 'swap' },
      accent: { family: 'Roboto Mono Variable', url: 'catalog/fonts/accent-roboto-mono.woff2', weight: '100 700', display: 'swap' }
    },
    biblioteca_acolhedora: {
      heading: { family: 'Open Sans Variable', url: 'catalog/fonts/title-open-sans.woff2', weight: '300 800', display: 'swap' },
      body: { family: 'Open Sans Variable', url: 'catalog/fonts/ui-open-sans.woff2', weight: '300 800', display: 'swap' },
      accent: { family: 'Roboto Mono Variable', url: 'catalog/fonts/accent-roboto-mono.woff2', weight: '100 700', display: 'swap' }
    },
    moderna_clara: {
      heading: { family: 'Inter Variable', url: 'catalog/fonts/title-inter.woff2', weight: '100 900', display: 'swap' },
      body: { family: 'Source Sans 3 Variable', url: 'catalog/fonts/ui-source-sans-3.woff2', weight: '200 900', display: 'swap' },
      accent: { family: 'Geist Mono', url: 'catalog/fonts/accent-geist-mono.woff2', weight: '400 700', display: 'swap' }
    },
    identidade_local: {
      heading: { family: 'Instrument Sans Variable', url: 'catalog/fonts/title-instrument-sans.woff2', weight: '400 700', display: 'swap' },
      body: { family: 'Noto Sans Variable', url: 'catalog/fonts/ui-noto-sans.woff2', weight: '100 900', display: 'swap' },
      accent: { family: 'Roboto Mono Variable', url: 'catalog/fonts/accent-roboto-mono.woff2', weight: '100 700', display: 'swap' }
    },
    editorial_serio: {
      heading: { family: 'PT Serif', url: 'catalog/fonts/title-pt-serif.woff2', weight: '400 700', display: 'swap' },
      body: { family: 'Noto Sans Variable', url: 'catalog/fonts/ui-noto-sans.woff2', weight: '100 900', display: 'swap' },
      accent: { family: 'Roboto Mono Variable', url: 'catalog/fonts/accent-roboto-mono.woff2', weight: '100 700', display: 'swap' }
    },
    serif_moderna: {
      heading: { family: 'Roboto Serif Variable', url: 'catalog/fonts/title-roboto-serif.woff2', weight: '100 900', display: 'swap' },
      body: { family: 'Inter Variable', url: 'catalog/fonts/ui-inter.woff2', weight: '100 900', display: 'swap' },
      accent: { family: 'Geist Mono', url: 'catalog/fonts/accent-geist-mono.woff2', weight: '400 700', display: 'swap' }
    },
    amigavel_contemporanea: {
      heading: { family: 'DM Sans Variable', url: 'catalog/fonts/title-dm-sans.woff2', weight: '100 900', display: 'swap' },
      body: { family: 'DM Sans Variable', url: 'catalog/fonts/ui-dm-sans.woff2', weight: '100 900', display: 'swap' },
      accent: { family: 'Roboto Mono Variable', url: 'catalog/fonts/accent-roboto-mono.woff2', weight: '100 700', display: 'swap' }
    },
    assinatura_leve: {
      heading: { family: 'Sora Variable', url: 'catalog/fonts/title-sora.woff2', weight: '100 800', display: 'swap' },
      body: { family: 'Noto Sans Variable', url: 'catalog/fonts/ui-noto-sans.woff2', weight: '100 900', display: 'swap' },
      accent: { family: 'Geist Mono', url: 'catalog/fonts/accent-geist-mono.woff2', weight: '400 700', display: 'swap' }
    },
    system: {
      heading: { systemStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' },
      body: { systemStack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif' },
      accent: { systemStack: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace' }
    }
  };

  function publicAsset(path) {
    return `${SUPABASE_URL}/storage/v1/object/public/${THEME_BUCKET}/${path}`;
  }

  function currentContext() {
    if (window.AnarBibLibraryContext?.get) return window.AnarBibLibraryContext.get();
    return {
      librarySlug: document.documentElement.dataset.librarySlug || DEFAULT_THEME,
      themeSlug: document.documentElement.dataset.themeSlug || DEFAULT_THEME,
      libraryName: document.documentElement.dataset.libraryName || 'AnarBib'
    };
  }

  function setCssVar(name, value) {
    if (value == null || value === '') return;
    document.documentElement.style.setProperty(name, value);
  }

  function isAbsoluteUrl(value) {
    return /^https?:\/\//i.test(String(value || '').trim());
  }

  function normalizeThemeRelativePath(rawPath) {
    const clean = String(rawPath || '').trim().replace(/^\.?\//, '');
    if (!clean) return '';
    if (clean.startsWith('themes/') || clean.startsWith('catalog/')) return clean;
    return `themes/${clean}`;
  }

  function extractBucketPathFromSupabaseUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    const patterns = [
      `/storage/v1/object/public/${THEME_BUCKET}/`,
      `/storage/v1/object/sign/${THEME_BUCKET}/`,
      `/storage/v1/object/authenticated/${THEME_BUCKET}/`,
      `/storage/v1/object/${THEME_BUCKET}/`
    ];
    for (const marker of patterns) {
      const idx = raw.indexOf(marker);
      if (idx >= 0) {
        return decodeURIComponent(raw.slice(idx + marker.length).split('?')[0]);
      }
    }
    return '';
  }

  function resolveThemeAssetUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return '';
    if (isAbsoluteUrl(raw)) {
      const bucketPath = extractBucketPathFromSupabaseUrl(raw);
      return bucketPath ? publicAsset(bucketPath) : raw;
    }
    const normalized = normalizeThemeRelativePath(raw);
    return normalized ? publicAsset(normalized) : '';
  }

  async function fetchManifest(themeSlug) {
    const safeSlug = String(themeSlug || DEFAULT_THEME).trim().toLowerCase() || DEFAULT_THEME;
    const manifestUrl = publicAsset(`themes/${safeSlug}/${MANIFEST_FILENAME}`);
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Theme manifest not found for ${safeSlug}`);
    const manifest = await response.json();
    manifest.__resolvedSlug = safeSlug;
    manifest.__manifestUrl = manifestUrl;
    return manifest;
  }

  async function fetchLibraryThemeConfig(librarySlug) {
    const safeSlug = String(librarySlug || DEFAULT_THEME).trim().toLowerCase() || DEFAULT_THEME;
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_library_theme_config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ p_library_slug: safeSlug })
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        throw new Error(`Theme config fetch failed (${response.status})${detail ? `: ${detail}` : ''}`);
      }
      const data = await response.json();
      return data && typeof data === 'object' ? data : {};
    } catch (error) {
      console.warn('[AnarBib] Theme config fetch failed:', safeSlug, error);
      return {};
    }
  }

  function mergeThemeConfig(manifest, themeConfig) {
    const merged = {
      ...manifest,
      assets: { ...(manifest.assets || {}) },
      colors: { ...(manifest.colors || {}) },
      layout: { ...(manifest.layout || {}) },
      fonts: { ...(manifest.fonts || {}) }
    };

    const backgroundUrl = String(themeConfig?.background_url || '').trim();
    const palettePreset = String(themeConfig?.palette_preset || 'default').trim() || 'default';
    const fontPack = String(themeConfig?.font_pack || 'default').trim() || 'default';

    if (backgroundUrl) merged.assets.background = backgroundUrl;
    if (PALETTE_PRESETS[palettePreset]) merged.colors = { ...merged.colors, ...PALETTE_PRESETS[palettePreset] };
    if (FONT_PACK_PRESETS[fontPack]) merged.fonts = { ...merged.fonts, ...FONT_PACK_PRESETS[fontPack] };

    merged.__themeConfig = {
      library_slug: String(themeConfig?.library_slug || '').trim().toLowerCase(),
      background_url: backgroundUrl,
      palette_preset: palettePreset,
      font_pack: fontPack
    };
    return merged;
  }

  async function installFont(definition, cssVarName) {
    if (!definition) return;
    if (definition.systemStack) {
      setCssVar(cssVarName, definition.systemStack);
      return;
    }
    if (!definition.family || !definition.url) return;
    const resolvedUrl = resolveThemeAssetUrl(definition.url);
    if (!resolvedUrl) return;
    try {
      const fontFace = new FontFace(
        definition.family,
        `url("${resolvedUrl}")`,
        {
          style: definition.style || 'normal',
          weight: definition.weight || '400',
          display: definition.display || 'swap'
        }
      );
      const loaded = await fontFace.load();
      document.fonts.add(loaded);
      setCssVar(cssVarName, `"${definition.family}"`);
    } catch (error) {
      console.warn('[AnarBib] Font load failed:', definition.family, resolvedUrl, error);
    }
  }

  function ensureFavicon(href) {
    if (!href) return;
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = href;
  }

  function applyBrandAssets(assets) {
    if (!assets) return;
    if (assets.background) {
      const bgUrl = resolveThemeAssetUrl(assets.background);
      if (bgUrl) setCssVar('--brand-bg-image', `url("${bgUrl}")`);
    }

    const logoNodes = document.querySelectorAll('[data-brand-logo]');
    if (assets.logo) {
      const logoUrl = resolveThemeAssetUrl(assets.logo);
      logoNodes.forEach((node) => {
        if (node.tagName === 'IMG') {
          node.src = logoUrl;
          node.alt = node.alt || 'Logotipo';
        } else {
          node.style.backgroundImage = `url("${logoUrl}")`;
        }
      });
    }

    const faviconUrl = assets.favicon ? resolveThemeAssetUrl(assets.favicon) : '';
    ensureFavicon(faviconUrl);
  }

  function applyColors(colors) {
    if (!colors) return;
    setCssVar('--brand-color-primary', colors.primary);
    setCssVar('--brand-color-secondary', colors.secondary);
    setCssVar('--brand-color-accent', colors.accent);
    setCssVar('--brand-panel-bg', colors.panelBg);
    setCssVar('--brand-panel-border', colors.panelBorder);
    setCssVar('--brand-text', colors.text);
    setCssVar('--brand-muted', colors.muted);
    setCssVar('--brand-link', colors.link);
    setCssVar('--brand-bg-overlay', colors.bgOverlay);
    setCssVar('--brand-button-text', colors.buttonText);
  }

  function applyLayout(layout) {
    if (!layout) return;
    setCssVar('--brand-radius', layout.radius);
    setCssVar('--brand-shadow', layout.shadow);
    setCssVar('--brand-hero-max-width', layout.heroMaxWidth);
    setCssVar('--brand-container-max-width', layout.containerMaxWidth);
  }

  function applyMeta(manifest, context) {
    const titleSuffix = manifest?.meta?.titleSuffix || context.libraryName || 'AnarBib';
    document.documentElement.dataset.themeLoaded = 'true';
    document.documentElement.dataset.themeSlug = manifest.__resolvedSlug;
    document.documentElement.dataset.themeName = manifest.name || titleSuffix;
    document.documentElement.dataset.librarySlug = context.librarySlug || DEFAULT_THEME;
    document.documentElement.dataset.libraryName = context.libraryName || manifest.name || 'AnarBib';
  }

  async function applyManifest(manifest, context) {
    applyBrandAssets(manifest.assets);
    applyColors(manifest.colors);
    applyLayout(manifest.layout);
    if (manifest.fonts?.heading) await installFont(manifest.fonts.heading, '--brand-font-heading');
    if (manifest.fonts?.body) await installFont(manifest.fonts.body, '--brand-font-body');
    if (manifest.fonts?.accent) await installFont(manifest.fonts.accent, '--brand-font-accent');
    applyMeta(manifest, context);
  }

  async function loadTheme() {
    const context = currentContext();
    const preferredSlug = context.themeSlug || context.librarySlug || DEFAULT_THEME;

    try {
      const manifest = await fetchManifest(preferredSlug);
      const themeConfig = await fetchLibraryThemeConfig(context.librarySlug || preferredSlug);
      const mergedManifest = mergeThemeConfig(manifest, themeConfig);
      await applyManifest(mergedManifest, context);
      return mergedManifest;
    } catch (primaryError) {
      if (preferredSlug === DEFAULT_THEME) {
        console.error('[AnarBib] Default theme failed to load.', primaryError);
        return null;
      }
      try {
        const fallbackManifest = await fetchManifest(DEFAULT_THEME);
        const themeConfig = await fetchLibraryThemeConfig(context.librarySlug || DEFAULT_THEME);
        const mergedFallbackManifest = mergeThemeConfig(fallbackManifest, themeConfig);
        await applyManifest(mergedFallbackManifest, context);
        return mergedFallbackManifest;
      } catch (fallbackError) {
        console.error('[AnarBib] Fallback theme failed to load.', fallbackError);
        return null;
      }
    }
  }

  window.AnarBibThemeLoader = {
    load: loadTheme,
    publicAsset,
    bucket: THEME_BUCKET,
    projectRef: PROJECT_REF
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      void loadTheme();
    }, { once: true });
  } else {
    void loadTheme();
  }
})();
