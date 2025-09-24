import axios from 'axios'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import ConfigBaserow from '../../configBaserow'
import { BaserowData, Id, LinkObject } from './types'

dotenv.config()

export abstract class AbstractBaserow {
  protected readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _apiToken = ConfigBaserow.TOKEN
  private readonly _baseUrl = 'https://api.baserow.io/api'
  private readonly _url = `${this._baseUrl}/database/rows/table`
  protected readonly _themeTableId = ConfigBaserow.THEME_ID
  protected readonly _operatorTableId = ConfigBaserow.OPERATOR_ID
  protected readonly _geographicAreasTableId = ConfigBaserow.GEOGRAPHIC_AREAS_ID
  protected readonly _projectTableId = ConfigBaserow.PROJECT_ID

  private readonly _axiosHeader = {
    headers: {
      Authorization: `Token ${this._apiToken}`
    }
  }

  protected get _axios() {
    return axios.create(this._axiosHeader)
  }

  protected async _getData<T>(tableId: number) {
    return await this._axios.get<BaserowData<T>>(`${this._url}/${tableId}/?user_field_names=true`)
  }

  protected async _getDatum<T>(tableId: number, rowId: number) {
    return await this._axios.get<T>(`${this._url}/${tableId}/${rowId}/?user_field_names=true`)
  }

  protected async _getTableData<T>(tableId: number): Promise<T[]> {
    try {
      const response = await this._getData<T>(tableId)
      await this._delay(100)

      let results = response.data.results
      let next = response.data.next
      while (next) {
        const response = await this._axios.get(next)
        await this._delay(100)
        results = results.concat(response.data.results)
        next = response.data.next
      }
      return results
    } catch (error) {
      console.error('Error fetching project data from baserow:', error)
      return []
    }
  }

  protected async _getRowData<T>(tableId: number, rowId: number): Promise<T | null> {
    try {
      const response = await this._getDatum<T>(tableId, rowId)

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
    if (!links) return []

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

  protected async _patchRow<T>(tableId: number, rowId: number, data: Partial<T>): Promise<void> {
    try {
      await this._axios.patch(`${this._url}/${tableId}/${rowId}/?user_field_names=true`, data)
    } catch (error) {
      console.error(`Error patching row ${rowId} in table ${tableId}:`, error)
    }
  }

  protected async _createRow<T>(tableId: number, data: Partial<T>): Promise<void> {
    try {
      await this._axios.post(`${this._url}/${tableId}/?user_field_names=true`, data)
    } catch (error) {
      console.error(`Error creating row in table ${tableId}:`, error)
    }
  }
}
