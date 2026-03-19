(function () {
  const PROJECT_REF = 'uflwmikiyjfnikiphtcp';
  const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;
  const THEME_BUCKET = 'library-ui-assets';
  const DEFAULT_THEME = 'default';
  const MANIFEST_FILENAME = 'manifest.json';

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

  function setCssVar(name, value) {
    if (value == null || value === '') return;
    document.documentElement.style.setProperty(name, value);
  }

  async function installFont(definition, cssVarName) {
    if (!definition?.family || !definition?.url) return;
    try {
      const fontFace = new FontFace(
        definition.family,
        `url(${definition.url})`,
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
      console.warn('[AnarBib] Font load failed:', definition.family, error);
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
      setCssVar('--brand-bg-image', `url("${assets.background}")`);
    }

    const logoNodes = document.querySelectorAll('[data-brand-logo]');
    if (assets.logo) {
      logoNodes.forEach((node) => {
        if (node.tagName === 'IMG') {
          node.src = assets.logo;
          node.alt = node.alt || 'Logotipo';
        } else {
          node.style.backgroundImage = `url("${assets.logo}")`;
        }
      });
    }

    ensureFavicon(assets.favicon);
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
      await applyManifest(manifest, context);
      return manifest;
    } catch (primaryError) {
      if (preferredSlug === DEFAULT_THEME) {
        console.error('[AnarBib] Default theme failed to load.', primaryError);
        return null;
      }
      try {
        const fallbackManifest = await fetchManifest(DEFAULT_THEME);
        await applyManifest(fallbackManifest, context);
        return fallbackManifest;
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
