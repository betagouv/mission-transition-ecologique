export default class ContactApi {
  async fetch(url: string, method: string, headers: HeadersInit, body: BodyInit, action: string) {
    const response = await fetch(url, {
      method: method,
      headers: headers,
      body: body
    })
  }
}
