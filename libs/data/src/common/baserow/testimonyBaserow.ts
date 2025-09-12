import ConfigBaserow from '../../configBaserow'
import { AbstractBaserow } from './abstractBaserow'
import { BaserowTestimony } from './types'
import { Testimony } from '../../testimony/types/shared'
import { ImageBaserow } from './imageBaserow'
import path from 'path'

export class TestimonyBaserow extends AbstractBaserow {
  private readonly _testimoniesTableId = ConfigBaserow.TESTIMONIES_ID
  private readonly _logPath: string = path.join(this.__dirname, '../../../src/testimony/testimony_images_download_info.json')
  private _imageDownloader: ImageBaserow
  private readonly _imagePath = '/images/testimony/'

  constructor(imageDirectory: string) {
    super()
    this._imageDownloader = new ImageBaserow(imageDirectory, this._logPath)
  }

  async getAll(): Promise<Testimony[]> {
    const baserowTestimonies = await this._getTableData<BaserowTestimony>(this._testimoniesTableId)
    const testimonies = await Promise.all(
      baserowTestimonies
        .filter((baserowTestimony) => baserowTestimony.Statut.value.includes('En prod'))
        .map((baserowTestimony) => this._convertToDomain(baserowTestimony))
    )
    this._imageDownloader.cleanup()
    return testimonies
  }

  private async _convertToDomain(baserowTestimony: BaserowTestimony): Promise<Testimony> {
    const maybeImageName = await this._imageDownloader.handleDirectImage(baserowTestimony.Photo)
    let imageName: string | undefined = undefined
    if (!maybeImageName.isErr) {
      imageName = this._imagePath + maybeImageName.value
    }

    return {
      slug: baserowTestimony['Id fiche témoignage'],
      verbatim: baserowTestimony.Verbatim,
      companyName: baserowTestimony['Nom entreprise'],
      authorName: baserowTestimony['Prénom NOM'],
      authorFunction: baserowTestimony["Fonction + nom de l'entreprise"],
      authorImage: imageName,
      authorImageAttributes: baserowTestimony["attribut de l'image"],
      externalLink: baserowTestimony['Lien externe vers le témoignage'],
      homePageHighlight: baserowTestimony['Mise en avant'],
      projects: baserowTestimony.Projets.map((projectLink) => projectLink.id)
    }
  }
}
