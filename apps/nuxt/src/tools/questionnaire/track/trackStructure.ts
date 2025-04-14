import { workforce } from '@/tools/questionnaire/trackStructureWorkforce'
import { useUsedTrackStore } from '@/stores/usedTrack'
import {
  CompanyActivityType,
  LegalCategory,
  StructureSize,
  TrackId,
  CompanyLocalisationType,
  TrackOptionItem,
  TrackOptionsUnion
} from '@/types'
import Format from '@/tools/format'
import { CompanyData } from '@/tools/companyData'

export default class TrackStructure {
  static createData(
    option: TrackOptionsUnion,
    value?: string,
    questionnaireData?: CompanyLocalisationType | CompanyActivityType
  ): TrackOptionItem {
    return {
      option: {
        ...option,
        value: value,
        questionnaireData: questionnaireData || option.questionnaireData
      } as TrackOptionsUnion
    }
  }

  static getEligibilityCriteria() {
    const criteria = []
    if (this.getSizeTitle() !== '') {
      criteria.push({
        icon: 'fr-icon-check-line',
        text: Format.truncate(this.getSizeTitle(), 30)
      })
    }
    if (this.getSector()) {
      criteria.push({
        icon: 'fr-icon-check-line',
        text: Format.capitalize(Format.truncate(TrackStructure.getSector(), 30))
      })
    }
    if (this.getLocalisation()) {
      criteria.push({
        icon: 'fr-icon-check-line',
        text: Format.truncate(TrackStructure.getLocalisation(), 30)
      })
    }
    if (this.hasSiret()) {
      criteria.unshift({
        icon: 'fr-icon-check-line',
        text: Format.truncate('SIRET ' + TrackStructure.getSiret(), 30)
      })
    }

    return criteria
  }

  static has(trackId: TrackId, key: string): boolean {
    return (
      useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(trackId, key) !== '' &&
      useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(trackId, key) !== undefined
    )
  }

  static hasSiret(): boolean {
    return this.has(TrackId.Siret, 'siret')
  }

  static getSiret(): string {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'siret') as string
  }

  static getSector(): string {
    return CompanyData.company?.secteur || ''
  }

  static getSize(): StructureSize {
    const structureSize = useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureWorkforce, 'structure_size')
    if (
      structureSize === undefined &&
      useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'legalCategory') === LegalCategory.EI
    ) {
      return StructureSize.EI
    }

    return structureSize as StructureSize
  }

  static getSizeTitle(): string {
    return workforce.options?.find((option) => option.value === this.getSize())?.title?.fr || ''
  }

  static getLocalisation(): string {
    return `${this.getPostalCode()} ${this.getCity()}`
  }

  static getPostalCode(): string {
    return this.has(TrackId.Siret, 'region')
      ? (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'codePostal') as string)
      : (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureCity, 'codePostal') as string)
  }

  static getCity(): string {
    return this.has(TrackId.Siret, 'region')
      ? (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'ville') as string)
      : (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureCity, 'ville') as string)
  }

  static getTheme() {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Goals, 'priority_objective')
  }

  static getRegion(): string {
    return this.has(TrackId.Siret, 'region')
      ? (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'region') as string)
      : (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureCity, 'region') as string)
  }
}
