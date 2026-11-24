// Valid        : reachable link (2xx/3xx confirmed)
// Broken       : confirmed broken (404/410, persistent 5xx or 4xx, network or TLS error)
// Malformed    : not a public web URL (local file path, non-http protocol, host without domain)
// Unverifiable : anti-bot protection (Cloudflare challenge, 403/429 without a usable browser, 429 in a browser),
//                must be checked manually
// Forbidden    : 403 without challenge even in a real browser: a deleted file, or a firewall blocking bots or datacenter IPs,
//                must be checked manually
export enum LinkStatus {
  Valid = 'valid',
  Broken = 'broken',
  Malformed = 'malformed',
  Unverifiable = 'unverifiable',
  Forbidden = 'forbidden'
}
