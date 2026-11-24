import { NetworkError, networkErrorLabel, toNetworkError } from '../../../src/common/validators/networkError'

describe('toNetworkError', () => {
  it.each([
    ['undici dns error', Object.assign(new TypeError('fetch failed'), { cause: { code: 'ENOTFOUND' } }), NetworkError.DomainNotFound],
    ['axios dns error', Object.assign(new Error('getaddrinfo EAI_AGAIN'), { code: 'EAI_AGAIN' }), NetworkError.DomainNotFound],
    ['fetch abort timeout', Object.assign(new Error('aborted'), { name: 'TimeoutError' }), NetworkError.Timeout],
    ['axios timeout', Object.assign(new Error('timeout of 10000ms exceeded'), { code: 'ECONNABORTED' }), NetworkError.Timeout],
    ['playwright timeout', new Error('page.goto: Timeout 20000ms exceeded.\nCall log: ...'), NetworkError.Timeout],
    ['undici refused', Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } }), NetworkError.Refused],
    ['chromium refused', new Error('page.goto: net::ERR_CONNECTION_REFUSED at https://a.fr'), NetworkError.Refused],
    ['chromium empty response', new Error('page.goto: net::ERR_EMPTY_RESPONSE at https://a.fr'), NetworkError.Reset],
    ['axios reset', Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' }), NetworkError.Reset],
    ['unknown error', new Error('socket hang up'), NetworkError.Other],
    ['not an error', 'boom', NetworkError.Other]
  ])('%s', (_name, error, expected) => {
    expect(toNetworkError(error)).toBe(expected)
  })
})

describe('networkErrorLabel', () => {
  it('gives a french label for the report', () => {
    expect(networkErrorLabel(NetworkError.Timeout)).toBe('délai dépassé')
  })
})
