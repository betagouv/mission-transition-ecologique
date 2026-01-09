import { AdemeProgramDetail } from './tmpAdemeProgramType'
import { AdemeProgramBaserow } from './tmpAdemeProgramBaserowType'
import { AdemeReferentialMappers } from './ademeReferentialMappers'

export class AdemeToDataProgramConverter {
  convertAdemeProgramRawToAdemeProgramBaserow(ademeProgram: AdemeProgramDetail): AdemeProgramBaserow {
    const titre = ademeProgram.titre
    const typeProjetLabels = ademeProgram.typeProjet?.map((tp: any) => AdemeReferentialMappers.mapTypeProjet(tp.code)) || []
    const thematiqueLabels = ademeProgram.thematique?.map((th: any) => AdemeReferentialMappers.mapThematique(th.code)) || []
    const couvertureGeoLabel = ademeProgram.couvertureGeo?.code
      ? AdemeReferentialMappers.mapCouvertureGeo(ademeProgram.couvertureGeo.code)
      : ''
    const zoneGeoLabels = ademeProgram.zoneGeo?.map((zg: any) => AdemeReferentialMappers.mapZoneGeo(zg.code)) || []

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
      DISPOSITIF_DATE_DEBUT: ademeProgram.dateDebut,
      DISPOSITIF_DATE_FIN: ademeProgram.dateFin,
      'Couverture géographique': couvertureGeoLabel,
      'Zones Geo': zoneGeoLabels.join(', '),
      Eligibilité: this._convertHtmlToMarkdown(ademeProgram.eligibilite?.texteEligibilite || ''),
      'Données brutes': JSON.stringify(ademeProgram)
    }
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

  private _convertHtmlToMarkdown(html: string): string {
    if (!html) {
      return ''
    }

    const markdown = html
      // Convert headings
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

      // Convert bold and strong
      .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**')

      // Convert italic and emphasis
      .replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '*$2*')

      // Convert links
      .replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')

      // Convert unordered lists
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')

      // Convert ordered lists
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')

      // Convert paragraphs
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')

      // Convert line breaks
      .replace(/<br\s*\/?>/gi, '\n')

      // Convert code blocks
      .replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis, '```\n$1\n```\n')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')

      // Convert del/strike
      .replace(/<(del|strike)[^>]*>(.*?)<\/(del|strike)>/gi, '~~$2~~')

      // Remove remaining HTML tags
      .replace(/<[^>]*>/g, '')

      // Convert HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")

      // Clean up extra newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    return markdown
  }
}
