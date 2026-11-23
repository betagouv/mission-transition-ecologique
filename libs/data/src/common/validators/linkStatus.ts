// Valid        : reachable link (2xx/3xx confirmed)
// Broken       : confirmed broken (404/410, persistent 5xx, network or TLS error)
// Malformed    : not a public web URL (local file path, non-http protocol, host without domain)
// Unverifiable : anti-bot protection (Cloudflare challenge, persistent 403/429), must be checked manually
export enum LinkStatus {
  Valid = 'valid',
  Broken = 'broken',
  Malformed = 'malformed',
  Unverifiable = 'unverifiable'
}
