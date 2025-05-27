import { Operators } from '@tee/data'
import { Objective } from '@tee/common'
import { Result } from 'true-myth'
import { AxiosInstance } from 'axios'
import { Subject, subjectToIdMapping } from '../../../../../src/opportunityHub/infrastructure/api/placedesentreprises/types'
import OpportunityHubAbstract from '../../../../../src/opportunityHub/infrastructure/api/opportunityHubAbstract'

export class PlaceDesEntreprisesTest extends OpportunityHubAbstract {
  protected readonly _baseUrl = ''
  protected _axios: AxiosInstance
  protected readonly _operatorNames = [] // warning, invalid but never used since we override all possible external uses of this value right below
  constructor() {
    super()
    this._axios = {
      request: async () => {
        return {
          status: 200,
          data: {}
        }
      }
    } as unknown as AxiosInstance
  }

  override get operatorNames(): Operators[] | Error {
    return new Error('Operator List non valid for Place des entreprises')
  }

  override support = () => {
    return true
  }

  override shouldTransmit = async () => {
    return true
  }

  public transmitOpportunity = async (): Promise<Result<number, Error>> => {
    return Result.ok(-1)
  }

  async reachedDailyContactTransmissionLimit(): Promise<boolean> {
    return false
  }

  private _objectiveToPdeSubjectMapping: { [key in Objective]: Subject } = {
    [Objective.EnvironmentalImpact]: Subject.DemarcheEcologie,
    [Objective.EnergyPerformance]: Subject.Energie,
    [Objective.WaterConsumption]: Subject.Eau,
    [Objective.BuildingRenovation]: Subject.Energie,
    [Objective.SustainableMobility]: Subject.TransportMobilite,
    [Objective.WasteManagement]: Subject.Dechets,
    [Objective.EcoDesign]: Subject.DemarcheEcologie,
    [Objective.TrainOrRecruit]: Subject.BilanRSE,
    [Objective.MakeSavings]: Subject.DemarcheEcologie,
    [Objective.DurablyInvest]: Subject.DemarcheEcologie,
    [Objective.Biodiversity]: Subject.DemarcheEcologie,
    [Objective.UnknownYet]: Subject.DemarcheEcologie
  }

  subjectMapping(programObjectives: Objective[]): number {
    const defaultSubject = Subject.DemarcheEcologie
    if (programObjectives.length === 1) {
      const objective = programObjectives[0]
      const subjectKey = this._objectiveToPdeSubjectMapping[objective]
      return subjectToIdMapping[subjectKey]
    } else {
      return subjectToIdMapping[defaultSubject]
    }
  }
}
