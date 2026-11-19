// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { OpportunityApiKey, OpportunityApiKeyStatus } from './opportunityApiKey'

describe('OpportunityApiKey', () => {
  describe('partnerKeys', () => {
    it.each([[undefined], [''], [' , ']])('returns no key for %j', (rawKeys) => {
      expect(OpportunityApiKey.partnerKeys(rawKeys)).toEqual([])
    })

    it('reads the keys named by partner, trimmed', () => {
      expect(OpportunityApiKey.partnerKeys(' agir : key-agir , other-partner:key-other,')).toEqual([
        { partner: 'agir', key: 'key-agir' },
        { partner: 'other-partner', key: 'key-other' }
      ])
    })

    it('splits on the first colon only', () => {
      expect(OpportunityApiKey.partnerKeys('agir:key:with:colons')).toEqual([{ partner: 'agir', key: 'key:with:colons' }])
    })

    it('keeps several keys under the same partner name for a rotation', () => {
      expect(OpportunityApiKey.partnerKeys('agir:old-key,agir:new-key')).toEqual([
        { partner: 'agir', key: 'old-key' },
        { partner: 'agir', key: 'new-key' }
      ])
    })

    it('ignores the entries without a name, with an empty name or with an empty key', () => {
      expect(OpportunityApiKey.partnerKeys('anonymous-key,:key-without-name,agir:, agir : ,valid:key')).toEqual([
        { partner: 'valid', key: 'key' }
      ])
    })
  })

  describe('check', () => {
    const partnerKeys = [
      { partner: 'agir', key: 'key-agir' },
      { partner: 'other', key: 'key-other' }
    ]

    it('is missing without Authorization header', () => {
      expect(OpportunityApiKey.check(undefined, partnerKeys)).toEqual({ status: OpportunityApiKeyStatus.Missing })
    })

    it.each([
      ['Bearer key-agir', 'agir'],
      ['Bearer key-other', 'other'],
      ['bearer key-other', 'other'],
      ['Bearer   key-agir  ', 'agir']
    ])('accepts %j and returns the partner %s', (authorization, partner) => {
      expect(OpportunityApiKey.check(authorization, partnerKeys)).toEqual({ status: OpportunityApiKeyStatus.Valid, partner })
    })

    it.each([
      [''],
      ['Bearer'],
      ['Bearer '],
      ['key-agir'],
      ['Basic key-agir'],
      ['Bearer key-agi'],
      ['Bearer key-agir2'],
      ['Bearer key agir'],
      ['Bearer agir:key-agir'],
      ['Bearer agir']
    ])('rejects %j without partner', (authorization) => {
      expect(OpportunityApiKey.check(authorization, partnerKeys)).toEqual({ status: OpportunityApiKeyStatus.Invalid })
    })

    it('rejects any key when no key is configured', () => {
      expect(OpportunityApiKey.check('Bearer key-agir', [])).toEqual({ status: OpportunityApiKeyStatus.Invalid })
    })
  })
})
