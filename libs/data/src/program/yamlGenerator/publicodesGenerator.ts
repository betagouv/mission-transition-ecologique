import { DataProgram, Publicodes } from '../types/domain'
import { ThemeId } from '../../theme/types/shared'

export class PublicodesGenerator {
  constructor(private _program: DataProgram) {}

  public generatePublicodes(): { [key: string]: unknown } {
    const publicodes: { [key: string]: unknown } = {}
    const cibles: string[] = []
    const eligibility: { 'applicable si'?: string | { [Publicodes.ALL]: string[] }; [Publicodes.ALL]?: string[]; valeur?: string } = {}
    const eligibilityConditions: string[] = []
    publicodes[Publicodes.CIBLE] = { [Publicodes.ALL]: cibles }

    if (this._program.DISPOSITIF_DATE_DEBUT || this._program.DISPOSITIF_DATE_FIN) {
      if (this._program.DISPOSITIF_DATE_DEBUT && this._program.DISPOSITIF_DATE_FIN) {
        eligibility['applicable si'] = {
          [Publicodes.ALL]: ['dispositif . début de validité <= date du jour', 'date du jour <= dispositif . fin de validité']
        }
      } else if (this._program.DISPOSITIF_DATE_DEBUT) {
        eligibility['applicable si'] = 'dispositif . début de validité <= date du jour'
      } else {
        eligibility['applicable si'] = 'date du jour <= dispositif . fin de validité'
      }
    }

    if (this._generateEffectifConditions()) {
      eligibilityConditions.push('a un effectif éligible')
    }
    if (this._generateLegalTypeCondition()) {
      eligibilityConditions.push('a une categorie legale eligible')
    }

    if (this._program['Couverture géographique'].Name != 'National') {
      eligibilityConditions.push(Publicodes.ZONE_GEO)
    }

    if (eligibilityConditions.length > 0) {
      eligibility[Publicodes.ALL] = eligibilityConditions
    } else if (eligibility['applicable si']) {
      eligibility['valeur'] = 'oui'
    }

    if (Object.keys(eligibility).length !== 0) {
      publicodes[Publicodes.ELIGIBLE] = eligibility
      cibles.push('est éligible')
    }

    if (this._generateEffectifConditions()) {
      publicodes[Publicodes.EFFECTIF] = this._generateEffectifConditions()
    }

    if (this._generateLegalTypeCondition()) {
      publicodes[Publicodes.LEGALCATEGORY] = this._generateLegalTypeCondition()
    }

    if (this._generateSectorConditions()) {
      publicodes[Publicodes.SECTEUR] = this._generateSectorConditions()
      cibles.push("est dans un secteur d'activité ciblé")
    }

    if (this._generateObjectifConditions()) {
      publicodes[Publicodes.OBJECTIF] = this._generateObjectifConditions()
      cibles.push('a un objectif ciblé')
    }

    if (this._generateGeographicConditions()) {
      publicodes[Publicodes.ZONE_GEO] = this._generateGeographicConditions()
    }

    if (!this._program['Parcours "Je ne sais pas par où commencer"']) {
      cibles.push('questionnaire . parcours = objectif précis')
    }

    if (this._program.Propriétaire && this._program.Propriétaire != '*') {
      cibles.push(Publicodes.PROPRIO)
    }

    return publicodes
  }

  private _departToRegionMap: { [key: string]: string } = {
    Vaucluse: "Provence-Alpes-Côte d'Azur",
    'Bouches-du-Rhône': "Provence-Alpes-Côte d'Azur",
    'Alpes-Maritimes': "Provence-Alpes-Côte d'Azur",
    'Eure-et-Loir': 'Centre-Val de Loire',
    Loiret: 'Centre-Val de Loire',
    Landes: 'Nouvelle-Aquitaine',
    'Seine-et-Marne': 'Île-de-France',
    Jura: 'Bourgogne-Franche-Comté'
  }

  private _generateGeographicConditions() {
    if (this._program['Couverture géographique'].Name == 'Régional') {
      return {
        [Publicodes.ANY]: this._program['Zones géographiques']
          .map((zone) => `région = ${zone.Name}`)
          .sort((a, b) => a.localeCompare(b, 'fr-FR'))
      }
    }
    if (this._program['Couverture géographique'].Name == 'Départemental') {
      const uniqueRegions = Array.from(
        new Set(
          this._program['Zones géographiques'].map((zone) => {
            if (Object.prototype.hasOwnProperty.call(this._departToRegionMap, zone.Name)) {
              return this._departToRegionMap[zone.Name]
            } else {
              console.error(`Error: ${zone.Name} must be added in departToRegionMap.`)
              return null
            }
          })
        )
      )
      return {
        [Publicodes.ANY]: uniqueRegions.map((region) => `région = ${region}`).sort((a, b) => a.localeCompare(b, 'fr-FR'))
      }
    }
    if (this._program['Couverture géographique'].Name == 'National') {
      return null
    }
    console.warn(
      'Warning: Region type non handled in publicode automatic generator.\nYou either need to update the script or to handle your program manually.'
    )
    return null
  }

  private _generateObjectifConditions() {
    const programThemes = this._program['Thèmes Ciblés']
    const themeToPublicodesMapping = {
      [ThemeId.Building]: 'est rénover mon bâtiment',
      [ThemeId.Mobility]: 'est la mobilité durable',
      [ThemeId.Waste]: 'est la gestion des déchets',
      [ThemeId.Water]: "est diminuer ma consommation d'eau",
      [ThemeId.Energy]: 'est ma performance énergétique',
      [ThemeId.RH]: 'est former ou recruter',
      [ThemeId.Environmental]: 'est mon impact environnemental',
      [ThemeId.EcoDesign]: "est l'écoconception",
      [ThemeId.Biodiversity]: 'est préserver la biodiversité'
    }

    if (!programThemes) {
      return null
    }
    return {
      [Publicodes.ANY]: programThemes.map(
        (theme) => 'questionnaire . objectif prioritaire . ' + themeToPublicodesMapping[theme['Nom (Tech)']]
      )
    }
  }

  private _generateSectorConditions() {
    const secteurs = [
      'AAgriculture, sylviculture et pêche',
      'BIndustries extractives',
      'CIndustrie manufacturière',
      "DProduction et distribution d'électricité, de gaz, de vapeur et d'air conditionné",
      "EProduction et distribution d'eau, assainissement, gestion des déchets et dépollution",
      'FConstruction',
      "GCommerce, réparation d'automobiles et de motocycles",
      'HTransports et entreposage',
      'IHébergement et restauration',
      'JInformation et communication',
      "KActivités financières et d'assurance",
      'LActivités immobilières',
      'MActivités spécialisées, scientifiques et techniques',
      'NActivités de services administratifs et de soutien',
      'OAdministration publique',
      'PEnseignement',
      'QSanté humaine et action sociale',
      'RArts, spectacles et activités récréatives',
      'SAutres activités de services',
      "TActivités des ménages en tant qu'employeurs, activités indifférenciées des ménages en tant que producteurs de biens et services pour usage propre",
      'UActivités extra-territoriales'
    ]

    const programNaf: string[] = []
    secteurs.forEach((sector) => {
      if (this._program[sector as keyof typeof this._program] == 1) {
        programNaf.push(sector[0])
      }
    })
    if (programNaf.length) {
      return {
        'une de ces conditions': programNaf.map((nafCode) => `code NAF niveau 1 . est ${nafCode}`)
      }
    }
    return null
  }

  private _generateEffectifConditions() {
    if (this._program.minEff > 0 || this._program.maxEff) {
      const constraint = []
      if (this._program.minEff > 0) {
        constraint.push(`effectif >= ${this._program.minEff}`)
      }
      if (this._program.maxEff) {
        constraint.push(`effectif <= ${this._program.maxEff}`)
      }
      if (constraint) {
        return {
          [Publicodes.ALL]: constraint
        }
      }
    }
    return null
  }

  private _generateLegalTypeCondition() {
    if (this._program.microEntrepreneur === 'non') {
      return { [Publicodes.ALL]: ['microentrepreneur = non'] }
    }
    return null
  }
}
