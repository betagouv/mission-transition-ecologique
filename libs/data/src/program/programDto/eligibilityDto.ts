import { EligibilityData } from '../types/shared'
import { ProgramDto } from './programDto'
import { LogLevel } from '../../common/logger/types'

export class EligibilityDto {
  private eligibility!: EligibilityData
  private generator!: ProgramDto

  public setEligibility(generator: ProgramDto): EligibilityData {
    this.generator = generator
    this.eligibility = {
      company: { allowedNafSections: [] }
    }

    this.setPeriodValidity()
    this.setEmployees()
    this.setLegalCategory()
    this._setSector()
    this._setGeographicArea()
    this._setObjectives()

    return this.eligibility
  }

  private setPeriodValidity() {
    const program = this.generator.rawProgram
    if (program.DISPOSITIF_DATE_DEBUT || program.DISPOSITIF_DATE_FIN) {
      this.eligibility.validity = {
        start: program.DISPOSITIF_DATE_DEBUT || undefined,
        end: program.DISPOSITIF_DATE_FIN || undefined
      }
    }
  }

  private setEmployees() {
    const program = this.generator.rawProgram
    if (program.minEff && program.minEff != 0) {
      this.eligibility.company.minEmployees = program.minEff
    }
    if (program.maxEff) {
      this.eligibility.company.maxEmployees = program.maxEff
    }
  }

  private setLegalCategory() {
    if (this.generator.rawProgram.microEntrepreneur != 'oui') {
      this.eligibility.company.excludeMicroentrepreneur = true
    }
  }

  private _setSector() {
    const program = this.generator.rawProgram
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

    const allowedNaf: string[] = []
    secteurs.forEach((sector) => {
      if (program[sector as keyof typeof program]) {
        allowedNaf.push(sector[0])
      }
    })

    if (allowedNaf.length > 0) {
      this.eligibility.company.allowedNafSections = allowedNaf
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
    const program = this.generator.rawProgram
    const coverage = program['Couverture géographique']?.Name
    if (!coverage || coverage === 'National') {
      return
    }

    let regions: string[] = []

    if (coverage === 'Régional') {
      regions = program['Zones géographiques'].map((z) => z.Name)
    } else if (coverage === 'Départemental') {
      const mapped = program['Zones géographiques'].map((z) => {
        if (this._departToRegionMap[z.Name]) {
          return this._departToRegionMap[z.Name]
        }
        this.generator.logger.log(
          LogLevel.Major,
          `Department ${z.Name} missing in departToRegionMap`,
          program['Id fiche dispositif'],
          program.id
        )
        return null
      })
      regions = Array.from(new Set(mapped.filter((r): r is string => r !== null)))
    }

    if (regions.length > 0) {
      this.eligibility.company.allowedRegion = regions
    }
  }

  private _setObjectives() {
    const program = this.generator.rawProgram
    const programThemes = program['Thèmes Ciblés']
    if (!programThemes || programThemes.length === 0) {
      this.generator.logger.log(LogLevel.Major, `Dispositif sans thème`, program['Id fiche dispositif'], program.id)
      return
    }

    this.eligibility.priorityObjectives = programThemes.map((theme) => theme['Nom (Tech)'])
  }
}
