import { Maybe, Result, ResultNS } from 'true-myth'
import { EstablishmentRepository, NafMapping } from '../../src/establishment/domain/spi'
import { COG2023Mapping } from '../../src/establishment/infrastructure/json/cityToRegionMapping'
import EstablishmentFeatures from '../../src/establishment/domain/establishmentFeatures'
import { exampleEstablishment } from '../../src/establishment/controller/establishmentController'

// As we do not use ES6 modules, I could not find more elegant way to import Ok
type Ok<T, E> = ResultNS.Ok<T, E>

// check that `Result` is `Ok`, i.e. does not return an error
function expectToBeOk<T, E>(v: Result<T, E>): asserts v is Ok<T, E> {
  expect(v.isOk).toBe(true)
}

const DUMMY_SIRET = '00000000000000'

const DUMMY_SECTION_CODE = 'J'
const DUMMY_SECTION_LABEL = 'Information et communication'

const DUMMY_NAF_LABEL = 'Programmation, conseil et autres activités informatiques'

const dummyNafMapping: NafMapping = {
  getLabel: (_nafCode: string) => Maybe.of(DUMMY_NAF_LABEL),
  getSectionLabel: (_nafCode: string) => Maybe.of(DUMMY_SECTION_LABEL),
  getSectionCode: (_nafCode: string) => Maybe.of(DUMMY_SECTION_CODE)
}

const nothingRegionMapping: COG2023Mapping = {
  getRegion: (_cityCode: string) => Maybe.nothing<string>()
}

const dummyEstablishmentRepository: EstablishmentRepository = {
  get: (_siret: string) => Promise.resolve(Result.ok(exampleEstablishment))
}

describe(`
GIVEN  a siret
WHEN   fetching establishment data with 'getBySiret'
EXPECT the result to have Naf label information derived from the provided NafMapping information
`, () => {
  test('Valid naf labels and codes', async () => {
    const testFeatures = new EstablishmentFeatures(dummyEstablishmentRepository, nothingRegionMapping, dummyNafMapping)

    const establishmentResult = await testFeatures.getBySiret(DUMMY_SIRET)

    expectToBeOk(establishmentResult)
    const establishment = establishmentResult.value

    expect(establishment.nafSectionCode === DUMMY_SECTION_CODE)
    expect(establishment.nafSectionLabel === DUMMY_SECTION_LABEL)
    expect(establishment.nafLabel === DUMMY_NAF_LABEL)
  })
})
