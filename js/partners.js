export const PARTNER_ADAPTERS = {
  pmb_oai: ["identify", "list_sets", "list_records", "map_holdings"],
  pmb_jsonrpc: ["search", "fetch_notice", "fetch_items", "map_holdings"],
  pmb_html: ["search_html", "fetch_notice_html", "parse_holdings_table"],
  koha_rest: ["list_biblios", "fetch_biblio", "fetch_items"],
  koha_oai: ["identify", "list_records", "map_items_if_present"],
  koha_ilsdi: ["lookup_services", "fetch_biblio_services"],
  koha_sru: ["search_retrieve"]
};

export const PARTNER_PRESETS = [
  {
    slug: "cira",
    label: "CIRA Lausanne — PMB provável",
    displayName: "CIRA Lausanne",
    baseUrl: "https://www.cira.ch/catalogue",
    softwareFamily: "pmb",
    softwareConfidence: "strong_inference",
    countryCode: "CH",
    notes: "OPAC público PMB provável"
  },
  {
    slug: "csl-milano",
    label: "CSL Milano / Archivio Pinelli — PMB",
    displayName: "Centro studi libertari / Archivio G. Pinelli",
    baseUrl: "https://archivio.centrostudilibertari.it/opac_css",
    softwareFamily: "pmb",
    softwareConfidence: "confirmed",
    countryCode: "IT",
    notes: "Catalogo in linea PMB"
  },
  {
    slug: "koha-generico",
    label: "Koha genérico — base de teste",
    displayName: "Biblioteca parceira Koha",
    baseUrl: "https://koha.example.org",
    softwareFamily: "koha",
    softwareConfidence: "generic",
    countryCode: "",
    notes: "Instância Koha genérica para preparação"
  }
];

export function normalizePartnerBaseUrl(baseUrl) {
  return String(baseUrl || "").trim().replace(/\/+$/, "");
}

export function normalizePartnerSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function inferSoftwareFamily(baseUrl, fallback = "unknown") {
  const raw = normalizePartnerBaseUrl(baseUrl).toLowerCase();
  if (!raw) return fallback || "unknown";
  if (raw.includes("/cgi-bin/koha") || raw.includes("koha")) return "koha";
  if (raw.includes("/opac_css") || raw.includes("/catalogue") || raw.includes("/catalog")) return fallback || "pmb";
  return fallback || "unknown";
}

export function buildCapabilityProbe(baseUrl) {
  const cleanBase = normalizePartnerBaseUrl(baseUrl);
  if (!cleanBase) return [];

  return [
    {
      key: "koha_rest",
      family: "koha",
      label: "Koha REST API",
      url: `${cleanBase}/api/v1/`
    },
    {
      key: "koha_oai",
      family: "koha",
      label: "Koha OAI-PMH",
      url: `${cleanBase}/cgi-bin/koha/oai.pl?verb=Identify`
    },
    {
      key: "koha_ilsdi",
      family: "koha",
      label: "Koha ILS-DI",
      url: `${cleanBase}/cgi-bin/koha/ilsdi.pl`
    },
    {
      key: "koha_sru",
      family: "koha",
      label: "Koha SRU",
      url: `${cleanBase}/cgi-bin/koha/sru.pl?version=1.1&operation=explain`
    },
    {
      key: "pmb_oai",
      family: "pmb",
      label: "PMB OAI-PMH",
      url: `${cleanBase}/oai.php?verb=Identify`
    },
    {
      key: "pmb_oai_alt",
      family: "pmb",
      label: "PMB OAI (alternativo)",
      url: `${cleanBase}/oai/`
    },
    {
      key: "pmb_jsonrpc",
      family: "pmb",
      label: "PMB JSON-RPC",
      url: `${cleanBase}/jsonrpc.php`
    },
    {
      key: "pmb_soap",
      family: "pmb",
      label: "PMB SOAP WSDL",
      url: `${cleanBase}/soap.php?wsdl`
    },
    {
      key: "html_notice_guess_1",
      family: "html",
      label: "Notice HTML provável",
      url: `${cleanBase}/index.php?lvl=notice_display&id=1`
    },
    {
      key: "html_home",
      family: "html",
      label: "Página inicial do OPAC",
      url: `${cleanBase}/index.php`
    }
  ];
}

export function formatProbeReport(probes = []) {
  if (!Array.isArray(probes) || !probes.length) {
    return "";
  }

  return probes
    .map((probe, index) => {
      const num = String(index + 1).padStart(2, "0");
      const family = String(probe.family || "").toUpperCase() || "GEN";
      const label = String(probe.label || probe.key || "").trim();
      const url = String(probe.url || "").trim();
      return `${num}. [${family}] ${label}
${url}`;
    })
    .join("

");
}

function escapeSqlLiteral(value) {
  return String(value ?? "").replace(/'/g, "''");
}

export function buildPartnerSeedSql(payload = {}) {
  const displayName = String(payload.displayName || "").trim();
  const baseUrl = normalizePartnerBaseUrl(payload.baseUrl);
  const softwareFamily = String(payload.softwareFamily || "unknown").trim() || "unknown";
  const softwareConfidence = String(payload.softwareConfidence || "unknown").trim() || "unknown";
  const countryCode = String(payload.countryCode || "").trim().toUpperCase();
  const notes = String(payload.notes || "").trim();

  const slug =
    normalizePartnerSlug(payload.slug) ||
    normalizePartnerSlug(displayName) ||
    normalizePartnerSlug(baseUrl);

  if (!slug || !displayName || !baseUrl) {
    return "";
  }

  return [
    "insert into public.catalog_partners (",
    "  slug,",
    "  display_name,",
    "  base_url,",
    "  software_family,",
    "  software_confidence,",
    "  country_code,",
    "  notes,",
    "  is_active",
    ") values (",
    `  '${escapeSqlLiteral(slug)}',`,
    `  '${escapeSqlLiteral(displayName)}',`,
    `  '${escapeSqlLiteral(baseUrl)}',`,
    `  '${escapeSqlLiteral(softwareFamily)}',`,
    `  '${escapeSqlLiteral(softwareConfidence)}',`,
    `  '${escapeSqlLiteral(countryCode)}',`,
    `  '${escapeSqlLiteral(notes)}',`,
    "  true",
    ")",
    "on conflict (slug) do update set",
    "  display_name = excluded.display_name,",
    "  base_url = excluded.base_url,",
    "  software_family = excluded.software_family,",
    "  software_confidence = excluded.software_confidence,",
    "  country_code = excluded.country_code,",
    "  notes = excluded.notes,",
    "  is_active = excluded.is_active,",
    "  updated_at = now();"
  ].join("
");
}
