import { Maybe, Result } from 'true-myth'
import { EstablishmentRepository, NafRepository } from '../../src/establishment/domain/spi'
import EstablishmentFeatures from '../../src/establishment/domain/establishmentFeatures'
import { expectToBeOk } from '../testing'
import {
  dummyEstablishmentRepository,
  falseAdministrationClassifier,
  nothingNafRepository,
  nothingRegionMapping,
  trueAdministrationClassifier
} from './testing'
import { CityToRegionMapping } from '../../src/establishment/infrastructure/json/cityToRegionMapping'
import { EstablishmentDetails } from '../../src/establishment/domain/types'

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
    const testFeatures = new EstablishmentFeatures(
      dummyEstablishmentRepository,
      nothingRegionMapping,
      dummyNafRepository,
      falseAdministrationClassifier
    )

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
    const testFeatures = new EstablishmentFeatures(
      dummyEstablishmentRepository,
      dummyRegionMapping,
      nothingNafRepository,
      falseAdministrationClassifier
    )

    const establishmentResult = await testFeatures.getBySiret(DUMMY_SIRET)

    expectToBeOk(establishmentResult)
    const establishment = establishmentResult.value

    expect(establishment.region === DUMMY_REGION)
  })
})

describe(`
GIVEN  an establishment without an administration status (e.g. from the Sirene/SIRET path)
WHEN   fetching establishment data with 'getBySiret'
EXPECT the administration status to be computed by the AdministrationClassifier
`, () => {
  test('computes isAdministration when the value is missing', async () => {
    const testFeatures = new EstablishmentFeatures(
      dummyEstablishmentRepository,
      nothingRegionMapping,
      nothingNafRepository,
      trueAdministrationClassifier
    )

    const establishmentResult = await testFeatures.getBySiret(DUMMY_SIRET)

    expectToBeOk(establishmentResult)
    expect(establishmentResult.value.isAdministration).toBe(true)
  })
})

describe(`
GIVEN  an establishment that already has an administration status (e.g. from the recherche-entreprise API)
WHEN   fetching establishment data with 'getBySiret'
EXPECT the existing administration status to be preserved (the classifier is not used)
`, () => {
  test('keeps the value already provided and ignores the classifier', async () => {
    const establishmentWithAdministration: EstablishmentDetails = {
      siren: '830141321',
      nic: '00034',
      siret: '83014132100034',
      creationDate: '2021-12-01',
      denomination: 'MULTI',
      nafCode: '62.01Z',
      legalCategory: '5710',
      address: {
        streetNumber: '116',
        streetType: 'RUE',
        streetLabel: 'DALAYRAC',
        zipCode: '94120',
        cityLabel: 'FONTENAY-SOUS-BOIS',
        cityCode: '94033'
      },
      workforceRange: '03',
      isAdministration: false
    }
    const repository: EstablishmentRepository = {
      get: () => Promise.resolve(Result.ok(establishmentWithAdministration)),
      search: () => Promise.resolve(Result.ok({ resultCount: 1, establishments: [establishmentWithAdministration] }))
    }

    const testFeatures = new EstablishmentFeatures(repository, nothingRegionMapping, nothingNafRepository, trueAdministrationClassifier)

    const establishmentResult = await testFeatures.getBySiret(DUMMY_SIRET)

    expectToBeOk(establishmentResult)
    expect(establishmentResult.value.isAdministration).toBe(false)
  })
})
