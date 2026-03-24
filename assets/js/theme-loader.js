(function () {
  const PROJECT_REF = 'uflwmikiyjfnikiphtcp';
  const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
  const THEME_BUCKET = 'library-ui-assets';
  const DEFAULT_THEME = 'default';
  const MANIFEST_FILENAME = 'manifest.json';
  const THEME_PUBLIC_VIEW = 'library_theme_public';
  const THEME_PUBLIC_SCHEMA = 'api';

  const PALETTE_PRESETS = {
    default: null,
    contraste_suave: {
      primary: '#b30018',
      secondary: '#7f1d1d',
      accent: '#e11d2f',
      panelBg: 'rgba(18,18,18,0.86)',
      panelBorder: 'rgba(255,255,255,0.14)',
      text: '#f5f5f5',
      muted: '#d1d5db',
      link: '#ffd7dc',
      bgOverlay: 'linear-gradient(180deg, rgba(0,0,0,0.52), rgba(0,0,0,0.72))',
      buttonText: '#ffffff'
    },
    vermelho_escuro: {
      primary: '#7f1d1d',
      secondary: '#991b1b',
      accent: '#dc2626',
      panelBg: 'rgba(17,17,17,0.88)',
      panelBorder: 'rgba(220,38,38,0.28)',
      text: '#f8fafc',
      muted: '#cbd5e1',
      link: '#fecaca',
      bgOverlay: 'linear-gradient(180deg, rgba(10,10,10,0.54), rgba(20,10,10,0.82))',
      buttonText: '#ffffff'
    },
    cinza_vermelho: {
      primary: '#b91c1c',
      secondary: '#334155',
      accent: '#ef4444',
      panelBg: 'rgba(23,23,23,0.86)',
      panelBorder: 'rgba(148,163,184,0.24)',
      text: '#f8fafc',
      muted: '#cbd5e1',
      link: '#fecdd3',
      bgOverlay: 'linear-gradient(180deg, rgba(2,6,23,0.54), rgba(17,17,17,0.8))',
      buttonText: '#ffffff'
    }
  };

  const FONT_PACK_PRESETS = {
    default: null,
    system: {
      heading: { family: 'System UI', stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
      body: { family: 'System UI', stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
      accent: { family: 'System Mono', stack: '"SFMono-Regular", Consolas, "Liberation Mono", monospace' }
    },
    inter_merriweather: {
      heading: { family: 'Inter', path: 'catalog/fonts/Inter-SemiBold.woff2', weight: '600' },
      body: { family: 'Merriweather', path: 'catalog/fonts/Merriweather-Regular.woff2', weight: '400' },
      accent: { family: 'Inter', path: 'catalog/fonts/Inter-Medium.woff2', weight: '500' }
    },
    inter_source: {
      heading: { family: 'Inter', path: 'catalog/fonts/Inter-SemiBold.woff2', weight: '600' },
      body: { family: 'Source Serif 4', path: 'catalog/fonts/SourceSerif4-Regular.woff2', weight: '400' },
      accent: { family: 'Inter', path: 'catalog/fonts/Inter-Medium.woff2', weight: '500' }
    },
    base_da_rede: {
      heading: { family: 'Noto Sans', path: 'catalog/fonts/NotoSans-SemiBold.woff2', weight: '600' },
      body: { family: 'Noto Sans', path: 'catalog/fonts/NotoSans-Regular.woff2', weight: '400' },
      accent: { family: 'Roboto Mono', path: 'catalog/fonts/RobotoMono-Regular.woff2', weight: '400' }
    },
    biblioteca_acolhedora: {
      heading: { family: 'Open Sans', path: 'catalog/fonts/OpenSans-SemiBold.woff2', weight: '600' },
      body: { family: 'Open Sans', path: 'catalog/fonts/OpenSans-Regular.woff2', weight: '400' },
      accent: { family: 'PT Serif', path: 'catalog/fonts/PTSerif-Regular.woff2', weight: '400' }
    },
    moderna_e_clara: {
      heading: { family: 'Inter', path: 'catalog/fonts/Inter-SemiBold.woff2', weight: '600' },
      body: { family: 'Inter', path: 'catalog/fonts/Inter-Regular.woff2', weight: '400' },
      accent: { family: 'Geist Mono', path: 'catalog/fonts/GeistMono-Regular.woff2', weight: '400' }
    },
    identidade_local: {
      heading: { family: 'Sora', path: 'catalog/fonts/Sora-SemiBold.woff2', weight: '600' },
      body: { family: 'Instrument Sans', path: 'catalog/fonts/InstrumentSans-Regular.woff2', weight: '400' },
      accent: { family: 'Roboto Mono', path: 'catalog/fonts/RobotoMono-Regular.woff2', weight: '400' }
    },
    editorial_serio: {
      heading: { family: 'PT Serif', path: 'catalog/fonts/PTSerif-Bold.woff2', weight: '700' },
      body: { family: 'Source Sans 3', path: 'catalog/fonts/SourceSans3-Regular.woff2', weight: '400' },
      accent: { family: 'Roboto Mono', path: 'catalog/fonts/RobotoMono-Regular.woff2', weight: '400' }
    },
    serif_moderna: {
      heading: { family: 'Roboto Serif', path: 'catalog/fonts/RobotoSerif-SemiBold.woff2', weight: '600' },
      body: { family: 'Roboto Serif', path: 'catalog/fonts/RobotoSerif-Regular.woff2', weight: '400' },
      accent: { family: 'Inter', path: 'catalog/fonts/Inter-Medium.woff2', weight: '500' }
    },
    amigavel_contemporanea: {
      heading: { family: 'DM Sans', path: 'catalog/fonts/DMSans-SemiBold.woff2', weight: '600' },
      body: { family: 'DM Sans', path: 'catalog/fonts/DMSans-Regular.woff2', weight: '400' },
      accent: { family: 'Geist Mono', path: 'catalog/fonts/GeistMono-Regular.woff2', weight: '400' }
    },
    assinatura_leve: {
      heading: { family: 'Geist', path: 'catalog/fonts/Geist-SemiBold.woff2', weight: '600' },
      body: { family: 'Instrument Sans', path: 'catalog/fonts/InstrumentSans-Regular.woff2', weight: '400' },
      accent: { family: 'Roboto Mono', path: 'catalog/fonts/RobotoMono-Regular.woff2', weight: '400' }
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

  function normalizePresetKey(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  function resolvePublicThemePath(value) {
    if (!value) return '';
    const raw = String(value).trim();
    if (!raw) return '';
    if (/^(data:|blob:|https?:\/\/|\/\/)/i.test(raw)) return raw;
    const normalized = raw.replace(/^\/+/, '');
    if (normalized.startsWith(`storage/v1/object/public/${THEME_BUCKET}/`)) {
      return `${SUPABASE_URL}/${normalized}`;
    }
    if (
      normalized.startsWith('catalog/') ||
      normalized.startsWith('themes/') ||
      normalized.startsWith('fonts/')
    ) {
      return publicAsset(normalized);
    }
    return raw;
  }

  function fetchManifestUrl(themeSlug) {
    const safeSlug = String(themeSlug || DEFAULT_THEME).trim().toLowerCase() || DEFAULT_THEME;
    return publicAsset(`themes/${safeSlug}/${MANIFEST_FILENAME}`);
  }

  async function fetchManifest(themeSlug) {
    const safeSlug = String(themeSlug || DEFAULT_THEME).trim().toLowerCase() || DEFAULT_THEME;
    const manifestUrl = fetchManifestUrl(safeSlug);
    const response = await fetch(manifestUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Theme manifest not found for ${safeSlug}`);
    const manifest = await response.json();
    manifest.__resolvedSlug = safeSlug;
    manifest.__manifestUrl = manifestUrl;
    return manifest;
  }

  function setCssVar(name, value) {
    if (value == null || value === '') return;
    document.documentElement.style.setProperty(name, value);
  }

  function withResolvedFontUrl(definition) {
    if (!definition) return null;
    const url = resolvePublicThemePath(definition.url || definition.path || definition.src);
    return { ...definition, url };
  }

  async function installFont(definition, cssVarName) {
    if (!definition) return;
    if (definition.stack && !definition.url && !definition.path && !definition.src) {
      setCssVar(cssVarName, definition.stack);
      return;
    }
    const resolved = withResolvedFontUrl(definition);
    if (!resolved?.family || !resolved?.url) return;
    try {
      const fontFace = new FontFace(
        resolved.family,
        `url(${resolved.url})`,
        {
          style: resolved.style || 'normal',
          weight: resolved.weight || '400',
          display: resolved.display || 'swap'
        }
      );
      const loaded = await fontFace.load();
      document.fonts.add(loaded);
      setCssVar(cssVarName, `"${resolved.family}"`);
    } catch (error) {
      console.warn('[AnarBib] Font load failed:', resolved.family, error);
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
      setCssVar('--brand-bg-image', `url("${resolvePublicThemePath(assets.background)}")`);
    }

    const logoUrl = resolvePublicThemePath(assets.logo);
    const faviconUrl = resolvePublicThemePath(assets.favicon);
    const logoNodes = document.querySelectorAll('[data-brand-logo]');
    if (logoUrl) {
      logoNodes.forEach((node) => {
        if (node.tagName === 'IMG') {
          node.src = logoUrl;
          node.alt = node.alt || 'Logotipo';
        } else {
          node.style.backgroundImage = `url("${logoUrl}")`;
        }
      });
    }

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

  function readInlineThemeOverride() {
    const scriptNode = document.getElementById('anarbib-library-theme-config');
    if (!scriptNode?.textContent) return null;
    try {
      return JSON.parse(scriptNode.textContent);
    } catch (error) {
      console.warn('[AnarBib] Invalid inline theme config JSON.', error);
      return null;
    }
  }

  function readSupabaseAnonKey() {
    const metaKey = document.querySelector('meta[name="anarbib-supabase-anon-key"]')?.content;
    return (
      window.ANARBIB_SUPABASE_ANON_KEY ||
      window.__ANARBIB_CONFIG?.SUPABASE_ANON_KEY ||
      document.documentElement.dataset.supabaseAnonKey ||
      metaKey ||
      ''
    );
  }

  async function tryFetchThemeOverrideFromView(queryField, queryValue, anonKey) {
    if (!anonKey || !queryField || !queryValue) return null;
    const url = new URL(`${SUPABASE_URL}/rest/v1/${THEME_PUBLIC_VIEW}`);
    url.searchParams.set('select', '*');
    url.searchParams.set(queryField, `eq.${queryValue}`);
    url.searchParams.set('limit', '1');

    const response = await fetch(url.toString(), {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
        'Accept-Profile': THEME_PUBLIC_SCHEMA
      },
      cache: 'no-store'
    });

    if (!response.ok) return null;
    const rows = await response.json();
    return Array.isArray(rows) && rows.length ? rows[0] : null;
  }

  async function fetchThemeOverride(context) {
    if (context?.themeConfig) return context.themeConfig;

    const inlineConfig = readInlineThemeOverride();
    if (inlineConfig) return inlineConfig;

    const explicitUrl =
      window.ANARBIB_THEME_CONFIG_URL ||
      document.documentElement.dataset.themeConfigUrl ||
      '';

    if (explicitUrl) {
      try {
        const response = await fetch(explicitUrl, { cache: 'no-store' });
        if (response.ok) return await response.json();
      } catch (error) {
        console.warn('[AnarBib] Theme override URL failed.', error);
      }
    }

    const anonKey = readSupabaseAnonKey();
    const librarySlug = String(context?.librarySlug || '').trim().toLowerCase();

    try {
      return (
        await tryFetchThemeOverrideFromView('library_slug', librarySlug, anonKey) ||
        await tryFetchThemeOverrideFromView('slug', librarySlug, anonKey) ||
        await tryFetchThemeOverrideFromView('theme_slug', librarySlug, anonKey)
      );
    } catch (error) {
      console.warn('[AnarBib] Theme override fetch failed.', error);
      return null;
    }
  }

  function normalizeThemeOverride(rawConfig) {
    if (!rawConfig || typeof rawConfig !== 'object') return null;

    const paletteKey = normalizePresetKey(
      rawConfig.palettePreset ||
      rawConfig.palette_preset ||
      rawConfig.paletteKey ||
      rawConfig.palette_key ||
      rawConfig.palette
    );

    const fontPackKey = normalizePresetKey(
      rawConfig.fontPack ||
      rawConfig.font_pack ||
      rawConfig.fontPreset ||
      rawConfig.font_preset
    );

    const normalized = {
      assets: {
        ...(rawConfig.assets || {})
      },
      colors: {
        ...(rawConfig.colors || {})
      },
      layout: {
        ...(rawConfig.layout || {})
      },
      fonts: {
        ...(rawConfig.fonts || {})
      }
    };

    const background =
      rawConfig.background ||
      rawConfig.background_url ||
      rawConfig.backgroundUrl ||
      rawConfig.background_image ||
      rawConfig.backgroundImage;

    const logo = rawConfig.logo || rawConfig.logo_url || rawConfig.logoUrl;
    const favicon = rawConfig.favicon || rawConfig.favicon_url || rawConfig.faviconUrl;

    if (background) normalized.assets.background = background;
    if (logo) normalized.assets.logo = logo;
    if (favicon) normalized.assets.favicon = favicon;

    if (PALETTE_PRESETS[paletteKey]) {
      normalized.colors = { ...PALETTE_PRESETS[paletteKey], ...normalized.colors };
    }

    if (FONT_PACK_PRESETS[fontPackKey]) {
      normalized.fonts = { ...FONT_PACK_PRESETS[fontPackKey], ...normalized.fonts };
    }

    return normalized;
  }

  function mergeThemeConfig(manifest, override) {
    if (!override) return manifest;
    return {
      ...manifest,
      assets: { ...(manifest.assets || {}), ...(override.assets || {}) },
      colors: { ...(manifest.colors || {}), ...(override.colors || {}) },
      layout: { ...(manifest.layout || {}), ...(override.layout || {}) },
      fonts: { ...(manifest.fonts || {}), ...(override.fonts || {}) }
    };
  }

  async function applyManifest(manifest, context) {
    const overrideRaw = await fetchThemeOverride(context);
    const override = normalizeThemeOverride(overrideRaw);
    const effectiveManifest = mergeThemeConfig(manifest, override);

    applyBrandAssets(effectiveManifest.assets);
    applyColors(effectiveManifest.colors);
    applyLayout(effectiveManifest.layout);

    if (effectiveManifest.fonts?.heading) await installFont(effectiveManifest.fonts.heading, '--brand-font-heading');
    if (effectiveManifest.fonts?.body) await installFont(effectiveManifest.fonts.body, '--brand-font-body');
    if (effectiveManifest.fonts?.accent) await installFont(effectiveManifest.fonts.accent, '--brand-font-accent');

    applyMeta(effectiveManifest, context);
    return effectiveManifest;
  }

  async function loadTheme() {
    const context = currentContext();
    const preferredSlug = context.themeSlug || context.librarySlug || DEFAULT_THEME;

    try {
      const manifest = await fetchManifest(preferredSlug);
      return await applyManifest(manifest, context);
    } catch (primaryError) {
      if (preferredSlug === DEFAULT_THEME) {
        console.error('[AnarBib] Default theme failed to load.', primaryError);
        return null;
      }
      try {
        const fallbackManifest = await fetchManifest(DEFAULT_THEME);
        return await applyManifest(fallbackManifest, context);
      } catch (fallbackError) {
        console.error('[AnarBib] Fallback theme failed to load.', fallbackError);
        return null;
      }
    }
  }

  window.AnarBibThemeLoader = {
    load: loadTheme,
    publicAsset,
    resolvePublicThemePath,
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
