import { createHash, timingSafeEqual } from 'node:crypto'

export enum OpportunityApiKeyStatus {
  // No Authorization header: call from the TEE front, made by the user's browser
  Missing = 'missing',
  Valid = 'valid',
  Invalid = 'invalid'
}

// Server-to-server calls of partners (AGIR) authenticate with "Authorization: Bearer <key>".
// Valid keys are read from OPPORTUNITY_API_KEYS (comma separated: one key per environment or partner).
export class OpportunityApiKey {
  static readonly envName = 'OPPORTUNITY_API_KEYS'

  private static readonly _bearerPattern = /^Bearer\s+(\S+)\s*$/i

  static validKeys(rawKeys: string | undefined = process.env[this.envName]): string[] {
    if (!rawKeys) {
      return []
    }

    return rawKeys
      .split(',')
      .map((key) => key.trim())
      .filter((key) => key !== '')
  }

  static status(authorization: string | undefined, validKeys: string[] = this.validKeys()): OpportunityApiKeyStatus {
    if (authorization === undefined) {
      return OpportunityApiKeyStatus.Missing
    }

    const key = this._bearerPattern.exec(authorization)?.[1]
    if (key === undefined) {
      return OpportunityApiKeyStatus.Invalid
    }

    // Every key is compared, so the response time does not reveal which one matched
    let isValid = false
    for (const validKey of validKeys) {
      isValid = this._safeEqual(key, validKey) || isValid
    }

    return isValid ? OpportunityApiKeyStatus.Valid : OpportunityApiKeyStatus.Invalid
  }

  // Hashing first gives buffers of equal length, as timingSafeEqual requires, without leaking the key length
  private static _safeEqual(key: string, validKey: string): boolean {
    return timingSafeEqual(this._hash(key), this._hash(validKey))
  }

  private static _hash(value: string): Buffer {
    return createHash('sha256').update(value).digest()
  }
}
