import { createHash, timingSafeEqual } from 'node:crypto'

export enum OpportunityApiKeyStatus {
  // No Authorization header: call from the TEE front, made by the user's browser
  Missing = 'missing',
  Valid = 'valid',
  Invalid = 'invalid'
}

export interface PartnerApiKey {
  partner: string
  key: string
}

export interface OpportunityApiKeyCheck {
  status: OpportunityApiKeyStatus
  // Name of the partner owning the key, only for a valid key
  partner?: string
}

// Server-to-server calls of partners (AGIR) authenticate with "Authorization: Bearer <key>".
// Valid keys are read from OPPORTUNITY_API_KEYS, named by partner: "agir:xxxxxx,other-partner:yyyyyy".
// The name is sent to Brevo, so it must stay stable: during a key rotation, both keys share it ("agir:old,agir:new").
export class OpportunityApiKey {
  static readonly envName = 'OPPORTUNITY_API_KEYS'

  private static readonly _bearerPattern = /^Bearer\s+(\S+)\s*$/i

  // Entries without a name, or with an empty name or key, are ignored
  static partnerKeys(rawKeys: string | undefined = process.env[this.envName]): PartnerApiKey[] {
    if (!rawKeys) {
      return []
    }

    return rawKeys.split(',').flatMap((entry) => {
      // Split on the first colon only: base64 keys contain neither ':' nor ','
      const separatorIndex = entry.indexOf(':')
      if (separatorIndex === -1) {
        return []
      }

      const partner = entry.slice(0, separatorIndex).trim()
      const key = entry.slice(separatorIndex + 1).trim()

      return partner !== '' && key !== '' ? [{ partner, key }] : []
    })
  }

  static check(authorization: string | undefined, partnerKeys: PartnerApiKey[] = this.partnerKeys()): OpportunityApiKeyCheck {
    if (authorization === undefined) {
      return { status: OpportunityApiKeyStatus.Missing }
    }

    const key = this._bearerPattern.exec(authorization)?.[1]
    if (key === undefined) {
      return { status: OpportunityApiKeyStatus.Invalid }
    }

    // Every key is compared without short-circuit, so the response time does not reveal which one matched
    let partner: string | undefined
    for (const partnerKey of partnerKeys) {
      const matches = this._safeEqual(key, partnerKey.key)
      partner = matches ? partnerKey.partner : partner
    }

    return partner === undefined ? { status: OpportunityApiKeyStatus.Invalid } : { status: OpportunityApiKeyStatus.Valid, partner }
  }

  // Hashing first gives buffers of equal length, as timingSafeEqual requires, without leaking the key length
  private static _safeEqual(key: string, validKey: string): boolean {
    return timingSafeEqual(this._hash(key), this._hash(validKey))
  }

  private static _hash(value: string): Buffer {
    return createHash('sha256').update(value).digest()
  }
}
