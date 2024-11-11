export class UrlBuilder {
  static params(url: string, params: Record<string, string>): string {
    for (const key in params) {
      url = url.replace(`:${key}`, params[key])
    }
    return url
  }
}
