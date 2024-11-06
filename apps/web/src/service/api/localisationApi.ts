import RequestApi from '@/service/api/requestApi'

export default class LocalisationApi extends RequestApi {
  protected readonly url = 'https://geo.api.gouv.fr/communes'
  private readonly _headers = {
    accept: 'application/json',
    'content-type': 'application/json'
  }

  /**
   * Fetches communes based on a search query, which can be either a name or a postal code.
   * @param searchTerm - The search term, either a name or a postal code.
   * @returns A list of communes matching the search criteria.
   */
  async fetchCommunes(searchTerm: string | undefined) {
    let resp: any[] = [] // Adjust the type to match the API's response structure
    if (!searchTerm) {
      return []
    }
    try {
      const urlWithParams = new URL(this.url)

      // Automatically detect if the search term is a postal code (5 digits) or a name
      if (/^\d{5}$/.test(searchTerm)) {
        urlWithParams.searchParams.set('codePostal', searchTerm)
      } else {
        urlWithParams.searchParams.set('nom', searchTerm)
      }

      const response = await fetch(urlWithParams.toString(), {
        method: 'GET',
        headers: this._headers
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch communes: ${response.statusText}`)
      }

      resp = await response.json()
    } catch (error: unknown) {
      console.error('Error fetching communes:', error)
      resp = []
    }

    return resp
  }
}
