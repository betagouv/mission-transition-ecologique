/**
 * Network failures of fetch, axios and playwright, normalized so that the report can tell
 * a dead domain from a connection dropped by a firewall.
 */
export enum NetworkError {
  DomainNotFound = 'domainNotFound',
  Timeout = 'timeout',
  Refused = 'refused',
  Reset = 'reset',
  Unreachable = 'unreachable',
  Certificate = 'certificate',
  Other = 'other'
}

const _codes: Record<string, NetworkError> = {
  // EAI_AGAIN is a temporary resolver failure: not a dead domain, the browser decides
  ENOTFOUND: NetworkError.DomainNotFound,
  'net::ERR_NAME_NOT_RESOLVED': NetworkError.DomainNotFound,
  EAI_AGAIN: NetworkError.Timeout,
  ETIMEDOUT: NetworkError.Timeout,
  ECONNABORTED: NetworkError.Timeout,
  UND_ERR_CONNECT_TIMEOUT: NetworkError.Timeout,
  UND_ERR_HEADERS_TIMEOUT: NetworkError.Timeout,
  'net::ERR_TIMED_OUT': NetworkError.Timeout,
  'net::ERR_CONNECTION_TIMED_OUT': NetworkError.Timeout,
  ECONNREFUSED: NetworkError.Refused,
  'net::ERR_CONNECTION_REFUSED': NetworkError.Refused,
  ECONNRESET: NetworkError.Reset,
  EPIPE: NetworkError.Reset,
  UND_ERR_SOCKET: NetworkError.Reset,
  'net::ERR_CONNECTION_RESET': NetworkError.Reset,
  'net::ERR_CONNECTION_CLOSED': NetworkError.Reset,
  'net::ERR_EMPTY_RESPONSE': NetworkError.Reset,
  EHOSTUNREACH: NetworkError.Unreachable,
  ENETUNREACH: NetworkError.Unreachable,
  'net::ERR_ADDRESS_UNREACHABLE': NetworkError.Unreachable,
  CERT_HAS_EXPIRED: NetworkError.Certificate,
  DEPTH_ZERO_SELF_SIGNED_CERT: NetworkError.Certificate,
  SELF_SIGNED_CERT_IN_CHAIN: NetworkError.Certificate,
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: NetworkError.Certificate,
  ERR_TLS_CERT_ALTNAME_INVALID: NetworkError.Certificate,
  'net::ERR_CERT_DATE_INVALID': NetworkError.Certificate,
  'net::ERR_CERT_AUTHORITY_INVALID': NetworkError.Certificate,
  'net::ERR_CERT_COMMON_NAME_INVALID': NetworkError.Certificate
}

const _labels: Record<NetworkError, string> = {
  [NetworkError.DomainNotFound]: 'domaine introuvable',
  [NetworkError.Timeout]: 'délai dépassé',
  [NetworkError.Refused]: 'connexion refusée',
  [NetworkError.Reset]: 'connexion coupée',
  [NetworkError.Unreachable]: 'hôte inaccessible',
  [NetworkError.Certificate]: 'certificat TLS invalide',
  [NetworkError.Other]: 'erreur réseau'
}

export function toNetworkError(error: unknown): NetworkError {
  if (!(error instanceof Error)) {
    return NetworkError.Other
  }
  // AbortSignal.timeout (fetch) and playwright timeouts
  if (error.name === 'TimeoutError' || /\bTimeout \d+ms exceeded/.test(error.message)) {
    return NetworkError.Timeout
  }
  // undici (fetch) puts the system error in cause, axios on the error itself
  const cause = (error as { cause?: { code?: unknown } }).cause
  for (const code of [cause?.code, (error as { code?: unknown }).code]) {
    if (typeof code === 'string' && _codes[code]) {
      return _codes[code]
    }
  }
  const chromiumCode = error.message.match(/net::ERR_[A-Z0-9_]+/)?.[0]
  return (chromiumCode && _codes[chromiumCode]) || NetworkError.Other
}

export function networkErrorLabel(error: NetworkError): string {
  return _labels[error]
}
