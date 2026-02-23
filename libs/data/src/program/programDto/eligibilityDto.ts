import { Logger } from '../../common/logger/logger'
import { DataProgram } from '../types/domain'
import { EligibilityData } from '../types/shared'
import { LogLevel } from '../../common/logger/types'
import { SectorKeys } from '../../common/baserow/types'

export class EligibilityDto {
  private _eligibilityData: EligibilityData = {
    company: { allowedNafSections: [] }
  }

  constructor(
    private _program: DataProgram,
    private _logger: Logger
  ) {}

  public setEligibility(): EligibilityData {
    this._setPeriodValidity()
    this._setEmployees()
    this._setLegalCategory()
    this._setSector()
    this._setGeographicArea()
    this._setObjectives()

    return this._eligibilityData
  }

  private _setPeriodValidity() {
    if (this._program.DISPOSITIF_DATE_DEBUT || this._program.DISPOSITIF_DATE_FIN) {
      this._eligibilityData.validity = {
        start: this._program.DISPOSITIF_DATE_DEBUT || undefined,
        end: this._program.DISPOSITIF_DATE_FIN || undefined
      }
    }
  }

  private _setEmployees() {
    if (this._program.minEff && this._program.minEff != 0) {
      this._eligibilityData.company.minEmployees = this._program.minEff
    }
    if (this._program.maxEff) {
      this._eligibilityData.company.maxEmployees = this._program.maxEff
    }
  }

  private _setLegalCategory() {
    if (this._program.microEntrepreneur.toLowerCase() != 'oui') {
      this._eligibilityData.company.excludeMicroentrepreneur = true
    }
  }

  private _setSector() {
    const allowedNaf: string[] = []

    for (const [sector, code] of Object.entries(SectorKeys)) {
      if (this._program[sector as keyof typeof this._program]) {
        allowedNaf.push(code)
      }
    }

    if (allowedNaf.length > 0) {
      this._eligibilityData.company.allowedNafSections = allowedNaf
    }
  }

  private readonly _departToRegionMap: Record<string, string> = {
    Vaucluse: "Provence-Alpes-Côte d'Azur",
    'Bouches-du-Rhône': "Provence-Alpes-Côte d'Azur",
    'Alpes-Maritimes': "Provence-Alpes-Côte d'Azur",
    'Eure-et-Loir': 'Centre-Val de Loire',
    Loiret: 'Centre-Val de Loire',
    Landes: 'Nouvelle-Aquitaine',
    'Seine-et-Marne': 'Île-de-France',
    Jura: 'Bourgogne-Franche-Comté'
  }

  private _setGeographicArea() {
    const coverage = this._program['Couverture géographique']?.Name
    if (!coverage || coverage === 'National') {
      return
    }

    let regions: string[] = []

    if (coverage === 'Régional') {
      regions = this._program['Zones géographiques'].map((z) => z.Name)
    } else if (coverage === 'Départemental') {
      const mapped = this._program['Zones géographiques'].map((z) => {
        if (this._departToRegionMap[z.Name]) {
          return this._departToRegionMap[z.Name]
        }
        this._logger.log(
          LogLevel.Major,
          `Department ${z.Name} missing in departToRegionMap`,
          this._program['Id fiche dispositif'],
          this._program.id
        )
        return null
      })
      regions = Array.from(new Set(mapped.filter((r): r is string => r !== null)))
    }

    if (regions.length > 0) {
      this._eligibilityData.company.allowedRegion = regions
    }
  }

  private _setObjectives() {
    const programThemes = this._program['Thèmes Ciblés']
    if (!programThemes || programThemes.length === 0) {
      this._logger.log(LogLevel.Major, `Dispositif sans thème`, this._program['Id fiche dispositif'], this._program.id)
      return
    }

    this._eligibilityData.priorityObjectives = programThemes.map((theme) => theme['Nom (Tech)'])
  }
}
