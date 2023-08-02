import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  TsoaResponse,
  Res,
  Example,
  Produces
} from 'tsoa'
import { createFeatures } from '../domain/features'
import { EtablissementRepository } from '../domain/spi'
import { EstablishmentNotFoundError, Etablissement } from '../domain/types'
import { requestSireneAPI } from '../infrastructure/sirene-API'

/**
 * Defines how to access external services.
 * Uses the "Repository" pattern, see README.md
 */
const etablissementRepository: EtablissementRepository = {
  getEtablissementBySiret: async (siret: string) =>
    requestSireneAPI(siret, process.env['SIRENE_API_TOKEN'] || '')
}

interface ErrorJSON {
  message: string
}

interface EstablishmentNotFoundErrorJSON {
  message: 'Establishment not found'
}

interface ValidateErrorJSON {
  message: 'Validation failed'
  details: { [name: string]: unknown }
}

@Route('health')
@Produces('text/plain')
export class HealthController extends Controller {
  /**
   * Check the API's health. If the API is up and running, this endpoint
   * should return a 200 HTTP status.
   *
   * @summary Check the API's health
   */
  @Example<string>('OK')
  @Get()
  public async health(): Promise<string> {
    this.setStatus(200)
    this.setHeader('Content-Type', 'text/plain')
    return 'OK'
  }
}

interface SiretBody {
  /**
   * @pattern ^\d{14}$ SIRET should be made of 14 digits
   */
  siret: string
}

const exampleEtablissement = {
  siren: '830141321',
  nic: '00034',
  siret: '83014132100034',
  statutDiffusionEtablissement: 'O',
  dateCreationEtablissement: '2021-12-01',
  trancheEffectifsEtablissement: null,
  anneeEffectifsEtablissement: null,
  activitePrincipaleRegistreMetiersEtablissement: null,
  dateDernierTraitementEtablissement: '2022-05-07T13:11:04',
  etablissementSiege: true,
  nombrePeriodesEtablissement: 1,
  uniteLegale: {
    etatAdministratifUniteLegale: 'A',
    statutDiffusionUniteLegale: 'O',
    dateCreationUniteLegale: '2017-06-01',
    categorieJuridiqueUniteLegale: '5710',
    denominationUniteLegale: 'MULTI',
    sigleUniteLegale: null,
    denominationUsuelle1UniteLegale: null,
    denominationUsuelle2UniteLegale: null,
    denominationUsuelle3UniteLegale: null,
    sexeUniteLegale: null,
    nomUniteLegale: null,
    nomUsageUniteLegale: null,
    prenom1UniteLegale: null,
    prenom2UniteLegale: null,
    prenom3UniteLegale: null,
    prenom4UniteLegale: null,
    prenomUsuelUniteLegale: null,
    pseudonymeUniteLegale: null,
    activitePrincipaleUniteLegale: '62.01Z',
    nomenclatureActivitePrincipaleUniteLegale: 'NAFRev2',
    identifiantAssociationUniteLegale: null,
    economieSocialeSolidaireUniteLegale: 'N',
    societeMissionUniteLegale: 'N',
    caractereEmployeurUniteLegale: 'N',
    trancheEffectifsUniteLegale: '02',
    anneeEffectifsUniteLegale: '2020',
    nicSiegeUniteLegale: '00034',
    dateDernierTraitementUniteLegale: '2022-08-29T10:18:51',
    categorieEntreprise: 'PME',
    anneeCategorieEntreprise: '2020'
  },
  adresseEtablissement: {
    complementAdresseEtablissement: null,
    numeroVoieEtablissement: '116',
    indiceRepetitionEtablissement: null,
    typeVoieEtablissement: 'RUE',
    libelleVoieEtablissement: 'DALAYRAC',
    codePostalEtablissement: '94120',
    libelleCommuneEtablissement: 'FONTENAY-SOUS-BOIS',
    libelleCommuneEtrangerEtablissement: null,
    distributionSpecialeEtablissement: null,
    codeCommuneEtablissement: '94033',
    codeCedexEtablissement: null,
    libelleCedexEtablissement: null,
    codePaysEtrangerEtablissement: null,
    libellePaysEtrangerEtablissement: null
  },
  adresse2Etablissement: {
    complementAdresse2Etablissement: null,
    numeroVoie2Etablissement: null,
    indiceRepetition2Etablissement: null,
    typeVoie2Etablissement: null,
    libelleVoie2Etablissement: null,
    codePostal2Etablissement: null,
    libelleCommune2Etablissement: null,
    libelleCommuneEtranger2Etablissement: null,
    distributionSpeciale2Etablissement: null,
    codeCommune2Etablissement: null,
    codeCedex2Etablissement: null,
    libelleCedex2Etablissement: null,
    codePaysEtranger2Etablissement: null,
    libellePaysEtranger2Etablissement: null
  },
  periodesEtablissement: [
    {
      dateFin: null,
      dateDebut: '2021-12-01',
      etatAdministratifEtablissement: 'A',
      changementEtatAdministratifEtablissement: false,
      enseigne1Etablissement: null,
      enseigne2Etablissement: null,
      enseigne3Etablissement: null,
      changementEnseigneEtablissement: false,
      denominationUsuelleEtablissement: null,
      changementDenominationUsuelleEtablissement: false,
      activitePrincipaleEtablissement: '62.01Z',
      nomenclatureActivitePrincipaleEtablissement: 'NAFRev2',
      changementActivitePrincipaleEtablissement: false,
      caractereEmployeurEtablissement: 'N',
      changementCaractereEmployeurEtablissement: false
    }
  ]
}

@SuccessResponse('200', 'OK')
@Route('insee')
export class SireneController extends Controller {
  /**
   * Retrieves information of an Establishment ("Établissement").
   * Supply the SIRET and receive the corresponding establishment details.
   *
   * @summary Retrieves information of an "Établissement"
   *
   * @example requestBody: {"siret": "83014132100034"}
   */

  @Example<Etablissement>(exampleEtablissement)
  @Post('get_by_siret')
  public async health(
    @Body() requestBody: SiretBody,
    @Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>,
    @Res() _validationFailedResponse: TsoaResponse<422, ValidateErrorJSON>,
    @Res() notFoundResponse: TsoaResponse<404, EstablishmentNotFoundErrorJSON>
  ): Promise<Etablissement> {
    const requestedSiret = requestBody.siret

    const feat = createFeatures(etablissementRepository)
    const etablissementResult = await feat.fetchEtablissement(requestedSiret)

    if (etablissementResult.isErr) {
      const err = etablissementResult.error

      if (err instanceof EstablishmentNotFoundError) {
        return notFoundResponse(404, { message: 'Establishment not found' })
      }

      return requestFailedResponse(500, { message: `Server internal error` })
    }

    const etablissement = etablissementResult.value
    return etablissement
  }
}
