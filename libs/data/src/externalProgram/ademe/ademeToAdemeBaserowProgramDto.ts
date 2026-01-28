import { AdemeProgramDetail } from './ademeProgramType'
import { AdemeReferentialMappers } from './ademeReferentialMappers'
import { GeographicAreas } from '../../program/types/domain'
import { AdemeProgramBaserow } from '../../common/baserow/types'
import TurndownService from 'turndown'

export class AdemeToAdemeBaserowProgramDto {
  constructor(
    private _geographicAreas: GeographicAreas[] = [],
    private readonly _turndownService = new TurndownService()
  ) {}

  convert(ademeProgram: AdemeProgramDetail): AdemeProgramBaserow {
    const titre = ademeProgram.titre
    const typeProjetLabels = ademeProgram.typeProjet?.map((tp) => AdemeReferentialMappers.mapTypeProjet(tp.code as string)) || []
    const thematiqueLabels = ademeProgram.thematique?.map((th) => AdemeReferentialMappers.mapThematique(th.code as string)) || []
    const cibleLabels = ademeProgram.cibleProjet?.map((c) => AdemeReferentialMappers.mapCible(c.code as string)) || []
    const couvertureGeoLabel = ademeProgram.couvertureGeo?.code
      ? AdemeReferentialMappers.mapCouvertureGeo(ademeProgram.couvertureGeo.code)
      : ''
    const zoneGeoLabels = ademeProgram.zoneGeo?.map((zg) => AdemeReferentialMappers.mapZoneGeo(zg.code as string)) || []

    const zoneGeoIds = this._mapGeographicAreasToIds(zoneGeoLabels)

    return {
      'Id fiche dispositif': this._slugify(titre),
      Titre: titre,
      'Description courte': this._convertHtmlToMarkdown(ademeProgram.descriptionCourte),
      'Description longue': this._convertHtmlToMarkdown(ademeProgram.description),
      r2daId: ademeProgram.id,
      'URL R2DA': `https://prod-r2da.ademe-dri.fr/projects/${ademeProgram.id}`,
      "type d'aide (ADEME)": ademeProgram.dispositif.typeAide,
      'type de projet (ADEME)': typeProjetLabels.join(', '),
      'theme (ADEME)': thematiqueLabels.join(', '),
      cible: cibleLabels.join(', '),
      DISPOSITIF_DATE_DEBUT: ademeProgram.dateDebut,
      DISPOSITIF_DATE_FIN: ademeProgram.dateFin,
      'Couverture géographique': couvertureGeoLabel,
      'Zones Geo': zoneGeoLabels.join(', '),
      Eligibilité: this._convertHtmlToMarkdown(ademeProgram.eligibilite?.texteEligibilite || ''),
      'Zones Geo Link': zoneGeoIds,
      idDSP: ademeProgram.dispositif.idFonctionnel,
      'Contact URL (auto)': 'https://agirpourlatransition.ademe.fr/form/contact?id_dsp=' + ademeProgram.dispositif.idFonctionnel,
      'Données brutes': JSON.stringify(ademeProgram)
    }
  }

  private _mapGeographicAreasToIds(labels: string[]): number[] {
    if (!labels || labels.length === 0) {
      return []
    }

    const ids: number[] = []

    for (const label of labels) {
      const matchingArea = this._geographicAreas.find((area) => area.Name === label)

      if (matchingArea) {
        ids.push(matchingArea.id)
      } else {
        console.warn(`Geographic area not found in Baserow for label: "${label}"`)
      }
    }

    return ids
  }

  private _slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/²/g, '2') // Replace square symbol with 2
      .replace(/œ/g, 'oe') // Replace œ with oe
      .replace(/\s+à\s+/g, ' ') // Remove " à " (with spaces)
      .normalize('NFD') // Normalize the string to decompose accents from characters
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/['\u2019]/g, '') // Remove apostrophes (straight and Unicode right single quotation mark)
      .replace(/&/g, '') // Remove ampersand
      .trim()
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading or trailing hyphens
  }

  private _convertHtmlToMarkdown(html: string): string {
    if (!html) {
      return ''
    }

    return this._turndownService.turndown(html)
  }
}
