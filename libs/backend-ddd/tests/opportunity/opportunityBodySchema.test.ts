import { opportunityBodySchema, ThemeId } from '@tee/common'
import { fakeOpportunity } from './opportunity.fixtures'

const parseWithTheme = (theme: unknown) => {
  return opportunityBodySchema.safeParse({
    opportunity: { ...fakeOpportunity(), theme },
    optIn: true
  })
}

describe('opportunityBodySchema theme validation', () => {
  test.each(Object.values(ThemeId))('keeps the theme id %s', (themeId) => {
    const result = parseWithTheme(themeId)

    expect(result.success).toBe(true)
    expect(result.data?.opportunity.theme).toBe(themeId)
  })

  test.each([['⚡️ énergie'], ['unknown-theme'], [42], [null]])('accepts the opportunity without theme when theme is %s', (theme) => {
    const result = parseWithTheme(theme)

    expect(result.success).toBe(true)
    expect(result.data?.opportunity.theme).toBeUndefined()
  })

  test('accepts an opportunity without theme', () => {
    const result = parseWithTheme(undefined)

    expect(result.success).toBe(true)
    expect(result.data?.opportunity.theme).toBeUndefined()
  })
})
