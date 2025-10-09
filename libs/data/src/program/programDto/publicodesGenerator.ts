import { ThemeId } from '@tee/common'
import { Publicodes } from '../types/domain'
import { EligibilityData } from '../types/shared'

export class PublicodesGenerator {
  private _eligibility!: EligibilityData

  public generatePublicodes(eligibilityData: EligibilityData): Record<string, unknown> {
    this._eligibility = eligibilityData

    const publicodes: Record<string, unknown> = {}
    const cibles: string[] = []
    const eligibility: { 'applicable si'?: string | { [Publicodes.ALL]: string[] }; [Publicodes.ALL]?: string[]; valeur?: string } = {}
    const eligibilityConditions: string[] = []
    publicodes[Publicodes.CIBLE] = { [Publicodes.ALL]: cibles }

    if (this._eligibility.validity?.start || this._eligibility.validity?.end) {
      if (this._eligibility.validity.start && this._eligibility.validity.end) {
        eligibility['applicable si'] = {
          [Publicodes.ALL]: ['dispositif . début de validité <= date du jour', 'date du jour <= dispositif . fin de validité']
        }
      } else if (this._eligibility.validity.start) {
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

    if (this._eligibility.company.allowedRegion) {
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

    if (this._eligibility.company.ownsBuildings) {
      cibles.push(Publicodes.PROPRIO)
    }

    return publicodes
  }

  // --- Effectif ---
  private _generateEffectifConditions() {
    const { minEmployees, maxEmployees } = this._eligibility.company
    if (minEmployees || maxEmployees) {
      const constraints: string[] = []
      if (minEmployees) {
        constraints.push(`effectif >= ${minEmployees}`)
      }
      if (maxEmployees) {
        constraints.push(`effectif <= ${maxEmployees}`)
      }
      return { [Publicodes.ALL]: constraints }
    }
    return null
  }

  // --- Categorie légale ---
  private _generateLegalTypeCondition() {
    if (this._eligibility.company.excludeMicroentrepreneur) {
      return { [Publicodes.ALL]: ['microentrepreneur = non'] }
    }
    return null
  }

  // --- Secteur ---
  private _generateSectorConditions() {
    const naf = this._eligibility.company.allowedNafSections
    if (naf && naf.length) {
      return { 'une de ces conditions': naf.map((c) => `code NAF niveau 1 . est ${c}`) }
    }
    return null
  }

  // --- Zone géographique ---
  private _generateGeographicConditions() {
    const regions = this._eligibility.company.allowedRegion
    if (regions && regions.length) {
      return { [Publicodes.ANY]: regions.sort((a, b) => a.localeCompare(b, 'fr-FR')).map((r) => `région = ${r}`) }
    }
    return null
  }

  // --- Objectifs ---
  private _generateObjectifConditions() {
    const objectives = this._eligibility.questionnaire?.priorityObjectives
    if (!objectives || objectives.length === 0) {
      return null
    }

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

    const mapped = objectives
      .map((t) => themeToPublicodesMapping[t as ThemeId])
      .filter(Boolean)
      .map((label) => 'questionnaire . objectif prioritaire . ' + label)

    if (mapped.length > 0) {
      return { [Publicodes.ANY]: mapped }
    }
    return null
  }
}
