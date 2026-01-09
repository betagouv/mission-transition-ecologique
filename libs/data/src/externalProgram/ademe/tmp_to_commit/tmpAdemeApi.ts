import axios, { AxiosInstance } from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const TEMP_FILE_PATH = 'tempProgramData.json'
const BASE_URL = 'https://prod-r2da-api.ademe-dri.fr/api'

interface AdemeVersion {
  '@id': string
  '@type': string
  id: string
  statut: string
  dateFin: string
  [key: string]: any
}

interface AdemeVersionsResponse {
  member: AdemeVersion[]
  [key: string]: any
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

  private async sleep(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  }

  private async getProgramList(): Promise<AdemeVersion[]> {
    try {
      const response = await this._axios.get<AdemeVersionsResponse>(`${BASE_URL}/versions`)
      console.log(response.data.member.length, 'dispositifs récupérés ')
      return response.data.member || []
    } catch (error) {
      console.error('Error fetching versions from ADEME API:', error)
      return []
    }
  }

  private async getProgramDetails(programId: string): Promise<any> {
    try {
      const response = await this._axios.get<any>(`${BASE_URL}/versions/${programId}`)
      console.log(response)
      return response.data
    } catch (error) {
      console.error(`Error fetching program ${programId} from ADEME API:`, error)
      return null
    }
  }

  async getPrograms(reload = false): Promise<any[]> {
    if (!reload && fs.existsSync(TEMP_FILE_PATH)) {
      const data = fs.readFileSync(TEMP_FILE_PATH, 'utf-8')
      return JSON.parse(data)
    }

    const allVersions = await this.getProgramList()
    const now = new Date()
    const publicAndActivePrograms = allVersions.filter((version) => {
      const isPublic = version.statut === 'public'
      const dateFin = new Date(version.dateFin)
      const isActive = dateFin > now
      return isPublic && isActive
    })

    console.log(`Found ${publicAndActivePrograms.length} public and active programs out of ${allVersions.length} total`)

    const programDetails: any[] = []
    const limit = Math.min(5, publicAndActivePrograms.length) //TODO TOFIX TMP to test

    for (let i = 0; i < limit; i++) {
      const version = publicAndActivePrograms[i]
      console.log(`Fetching program ${i + 1}/${limit}: ${version.id}`)

      const details = await this.getProgramDetails(version.id)
      if (details) {
        programDetails.push(details)
      }

      if (i < limit - 1) {
        await this.sleep(5)
      }
    }

    fs.writeFileSync(TEMP_FILE_PATH, JSON.stringify(programDetails, null, 2))
    console.log(`Saved ${programDetails.length} programs to ${TEMP_FILE_PATH}`)

    return programDetails
  }
}
