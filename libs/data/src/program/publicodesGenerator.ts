import path from 'path'
import fs from 'fs'
import { Program, Publicodes } from './types'
import { ThemeType } from '../theme/themes'

export class PublicodesGenerator {
  constructor(private program: Program) {}

  public generatePublicodes(): { [key: string]: any } {
    const filePath = path.join(__dirname, 'publicodesStaticData.json')
    const staticData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    let publicodes: { [key: string]: any }
    if (this.program['Id fiche dispositif'] in staticData) {
      publicodes = staticData[this.program['Id fiche dispositif']]
    } else {
      publicodes = this._generatePublicodes()
    }

    return publicodes
  }

  private _generatePublicodes(): { [key: string]: any } {
    const publicodes: any = {}
    const cibles: string[] = []
    const eligibility: any = {}
    const eligibilityConditions: any = []
    publicodes[Publicodes.CIBLE] = { [Publicodes.ALL]: cibles }

    if (this.program.DISPOSITIF_DATE_DEBUT || this.program.DISPOSITIF_DATE_FIN) {
      if (this.program.DISPOSITIF_DATE_DEBUT && this.program.DISPOSITIF_DATE_FIN) {
        eligibility['applicable si'] = {
          [Publicodes.ALL]: ['dispositif . début de validité <= date du jour', 'date du jour <= dispositif . fin de validité']
        }
      } else if (this.program.DISPOSITIF_DATE_DEBUT) {
        eligibility['applicable si'] = 'dispositif . début de validité <= date du jour'
      } else {
        eligibility['applicable si'] = 'date du jour <= dispositif . fin de validité'
      }
    }

    if (this._generateEffectifConditions()) {
      eligibilityConditions.push('a un effectif éligible')
    }
    if (this.program['Couverture géographique'].Name != 'National') {
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

    if (!this.program['Parcours "Je ne sais pas par où commencer"']) {
      cibles.push('questionnaire . parcours = objectif précis')
    }

    if (this.program.Propriétaire && this.program.Propriétaire != '*') {
      cibles.push(Publicodes.PROPRIO)
    }

    return publicodes
  }

  private _departToRegionMap: { [key: string]: string } = {
    Vaucluse: "Provence-Alpes-Côte d'Azur"
  }

  private _generateGeographicConditions() {
    if (this.program['Couverture géographique'].Name == 'Régional') {
      return {
        [Publicodes.ANY]: this.program['Zones géographiques']
          .map((zone) => `région = ${zone.Name}`)
          .sort((a, b) => a.localeCompare(b, 'fr-FR'))
      }
    }
    if (this.program['Couverture géographique'].Name == 'Départemental') {
      const uniqueRegions = Array.from(
        new Set(
          this.program['Zones géographiques'].map((zone) => {
            if (Object.prototype.hasOwnProperty.call(this._departToRegionMap, zone.Name)) {
              return this._departToRegionMap[zone.Name]
            } else {
              console.log(`Warning: ${zone.Name} must be added in departToRegionMap.`)
              return null
            }
          })
        )
      )
      return {
        [Publicodes.ANY]: uniqueRegions.map((region) => `région = ${region}`).sort((a, b) => a.localeCompare(b, 'fr-FR'))
      }
    }
    if (this.program['Couverture géographique'].Name == 'National') {
      return null
    }
    console.log(
      'Warning: Region type non handled in publicode automatic generator.\nYou either need to update the script or to handle your program manually.'
    )
    return null
  }

  private _generateObjectifConditions() {
    const programThemes = this.program['Thèmes Ciblés']
    const themeToPublicodesMapping = {
      [ThemeType.Building]: 'est rénover mon bâtiment',
      [ThemeType.Mobility]: 'est la mobilité durable',
      [ThemeType.Waste]: 'est la gestion des déchets',
      [ThemeType.Water]: "est diminuer ma consommation d'eau",
      [ThemeType.Energy]: 'est ma performance énergétique',
      [ThemeType.RH]: 'est former ou recruter',
      [ThemeType.Environmental]: 'est mon impact environnemental',
      [ThemeType.EcoDesign]: "est l'écoconception"
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
      if (this.program[sector as keyof typeof this.program] == 1) {
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
    if (this.program.minEff > 0 || this.program.maxEff) {
      const constraint = []
      if (this.program.minEff > 0) {
        constraint.push(`effectif >= ${this.program.minEff}`)
      }
      if (this.program.maxEff) {
        constraint.push(`effectif <= ${this.program.maxEff}`)
      }
      if (constraint) {
        return {
          [Publicodes.ALL]: constraint
        }
      }
    }
    return null
  }
}
