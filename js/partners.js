const PARTNER_ADAPTERS = {
  pmb_oai: ["identify", "list_sets", "list_records", "map_holdings"],
  pmb_jsonrpc: ["search", "fetch_notice", "fetch_items", "map_holdings"],
  pmb_html: ["search_html", "fetch_notice_html", "parse_holdings_table"],
  koha_rest: ["list_biblios", "fetch_biblio", "fetch_items"],
  koha_oai: ["identify", "list_records", "map_items_if_present"],
  koha_ilsdi: ["lookup_services", "fetch_biblio_services"],
  koha_sru: ["search_retrieve"]
};

async function buildCapabilityProbe(baseUrl) {
  const cleanBase = String(baseUrl || "").replace(/\/+$/, "");

  return [
    { key: "koha_rest",  url: `${cleanBase}/api/v1/` },
    { key: "koha_oai",   url: `${cleanBase}/cgi-bin/koha/oai.pl?verb=Identify` },
    { key: "koha_ilsdi", url: `${cleanBase}/cgi-bin/koha/ilsdi.pl` },

    { key: "pmb_oai",     url: `${cleanBase}/oai.php?verb=Identify` },
    { key: "pmb_jsonrpc", url: `${cleanBase}/jsonrpc.php` },
    { key: "pmb_soap",    url: `${cleanBase}/soap.php?wsdl` },

    { key: "html_notice_guess_1", url: `${cleanBase}/index.php?lvl=notice_display&id=1` },
    { key: "html_home",           url: `${cleanBase}/index.php` }
  ];
}

// optionnel : rendre accessibles globalement
window.PARTNER_ADAPTERS = PARTNER_ADAPTERS;
window.buildCapabilityProbe = buildCapabilityProbe;