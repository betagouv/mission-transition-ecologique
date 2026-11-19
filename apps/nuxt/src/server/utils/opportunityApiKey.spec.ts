// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { OpportunityApiKey, OpportunityApiKeyStatus } from './opportunityApiKey'

describe('OpportunityApiKey', () => {
  describe('validKeys', () => {
    it.each([[undefined], [''], [' , ']])('returns no key for %j', (rawKeys) => {
      expect(OpportunityApiKey.validKeys(rawKeys)).toEqual([])
    })

    it('splits and trims the comma separated keys', () => {
      expect(OpportunityApiKey.validKeys(' key-preprod , key-prod,')).toEqual(['key-preprod', 'key-prod'])
    })
  })

  describe('status', () => {
    const validKeys = ['key-preprod', 'key-prod']

    it('is missing without Authorization header', () => {
      expect(OpportunityApiKey.status(undefined, validKeys)).toBe(OpportunityApiKeyStatus.Missing)
    })

    it.each([['Bearer key-preprod'], ['Bearer key-prod'], ['bearer key-prod'], ['Bearer   key-prod  ']])('accepts %j', (authorization) => {
      expect(OpportunityApiKey.status(authorization, validKeys)).toBe(OpportunityApiKeyStatus.Valid)
    })

    it.each([
      [''],
      ['Bearer'],
      ['Bearer '],
      ['key-prod'],
      ['Basic key-prod'],
      ['Bearer key-pro'],
      ['Bearer key-prod2'],
      ['Bearer key prod']
    ])('rejects %j', (authorization) => {
      expect(OpportunityApiKey.status(authorization, validKeys)).toBe(OpportunityApiKeyStatus.Invalid)
    })

    it('rejects any key when no key is configured', () => {
      expect(OpportunityApiKey.status('Bearer key-prod', [])).toBe(OpportunityApiKeyStatus.Invalid)
    })
  })
})
