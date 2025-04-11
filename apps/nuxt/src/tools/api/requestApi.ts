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

    // const { data: cachedData } = useNuxtData<T>(url)
    // if (cachedData.value) {
    //   return new ResultApi<T>(cachedData, null)
    // }

    const { data, error } = (await useAsyncData<T | null>(url, async () => {
      const response = await $fetch.raw(url)
      // if (response.status === 202) {
      //   const route = useRoute()
      //   const body = (await response._data) as any
      //   const newProgramId = body['newProgramId']
      //   // if (route.params.programId) {
      //   //   // const router = useRouter()
      //   //   // if (route.params.programId && newProgramId) {
      //   //   //   const newRoute = {
      //   //   //     name: route.name,
      //   //   //     params: {
      //   //   //       ...route.params,
      //   //   //       programId: newProgramId
      //   //   //     },
      //   //   //     query: route.query,
      //   //   //     hash: route.hash
      //   //   //   }
      //   //   //   router.replace(newRoute)
      //   //   // }
      //   //   const newPath = route.fullPath.replace(route.params.programId as string, newProgramId)
      //   //   console.log(newPath)

      //   //   setTimeout(() => {
      //   //     navigateTo(newPath)
      //   //   }, 0)
      //   //   return null

      //   //   // return await navigateTo(newPath)
      //   // }
      // }

      return response._data as T
    })) as _AsyncData<T | null, NuxtError<unknown> | null>

    return new ResultApi<T>(data, error)
  }
}
