import { Maybe, Result } from 'true-myth'
import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios'
import AxiosHeaders from '../../../../common/infrastructure/api/axiosHeaders'
import { handleException } from '../../../../common/domain/error/errors'
import Config from '../../../../config'
import { GetLandingResponseData, Landing } from './types'
// import { GetLandingResponseData, Landing, Subject, subjectToIdMapping } from './types'
// import { Objective } from '@tee/common/src/questionnaire/types'
import { Opportunity } from '../../../../opportunity/domain/types'
import { Operators, Program } from '../../../../program/domain/types/types'
import OpportunityHubAbstract from '../opportunityHubAbstract'

const allOperators: Operators[] = [
  'ADEME',
  'ASP',
  "Agence de l'Eau Adour-Garonne",
  "Agence de l'Eau Artois-Picardie",
  "Agence de l'Eau Loire-Bretagne",
  "Agence de l'Eau Rhin-Meuse",
  "Agence de l'Eau Rhône-Méditerranée-Corse",
  "Agence de l'Eau Seine-Normandie",
  "Agence de l'Eau",
  'Bpifrance',
  'Breizh Fab',
  'CCI Auvergne-Rhône-Alpes',
  'CCI Bretagne',
  'CCI Centre-Val de Loire',
  'CCI Grand-Est',
  'CCI Hauts-de-France',
  'CCI Loir-et-Cher',
  'CCI Loiret',
  'CCI Morbihan',
  'CCI Normandie',
  'CCI Occitanie',
  'CCI ou CMA',
  'CCI Île-de-France',
  'CCI',
  'CEE',
  'CETIM',
  'CMA Auvergne-Rhône-Alpes',
  'CMA Bourgogne-Franche-Comté',
  'CMA Bretagne',
  'CMA Centre-Val de Loire',
  'CMA Grand-Est',
  'CMA Hauts-de-France',
  'CMA La Réunion',
  'CMA Loiret',
  'CMA Normandie',
  'CMA Nouvelle-Aquitaine',
  "CMA Provence-Alpes-Côte-D'Azur",
  'CMA Rhône',
  'CMA Île-de-France',
  'CMA',
  'DDFIP',
  'DREAL Bretagne',
  'EcoCO2',
  "France Rénov'",
  'InvestEU',
  'La Poste',
  'Ministère de la Transition Écologique et Solidaire',
  'ORACE en Pays de la Loire',
  'Organisations professionnelles',
  'Région Bretagne',
  'Saur',
  'Suez',
  'UIMM',
  'Véolia Eau'
]

export class PlaceDesEntreprises extends OpportunityHubAbstract {
  protected readonly _baseUrl = 'https://reso-staging.osc-fr1.scalingo.io/api/v1'
  protected _axios: AxiosInstance
  _excludeOperatorsFromList = (exclude: Operators[]): Operators[] => {
    return allOperators.filter((operator) => !exclude.includes(operator))
  }
  protected readonly _operatorNames = this._excludeOperatorsFromList(['Bpifrance'])
  constructor() {
    super()
    const token = Config.PDE_API_TOKEN
    this._axios = axios.create({
      baseURL: this._baseUrl,
      headers: this._makeHeaders(token)
    })
  }

  getLandingId = async (): Promise<Result<number, Error>> => {
    try {
      const rawResponse = await this._axios.request<GetLandingResponseData>({
        method: 'GET',
        url: `/landings`,
        timeout: 3000
      })
      const response = rawResponse.data
      if (Array.isArray(response.data) && response.data.length > 0) {
        const landingPage = response.data[0] as Landing
        return Result.ok(landingPage.id)
      } else {
        return Result.err(Error('PDE landing ID not found'))
      }
    } catch (exception: unknown) {
      return Result.err(handleException(exception))
    }
  }

  private _makeHeaders(token: string): RawAxiosRequestHeaders {
    return {
      ...AxiosHeaders.makeJsonHeader(),
      Authorization: `Bearer ${token}`
    }
  }

  // private _objectiveToSubjectIdMapping: { [key in Objective]: Subject } = {
  //   [Objective.EnvironmentalImpact]: Subject.DemarcheEcologie,
  //   [Objective.EnergyPerformance]: Subject.Energie,
  //   [Objective.WaterConsumption]: Subject.Eau,
  //   [Objective.BuildingRenovation]: Subject.Energie,
  //   [Objective.SustainableMobility]: Subject.TransportMobilite,
  //   [Objective.WasteManagement]: Subject.Dechets,
  //   [Objective.EcoDesign]: Subject.DemarcheEcologie,
  //   [Objective.TrainOrRecruit]: Subject.BilanRSE,
  //   [Objective.MakeSavings]: Subject.DemarcheEcologie,
  //   [Objective.DurablyInvest]: Subject.DemarcheEcologie,
  //   [Objective.UnknownYet]: Subject.DemarcheEcologie
  // }

  // subjectMapping(programObjectives: Objective[]): number {
  //   const defaultSubject = Subject.DemarcheEcologie
  //   if (programObjectives.length === 1) {
  //     const objective = programObjectives[0] as Objective
  //     const subjectKey = this._objectiveToSubjectIdMapping[objective]
  //     return subjectToIdMapping[subjectKey]
  //   } else {
  //     return subjectToIdMapping[defaultSubject]
  //   }
  // }

  public createOpportunity = async (opportunity: Opportunity, program: Program): Promise<Maybe<Error>> => {
    try {
      const rawResponse = await this._axios.request<GetLandingResponseData>({
        method: 'POST',
        url: `/solicitations`,
        timeout: 3000
      })
      console.log(rawResponse, opportunity, program)
      const status = rawResponse.status
      if (status != 200) {
        return Maybe.of(Error('PDE Api Error ' + status))
      } else {
        return Maybe.nothing()
      }
    } catch (exception: unknown) {
      return Maybe.of(handleException(exception))
    }
  }
}
