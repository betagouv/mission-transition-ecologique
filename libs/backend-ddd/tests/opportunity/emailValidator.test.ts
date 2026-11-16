import { EmailValidator } from '@tee/common'

describe('EmailValidator', () => {
  test.each([['prenom+tag@domaine.fr'], ['jean.dupont@orange.fr'], [' jean@exemple.fr ']])('accepts %s', (email) => {
    expect(EmailValidator.validate(email)).toBe(true)
  })

  // Same rule as the API schema: the form must not accept an address rejected by the API
  test.each([
    [undefined],
    [''],
    ['jean..dupont@orange.fr'],
    ['.jean@exemple.fr'],
    ['jean@exemple..fr'],
    ['jean@-exemple.fr'],
    ['pas un email']
  ])('rejects %s', (email) => {
    expect(EmailValidator.validate(email)).toBe(false)
  })
})
