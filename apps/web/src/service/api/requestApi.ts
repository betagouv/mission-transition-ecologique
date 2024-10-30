import { Result } from 'true-myth'

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

  public async getJson<T>(baseUrl: string | undefined = undefined): Promise<Result<T, Error>> {
    baseUrl = baseUrl ?? this.url
    const url: string = this.query ? `${baseUrl}?${this.query}` : baseUrl
    try {
      const response = await fetch(url)
      return Result.ok((await response.json()) as T)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
