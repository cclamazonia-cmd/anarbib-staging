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

function normalizeSelector(value, fallback) {
  if (!value) return fallback;
  if (typeof value !== "string") return fallback;
  if (value.startsWith("#") || value.startsWith(".") || value.startsWith("[")) return value;
  return `#${value}`;
}

function resolvePageConfig(pageKey) {
  if (!pageKey) return CONFIG.PAGE || {};
  return CONFIG.PAGES?.[pageKey] || CONFIG.PAGE || {};
}

export function applyPageChrome(pageOrOptions = {}, maybeOptions = {}) {
  const pageKey = typeof pageOrOptions === "string" ? pageOrOptions : "";
  const options = typeof pageOrOptions === "string" ? (maybeOptions || {}) : (pageOrOptions || {});
  const pageConfig = resolvePageConfig(pageKey);

  const title = options.title || pageConfig.title || "";
  const logoSelector = normalizeSelector(options.logoSelector || options.logoId, "#brandLogo");
  const brandTitleSelector = normalizeSelector(options.brandTitleSelector || options.brandTitleId, "#brandTitle");
  const brandSubtitleSelector = normalizeSelector(options.brandSubtitleSelector || options.brandSubtitleId, "#brandSubtitle");
  const heroTitleSelector = normalizeSelector(options.heroTitleSelector || options.heroTitleId, "#heroTitle");
  const heroSubtitleSelector = normalizeSelector(options.heroSubtitleSelector || options.heroSubtitleId, "#heroSubtitle");

  if (title) setDocumentTitle(title);
  if (CONFIG.BRANDING?.favicon) setFavicon(CONFIG.BRANDING.favicon);

  const logo = document.querySelector(logoSelector);
  if (logo && CONFIG.BRANDING?.logo) {
    logo.src = CONFIG.BRANDING.logo;
    logo.alt = CONFIG.BRANDING?.name || "AnarBib";
  }

  const brandTitle = document.querySelector(brandTitleSelector);
  if (brandTitle) {
    brandTitle.textContent = pageConfig.brandTitle || CONFIG.BRANDING?.name || brandTitle.textContent;
  }

  const brandSubtitle = document.querySelector(brandSubtitleSelector);
  if (brandSubtitle) {
    brandSubtitle.textContent = pageConfig.brandSubtitle || CONFIG.BRANDING?.subtitle || brandSubtitle.textContent;
  }

  const heroTitle = document.querySelector(heroTitleSelector);
  if (heroTitle && (pageConfig.heroTitle || CONFIG.PAGE?.heroTitle)) {
    heroTitle.textContent = pageConfig.heroTitle || CONFIG.PAGE?.heroTitle;
  }

  const heroSubtitle = document.querySelector(heroSubtitleSelector);
  if (heroSubtitle && (pageConfig.heroSubtitle || CONFIG.PAGE?.heroSubtitle)) {
    heroSubtitle.textContent = pageConfig.heroSubtitle || CONFIG.PAGE?.heroSubtitle;
  }

  const routeMap = options.routeMap || {};
  Object.entries(routeMap).forEach(([target, routeKey]) => {
    const selector = normalizeSelector(target, "");
    if (!selector) return;
    const node = document.querySelector(selector);
    const href = CONFIG.ROUTES?.[routeKey];
    if (!node || !href) return;
    if (node.tagName === "A") {
      node.href = href;
    } else {
      node.dataset.routeHref = href;
    }
  });
}

export function buildAuthRedirectTarget(targetPath) {
  const u = new URL(targetPath, location.origin);
  return u.toString();
}
