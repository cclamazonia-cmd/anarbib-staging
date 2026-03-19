import { PRESETS } from "./config.presets.js";

const ACTIVE_PRESET = "anarbib_staging";

const deepMerge = (base, extra) => {
  const out = { ...base };
  for (const [key, value] of Object.entries(extra || {})) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      base[key] &&
      typeof base[key] === "object" &&
      !Array.isArray(base[key])
    ) {
      out[key] = deepMerge(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
};

export const CONFIG = deepMerge(PRESETS.default, PRESETS[ACTIVE_PRESET] || {});

export function setDocumentTitle(title) {
  document.title = title;
}

export function setFavicon(url) {
  const selectors = [
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
    'link[rel="apple-touch-icon"]',
  ];
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.href = url;
    });
  });
}

export function applyPageChrome({
  title,
  logoSelector = "#brandLogo",
  brandTitleSelector = "#brandTitle",
  brandSubtitleSelector = "#brandSubtitle",
  heroTitleSelector = "#heroTitle",
  heroSubtitleSelector = "#heroSubtitle",
} = {}) {
  if (title) setDocumentTitle(title);
  if (CONFIG.BRANDING?.favicon) setFavicon(CONFIG.BRANDING.favicon);

  const logo = document.querySelector(logoSelector);
  if (logo && CONFIG.BRANDING?.logo) {
    logo.src = CONFIG.BRANDING.logo;
    logo.alt = CONFIG.BRANDING?.name || "AnarBib";
  }

  const brandTitle = document.querySelector(brandTitleSelector);
  if (brandTitle && CONFIG.BRANDING?.name) {
    brandTitle.textContent = CONFIG.BRANDING.name;
  }

  const brandSubtitle = document.querySelector(brandSubtitleSelector);
  if (brandSubtitle && CONFIG.BRANDING?.subtitle) {
    brandSubtitle.textContent = CONFIG.BRANDING.subtitle;
  }

  const heroTitle = document.querySelector(heroTitleSelector);
  if (heroTitle && CONFIG.PAGE?.heroTitle) {
    heroTitle.textContent = CONFIG.PAGE.heroTitle;
  }

  const heroSubtitle = document.querySelector(heroSubtitleSelector);
  if (heroSubtitle && CONFIG.PAGE?.heroSubtitle) {
    heroSubtitle.textContent = CONFIG.PAGE.heroSubtitle;
  }
}

export function buildAuthRedirectTarget(targetPath) {
  const u = new URL(targetPath, location.origin);
  return u.toString();
}
