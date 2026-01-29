import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const BASE_URL = 'https://prod-r2da-api.ademe-dri.fr/api'

interface AdemeVersion {
  '@id': string
  '@type': string
  id: string
  statut: string
  dateFin: string
  [key: string]: unknown
}

interface AdemeVersionsResponse {
  member: AdemeVersion[]
  [key: string]: unknown
}

export class TempAdemeApi {
  private readonly _bearerToken: string

  constructor() {
    this._bearerToken = process.env['ADEME_BEARER_TOKEN'] || ''
  }

  private get _axios(): AxiosInstance {
    return axios.create({
      headers: {
        Accept: 'application/ld+json',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'fr,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${this._bearerToken}`,
        Origin: 'https://prod-r2da.ademe-dri.fr',
        Pragma: 'no-cache',
        Referer: 'https://prod-r2da.ademe-dri.fr/',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      }
    })
  }

  private async _sleep(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }

  private async _getProgramList(): Promise<AdemeVersion[]> {
    try {
      const response = await this._axios.get<AdemeVersionsResponse>(`${BASE_URL}/versions?itemsPerPage=1000`) // 649 programs en 10ans. OK pour une solution temporaire.
      return response.data.member || []
    } catch (error) {
      console.error('Error fetching versions from ADEME API:', error)
      return []
    }
  }

  private async _getProgramDetails(programId: string): Promise<unknown | null> {
    try {
      const response = await this._axios.get<unknown>(`${BASE_URL}/versions/${programId}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching program ${programId} from ADEME API:`, error)
      return null
    }
  }

  async getPrograms(): Promise<unknown[]> {
    const allVersions = await this._getProgramList()
    console.log(`Retrieved ${allVersions.length} programs (before filtering)`)

    const now = new Date()
    const publicAndActivePrograms = allVersions.filter((version) => {
      const isPublic = version.statut === 'public'
      const dateFin = new Date(version.dateFin)
      const isActive = dateFin > now
      return isPublic && isActive
    })

    console.log(`Found ${publicAndActivePrograms.length} public and active programs out of ${allVersions.length} total`)

    const programDetails: unknown[] = []
    for (const [index, version] of publicAndActivePrograms.entries()) {
      console.log(`Fetching program ${index + 1}/${publicAndActivePrograms.length}: ${version.id}`)
      const details = await this._getProgramDetails(version.id)
      if (details) {
        const cibleProjet = (details as Record<string, unknown>)['cibleProjet'] as Array<{ code: string }> | undefined
        const isForCompanies = cibleProjet?.some((cible) => cible.code === 'SCA3')

        if (isForCompanies) {
          programDetails.push(details)
        }
      }
      if (index < publicAndActivePrograms.length - 1) {
        await this._sleep(1)
      }
    }
    console.log(`Retrieved ${programDetails.length} programs (valid and for companies)`)

    return programDetails
  }
}
