import { workforce } from '@/questionnaire/trackStructureWorkforce'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { StructureSize, TrackId } from '@/types'

export default class TrackStructure {
  static getSiret(): string {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'siret') as string
  }

  static getSector(): string {
    return (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'secteur') ??
      useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Sectors, 'sector')) as string
  }

  static getSize(): StructureSize {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureWorkforce, 'structure_size') as StructureSize
  }

  static getSizeTitle(): string {
    return workforce.options?.find((option) => option.value === this.getSize())?.title?.fr || ''
  }

  static getLocalisation(): string {
    const postalCode = this.getPostalCode()
    return postalCode ? `${postalCode} ${this.getCity()}` : this.getRegion()
  }

  static getPostalCode(): string {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'codePostal') as string
  }

  static getCity(): string {
    return useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'ville') as string
  }

  static getRegion(): string {
    const region = useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.Siret, 'region') as string
    return region ?? (useUsedTrackStore().findInQuestionnaireDataByTrackIdAndKey(TrackId.StructureRegion, 'region') as string)
  }
}
