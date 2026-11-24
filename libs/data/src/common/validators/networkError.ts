/**
 * Network failures of fetch, axios and playwright, normalized so that the report can tell
 * a dead domain from a connection dropped by a firewall.
 */
export enum NetworkError {
  DomainNotFound = 'domainNotFound',
  Timeout = 'timeout',
  Refused = 'refused',
  Reset = 'reset',
  HostUnreachable = 'hostUnreachable',
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
  EHOSTUNREACH: NetworkError.HostUnreachable,
  ENETUNREACH: NetworkError.HostUnreachable,
  'net::ERR_ADDRESS_UNREACHABLE': NetworkError.HostUnreachable
}

// Certificate errors are recognized by pattern, their list is long:
// Node (CERT_HAS_EXPIRED, DEPTH_ZERO_SELF_SIGNED_CERT, UNABLE_TO_GET_ISSUER_CERT_LOCALLY, ERR_TLS_CERT_ALTNAME_INVALID…)
// and Chromium (net::ERR_CERT_DATE_INVALID, net::ERR_CERT_REVOKED…)
function _isCertificateCode(code: string): boolean {
  return code.startsWith('net::ERR_CERT_') || (!code.startsWith('net::') && (code.includes('CERT') || code.startsWith('UNABLE_TO_')))
}

function _fromCode(code: unknown): NetworkError | undefined {
  if (typeof code !== 'string') {
    return undefined
  }
  return _codes[code] ?? (_isCertificateCode(code) ? NetworkError.Certificate : undefined)
}

const _labels: Record<NetworkError, string> = {
  [NetworkError.DomainNotFound]: 'domaine introuvable',
  [NetworkError.Timeout]: 'délai dépassé',
  [NetworkError.Refused]: 'connexion refusée',
  [NetworkError.Reset]: 'connexion coupée',
  [NetworkError.HostUnreachable]: 'hôte inaccessible',
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
    const networkError = _fromCode(code)
    if (networkError) {
      return networkError
    }
  }
  return _fromCode(error.message.match(/net::ERR_[A-Z0-9_]+/)?.[0]) ?? NetworkError.Other
}

export function networkErrorLabel(error: NetworkError): string {
  return _labels[error]
}
