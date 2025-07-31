import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import ConfigBaserow from '../../configBaserow'
import { Id, LinkObject } from './types'

dotenv.config()

export abstract class AbstractBaserow {
  protected readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _apiToken = this._setBaserowToken()
  private readonly _baseUrl = 'https://api.baserow.io/api'
  protected readonly _themeTableId = ConfigBaserow.THEME_ID
  protected readonly _operatorTableId = ConfigBaserow.OPERATOR_ID
  protected readonly _geographicAreasTableId = ConfigBaserow.GEOGRAPHIC_AREAS_ID
  protected readonly _projectTableId = ConfigBaserow.PROJECT_ID

  private readonly _axiosHeader = {
    headers: {
      Authorization: `Token ${this._apiToken}`
    }
  }

  protected async _getTableData<T>(tableId: number): Promise<T[]> {
    try {
      const response = await axios.get(`${this._baseUrl}/database/rows/table/${tableId}/?user_field_names=true`, this._axiosHeader)
      await this._delay(100)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      let results = response.data.results
      let next = response.data.next
      while (next) {
        const newResponse = await axios.get(next, this._axiosHeader)
        await this._delay(100)
        results = results.concat(newResponse.data.results)
        next = newResponse.data.next
      }
      return results
    } catch (error) {
      console.error('Error fetching project data from baserow:', error)
      return []
    }
  }

  protected async _getRowData<T>(tableId: number, rowId: number): Promise<T | null> {
    try {
      const response = await axios.get(`${this._baseUrl}/database/rows/table/${tableId}/${rowId}/?user_field_names=true`, this._axiosHeader)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return response.data
    } catch (error) {
      console.error('Error fetching a specific row of data from baserow :', error)
      return null
    }
  }

  protected async _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected _replaceLinkObjectByTableData<T extends Id>(links: LinkObject[], referencedTableData: T[]): T[] {
    const tableData = links.map((link) => referencedTableData.find((object) => link.id === object.id))

    if (tableData.includes(undefined)) {
      console.warn("warning, a baserow link isn't defined, it should never happen", links)
    }

    return tableData.filter((item) => item !== undefined) as T[]
  }

  private _setBaserowToken(): string {
    if (process.env['BASEROW_TOKEN']) {
      return process.env['BASEROW_TOKEN']
    }
    throw Error('Baserow token not found.')
  }
}
