import { Maybe } from 'true-myth'
import { NafMapping } from '../../src/establishment/domain/spi'
import EstablishmentFeatures from '../../src/establishment/domain/establishmentFeatures'
import { expectToBeOk } from '../testing'
import { dummyEstablishmentRepository, nothingRegionMapping } from './testing'

const DUMMY_SIRET = '00000000000000'

const DUMMY_SECTION_CODE = 'J'
const DUMMY_SECTION_LABEL = 'Information et communication'

const DUMMY_NAF_LABEL = 'Programmation, conseil et autres activités informatiques'

const dummyNafMapping: NafMapping = {
  getLabel: (_nafCode: string) => Maybe.of(DUMMY_NAF_LABEL),
  getSectionLabel: (_nafCode: string) => Maybe.of(DUMMY_SECTION_LABEL),
  getSectionCode: (_nafCode: string) => Maybe.of(DUMMY_SECTION_CODE)
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
