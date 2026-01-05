import fs from 'fs'
import axios from 'axios'
import path from 'path'
import sharp from 'sharp'
import ConfigBaserow from '../../config/configBaserow'
import { AbstractBaserow } from './abstractBaserow'
import { LinkObject, ImageTable, Image } from './types'
import { Result } from 'true-myth'

interface ImageMetadata {
  [name: string]: string
}

export class ImageBaserow extends AbstractBaserow {
  private readonly _imageTableId = ConfigBaserow.IMAGE_ID
  private _metadata: ImageMetadata = {}
  private _processedImages: Set<string> = new Set()

  constructor(
    private readonly _imageDirectory: string,
    private readonly _metadataFilePath?: string
  ) {
    super()
    this._loadMetadata()
  }

  /**
   * Downloads the image if needed and returns the name of the image.
   *
   * @param baserowImage - A baserowLink object pointing to the image informations.
   * @returns the name of the image in the local directory or an error
   */
  async handleImageFromImageTable(baserowImage: LinkObject[]): Promise<Result<string, Error>> {
    if (baserowImage.length != 1) {
      return Result.err(new Error('A single image should be listed in the image field.'))
    }
    const imageId = baserowImage[0].id

    // request the image information from image table
    const imageInfos = (await this._getRowData<ImageTable>(this._imageTableId, imageId)) as ImageTable

    if (imageInfos.Image.length != 1) {
      return Result.err(new Error('A single file should uploaded in the image field of the image table. Issue Row number ' + imageInfos.id))
    }

    const imageName = this._generateImageName(imageInfos)
    if (this._imageAlreadyDownloaded(imageName, imageInfos.Image[0].uploaded_at)) {
      this._metadata[imageName] = imageInfos.Image[0].uploaded_at
      this._processedImages.add(imageName + '.webp')
      return Result.ok(imageName + '.webp')
    }

    let imageDownloadResponse
    try {
      imageDownloadResponse = await axios.get(imageInfos.Image[0].url, { responseType: 'arraybuffer' })
    } catch {
      return Result.err(new Error('Error while trying to download the image ' + imageId))
    }

    const imageBuffer = Buffer.from(imageDownloadResponse.data, 'binary')
    const webpBuffer = await this._sharpImage(imageBuffer)

    const fileName = `${imageName}.webp`
    const filePath = path.join(this._imageDirectory, fileName)
    fs.writeFileSync(filePath, webpBuffer)
    this._metadata[imageName] = imageInfos.Image[0].uploaded_at
    this._processedImages.add(fileName)

    return Result.ok(fileName)
  }

  async handleDirectImage(image: Image[]): Promise<Result<string, Error>> {
    if (image.length != 1) {
      return Result.err(new Error('A single image should be listed in the image field.'))
    }

    const imageName = this._slugify(image[0].visible_name)
    if (this._imageAlreadyDownloaded(imageName, image[0].uploaded_at)) {
      this._metadata[imageName] = image[0].uploaded_at
      this._processedImages.add(imageName + '.webp')
      return Result.ok(imageName + '.webp')
    }

    let imageDownloadResponse
    try {
      imageDownloadResponse = await axios.get(image[0].url, { responseType: 'arraybuffer' })
    } catch {
      return Result.err(new Error('Error while trying to download the image ' + imageName))
    }

    const imageBuffer = Buffer.from(imageDownloadResponse.data, 'binary')
    const webpBuffer = await this._sharpImage(imageBuffer)

    const fileName = `${imageName}.webp`
    const filePath = path.join(this._imageDirectory, fileName)
    try {
      fs.writeFileSync(filePath, webpBuffer)
    } catch {
      return Result.err(new Error('Error while trying to create the the local ' + imageName))
    }
    this._metadata[imageName] = image[0].uploaded_at
    this._processedImages.add(fileName)

    return Result.ok(fileName)
  }

  cleanup() {
    // delete the images whose name is not in 'processedImages'
    const existingFiles = fs.readdirSync(this._imageDirectory)
    for (const file of existingFiles) {
      const isProcessed = this._processedImages.has(file)
      if (!isProcessed) {
        const fullPath = path.join(this._imageDirectory, file)
        fs.unlinkSync(fullPath)
        delete this._metadata[file.replace('.webp', '')]
      }
    }

    this._saveMetadata()
  }

  private _loadMetadata(): void {
    if (this._metadataFilePath && fs.existsSync(this._metadataFilePath)) {
      const data = fs.readFileSync(this._metadataFilePath, 'utf-8')
      this._metadata = JSON.parse(data)
    }
  }

  private _saveMetadata(): void {
    if (this._metadataFilePath) {
      fs.writeFileSync(this._metadataFilePath, JSON.stringify(this._metadata, null, 2))
    }
  }

  private _generateImageName(imageData: ImageTable): string {
    let baseName = this._slugify(imageData['Image URL TEE'])
    if (!baseName) {
      baseName = this._slugify(imageData.Titre)
    }
    if (!this._processedImages.has(baseName)) {
      return baseName
    }

    // append -i to the name until a free name is detected
    let i = 1
    let imageName = `${baseName}-${i}`
    while (this._processedImages.has(imageName)) {
      i++
      imageName = `${baseName}-${i}`
    }

    return imageName
  }

  private _imageAlreadyDownloaded(imageName: string, uploadDate: string): boolean {
    return this._metadata[imageName] === uploadDate
  }

  private async _sharpImage(imageBuffer: Buffer): Promise<Buffer> {
    let imageSharp = sharp(imageBuffer)
    const metadata = await imageSharp.metadata()
    if (metadata.width && metadata.width > 1280) {
      imageSharp = imageSharp.resize(1280)
    }
    return await imageSharp.webp({ quality: 60 }).toBuffer()
  }

  private _slugify(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD') // Normalize the string to decompose accents from characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks (accents)
      .trim()
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading or trailing hyphens
      .slice(0, 50)
  }
}
