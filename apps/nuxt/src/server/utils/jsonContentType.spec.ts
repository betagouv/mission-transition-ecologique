// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { JsonContentType } from './jsonContentType'

describe('JsonContentType', () => {
  it.each([['application/json'], ['application/json; charset=utf-8'], ['Application/JSON'], [' application/json ;charset=UTF-8']])(
    'accepts %s',
    (contentType) => {
      expect(JsonContentType.isJson(contentType)).toBe(true)
    }
  )

  it.each([
    [undefined],
    [''],
    ['text/plain'],
    ['text/plain; charset=utf-8'],
    ['application/x-www-form-urlencoded'],
    ['multipart/form-data; boundary=x'],
    ['application/jsonp'],
    ['text/plain; application/json']
  ])('rejects %s', (contentType) => {
    expect(JsonContentType.isJson(contentType)).toBe(false)
  })
})
