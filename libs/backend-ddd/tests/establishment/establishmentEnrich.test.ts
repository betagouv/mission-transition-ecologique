import { Maybe, Result } from 'true-myth'
import { NafRepository } from '../../src/establishment/domain/spi'
import EstablishmentFeatures from '../../src/establishment/domain/establishmentFeatures'
import { expectToBeOk } from '../testing'
import { dummyEstablishmentRepository, nothingNafRepository, nothingRegionMapping } from './testing'
import { CityToRegionMapping } from '../../src/establishment/infrastructure/json/cityToRegionMapping'

const DUMMY_SIRET = '00000000000000'

describe(`
GIVEN  a siret
WHEN   fetching establishment data with 'getBySiret'
EXPECT the result to have Naf label information derived from the provided NafRepository information
`, () => {
  const DUMMY_SECTION_CODE = 'J'
  const DUMMY_NAF_LABEL = 'Programmation, conseil et autres activités informatiques'

  const dummyNafRepository: NafRepository = {
    getLabel: () => Maybe.of(DUMMY_NAF_LABEL),
    getSectionCode: () => Maybe.of(DUMMY_SECTION_CODE),
    searchNAF: () => Result.ok([])
  }
  test('Valid naf labels and codes', async () => {
    const testFeatures = new EstablishmentFeatures(dummyEstablishmentRepository, nothingRegionMapping, dummyNafRepository)

    const establishmentResult = await testFeatures.getBySiret(DUMMY_SIRET)

    expectToBeOk(establishmentResult)
    const establishment = establishmentResult.value

    expect(establishment.nafSectionCode === DUMMY_SECTION_CODE)
    expect(establishment.nafLabel === DUMMY_NAF_LABEL)
  })
})

describe(`
GIVEN  a siret
WHEN   fetching establishment data with 'getBySiret'
EXPECT the result to have region data provided by the RegionMapping
`, () => {
  const DUMMY_REGION = 'Pays de la Loire'
  const dummyRegionMapping: CityToRegionMapping = {
    getRegion: () => Maybe.of(DUMMY_REGION)
  }

  test('Valid naf labels and codes', async () => {
    const testFeatures = new EstablishmentFeatures(dummyEstablishmentRepository, dummyRegionMapping, nothingNafRepository)

    const establishmentResult = await testFeatures.getBySiret(DUMMY_SIRET)

    expectToBeOk(establishmentResult)
    const establishment = establishmentResult.value

    expect(establishment.region === DUMMY_REGION)
  })
})
