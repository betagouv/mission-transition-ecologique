import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { Id, ImageTable, LinkObject } from './types'

dotenv.config()

export abstract class AbstractBaserow {
  private readonly _apiToken = this._setBaserowToken()
  private readonly _baseUrl = 'https://api.baserow.io/api'
  protected readonly _themeTableId = 305258
  private readonly _axiosHeader = {
    headers: {
      Authorization: `Token ${this._apiToken}`
    }
  }
  private readonly _imageTableId = 315189
  protected readonly _imagePath = '/images/projet/'
  private readonly _defaultImageName = 'plan-transition-bas-carbone.webp'

  constructor(private readonly _imageDirectory?: string) {}

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

  protected async _handleImage(baserowImage: LinkObject[]): Promise<string> {
    if (!this._imageDirectory) {
      console.error('Image directory not defined but attemping to download an image')
      return ''
    }

    if (!baserowImage.length) {
      console.log('No image found, defaulting to plan-transition-bas-carbone.webp')
      return this._defaultImageName
    }
    // request the image url in the image table
    const imageId = baserowImage[0].id
    const imageInfos = (await this._getRowData<ImageTable>(this._imageTableId, imageId)) as ImageTable
    let imageDownloadResponse
    try {
      imageDownloadResponse = await axios.get(imageInfos.Image[0].url, { responseType: 'arraybuffer' })
    } catch {
      console.error('Error while trying to download the image ' + imageId)
      console.log('Defaulting to the default image : ' + this._defaultImageName)
      return this._defaultImageName
    }

    const imageBuffer = Buffer.from(imageDownloadResponse.data, 'binary')
    const webpBuffer = await this._sharpImage(imageBuffer)

    const fileName = `${imageInfos['Image URL TEE']}.webp`
    const filePath = path.join(this._imageDirectory, fileName)
    fs.writeFileSync(filePath, webpBuffer)

    return fileName
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

  private async _sharpImage(imageBuffer: Buffer): Promise<Buffer> {
    let imageSharp = sharp(imageBuffer)
    const metadata = await imageSharp.metadata()
    if (metadata.width && metadata.width > 1280) {
      imageSharp = imageSharp.resize(1280)
    }
    return await imageSharp.webp({ quality: 60 }).toBuffer()
  }

  private _setBaserowToken(): string {
    if (process.env['BASEROW_TOKEN']) {
      return process.env['BASEROW_TOKEN']
    }
    throw Error('Baserow token not found.')
  }
}
