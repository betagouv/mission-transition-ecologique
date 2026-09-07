import { CompanyActivityType, Track, TrackOptionsUnion } from '@/types'

export default class TrackActivity {
  static async getOptionByCodeNAF(track: Track, codeNAF: string): Promise<TrackOptionsUnion | undefined> {
    const option = track.options?.find(() => true)
    if (option === undefined) {
      return undefined
    }

    const activity = await this._findActivity(codeNAF)
    if (activity === undefined) {
      return undefined
    }

    return {
      ...option,
      value: codeNAF,
      questionnaireData: activity
    } as TrackOptionsUnion
  }

  private static async _findActivity(codeNAF: string): Promise<CompanyActivityType | undefined> {
    // Note: do not use EstablishmentApi, its useFetch based call cannot run from a route middleware
    try {
      const activities = await $fetch<CompanyActivityType[]>('/api/establishments/searchNAF')

      return activities.find((activity) => activity.codeNAF === codeNAF)
    } catch {
      return undefined
    }
  }
}
