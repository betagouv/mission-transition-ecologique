import { Result } from 'true-myth'

export default abstract class RequestApi<T> {
  protected url = ''
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

  public async get(): Promise<Result<T[], Error>> {
    const url: string = this.query ? `${this.url}?${this.query}` : this.url
    try {
      const response = await fetch(url)
      return Result.ok((await response.json()) as T[])
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }
}
