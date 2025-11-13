import { ResultApi } from '@/tools/api/resultApi'
import { NuxtError } from 'nuxt/app'
import { _AsyncData } from 'nuxt/dist/app/composables/asyncData'

export default abstract class RequestApi {
  protected abstract url: string
  protected query = ''

  public static buildUrl(url: string, dataPath?: Record<string, string>): string {
    if (!dataPath) {
      return url
    }

    for (const datumPathKey in dataPath) {
      url = this.buildPath(url, datumPathKey, dataPath[datumPathKey])
    }

    return url
  }

  protected static buildPath(url: string, placeholderName: string, placeholderData: string): string {
    return url.replace('{' + placeholderName + '}', placeholderData)
  }

  public async getJson<T>(baseUrl: string | undefined = undefined): Promise<ResultApi<T>> {
    baseUrl = baseUrl ?? this.url
    const url: string = this.query ? `${baseUrl}?${this.query}` : baseUrl

    const { data, error } = (await useAsyncData<T>(
      url,
      async () => {
        return await $fetch(url)
      },
      {
        getCachedData(url, nuxtApp) {
          return nuxtApp.payload.data[url] || nuxtApp.static.data[url]
        }
      }
    )) as _AsyncData<T | null, NuxtError<unknown> | null>

    return new ResultApi<T>(data, error)
  }
}
