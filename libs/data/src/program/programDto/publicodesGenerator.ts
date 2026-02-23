import { Objective, ThemeId } from '@tee/common'
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

    return publicodes
  }

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

  private _generateLegalTypeCondition() {
    if (this._eligibility.company.excludeMicroentrepreneur) {
      return { [Publicodes.ALL]: ['microentrepreneur = non'] }
    }
    return null
  }

  private _generateSectorConditions() {
    const naf = this._eligibility.company.allowedNafSections
    if (naf && naf.length) {
      return { 'une de ces conditions': naf.map((code) => `code NAF niveau 1 . est ${code}`) }
    }
    return null
  }

  private _generateGeographicConditions() {
    const regions = this._eligibility.company.allowedRegion
    if (regions && regions.length) {
      return { [Publicodes.ANY]: regions.sort((a, b) => a.localeCompare(b, 'fr-FR')).map((region) => `région = ${region}`) }
    }
    return null
  }

  private _generateObjectifConditions() {
    const objectives = this._eligibility.priorityObjectives
    if (!objectives || objectives.length === 0) {
      return null
    }

    const themeToPublicodesMapping = {
      [ThemeId.Building]: Objective.BuildingRenovation,
      [ThemeId.Mobility]: Objective.SustainableMobility,
      [ThemeId.Waste]: Objective.WasteManagement,
      [ThemeId.Water]: Objective.WaterConsumption,
      [ThemeId.Energy]: Objective.EnergyPerformance,
      [ThemeId.RH]: Objective.TrainOrRecruit,
      [ThemeId.Environmental]: Objective.EnvironmentalImpact,
      [ThemeId.EcoDesign]: Objective.EcoDesign,
      [ThemeId.Biodiversity]: Objective.Biodiversity
    }

    const mapped = objectives
      .map((theme) => themeToPublicodesMapping[theme as ThemeId])
      .filter(Boolean)
      .map((objective) => 'questionnaire . objectif prioritaire . est ' + objective)

    if (mapped.length > 0) {
      return { [Publicodes.ANY]: mapped }
    }
    return null
  }
}
