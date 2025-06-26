import { AbstractBaserow } from './abstractBaserow'
import { BaserowTestimony } from './types'
import { Testimony } from '../../testimony/types/shared'

export class TestimonyBaserow extends AbstractBaserow {
  private readonly _testimoniesTableId = 399896

  async getAll(): Promise<Testimony[]> {
    const baserowTestimonies = await this._getTableData<BaserowTestimony>(this._testimoniesTableId)
    return baserowTestimonies
      .filter((baserowTestimony) => baserowTestimony.Statut.value.includes('valid'))
      .map((baserowTestimony) => this._convertToDomain(baserowTestimony))
  }

  private _convertToDomain(baserowTestimony: BaserowTestimony): Testimony {
    return {
      slug: baserowTestimony['Id fiche témoignage'],
      verbatim: baserowTestimony.Verbatim,
      companyName: baserowTestimony['Nom entreprise'],
      authorName: baserowTestimony['Prénom NOM'],
      authorFunction: baserowTestimony["Fonction + nom de l'entreprise"],
      authorImage: 'static/image/link',
      authorImageAttributes: baserowTestimony["attribut de l'image"],
      externalLink: baserowTestimony['Lien externe vers le témoignage'],
      homePageHighlight: baserowTestimony['Mise en avant'],
      projects: baserowTestimony.Projets.map((projectLink) => projectLink.id)
    }
  }
}
