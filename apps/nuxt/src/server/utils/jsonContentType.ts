export class JsonContentType {
  static readonly mediaType = 'application/json'

  // A JSON content type forces browsers to send a CORS preflight for cross-origin calls,
  // which our API does not allow: "simple" requests (text/plain, form) would be sent without it
  static isJson(contentType: string | undefined): boolean {
    if (!contentType) {
      return false
    }

    const [mediaType = ''] = contentType.split(';')

    return mediaType.trim().toLowerCase() === this.mediaType
  }
}
