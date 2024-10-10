import { workforce } from '@/questionnaire/trackStructureWorkforce'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { LegalCategory, StructureSize, TrackId } from '@/types'
import Format from '@/tools/format'
import { sectors } from '@/questionnaire/trackStructureSectors'

export default class TrackStructure {
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
        text: Format.capitalize(Format.truncate(TrackStructure.getSectorShortLabel(), 30))
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
    return this.has(TrackId.Siret, 'secteur')
      ? (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'secteur') as string)
      : (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Sectors, 'sector') as string)
  }

  static getSectorShortLabel(): string {
    return sectors.options?.find((option) => option.value === this.getSector())?.shortLabel?.fr || this.getSector()
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
    return this.has(TrackId.Siret, 'codePostal') ? `${this.getPostalCode()} ${this.getCity()}` : this.getRegion()
  }

  static getPostalCode(): string {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'codePostal') as string
  }

  static getCity(): string {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'ville') as string
  }

  static getRegion(): string {
    return this.has(TrackId.Siret, 'region')
      ? (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'region') as string)
      : (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureRegion, 'region') as string)
  }
}
