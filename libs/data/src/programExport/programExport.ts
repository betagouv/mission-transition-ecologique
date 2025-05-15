import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { fileURLToPath } from 'url'
import { ProgramUtils } from '../program/programUtils'
import { COG_MAPPING, schemaProgram } from './type' // assumed to be your SchemaType definition
import { DataProgram, GeographicAreas, GeographicCoverage, Operator } from '../program/types/domain'
import { ProgramBaserow } from '../common/baserow/programBaserow'
import { randomUUID } from 'crypto'
import { BaserowSectors, SectorKeys } from '../common/baserow/types'
import { Logger } from '../common/logger/logger'
import { LoggerType } from '../common/logger/types'
import { ProjectBaserow } from '../common/baserow/projectBaserow'
import { DataProject } from '../project/types/domain'

export class ProgramExport {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputFilePath: string = path.join(this.__dirname, '../../static/programs.csv')

  async exportAsCsv(): Promise<void> {
    const programs = await new ProgramBaserow().getPrograms(false)
    const projects = await new ProjectBaserow('', new Logger(LoggerType.Project)).getProdProjects(false)

    const previousExportedPrograms = this._readPreviousCSV()

    const schemaPrograms: schemaProgram[] = programs.filter(ProgramUtils.isInProd).map((program) => {
      const previous = previousExportedPrograms.find((p) => p.nom === program.Titre) // Note : pas optimal mais ça semble trop de travail de faire mieux pour le nombre d'utilisations prévues du code.
      return this.convertFromDataTypeToSchemaType(program, projects, previous)
    })

    const csv = stringify(schemaPrograms, { header: true })
    fs.writeFileSync(this._outputFilePath, csv, 'utf-8')
  }

  private _readPreviousCSV(): schemaProgram[] {
    if (!fs.existsSync(this._outputFilePath)) return []

    const content = fs.readFileSync(this._outputFilePath, 'utf-8')
    const records: schemaProgram[] = parse(content, {
      columns: true,
      skip_empty_lines: true
    })
    return records
  }

  convertFromDataTypeToSchemaType(original: DataProgram, projects: DataProject[], previousExport?: schemaProgram): schemaProgram {
    const programTeeUrl = `https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise/${original['Id fiche dispositif']}`

    const schema: schemaProgram = {
      id_aide: previousExport?.id_aide || randomUUID(),
      nom: original.Titre,
      promesse: original.Promesse,
      description_courte: original['Description courte'],
      description_longue: original['Description longue'],
      programme_aides: undefined,
      porteur_aide: this._mergeOperatorNames(original['Opérateur de contact'], original['Autres opérateurs']),
      porteur_siren: this._mergeOperatorSiren(original['Opérateur de contact'], original['Autres opérateurs']),
      beneficiaires_aide: 'Entreprises privées',
      types_aides: original["Nature de l'aide"] || '',
      montant_aide_ou_cout: original["Montant de l'aide ou coût"],
      duree_aide: original["Durée de l'aide"],
      projet_reference: this._getProjectList(original['Id fiche dispositif'], projects),
      exemple_projet: undefined,
      thematique_aide: original['Thèmes Ciblés'].map((t) => 'écologie > ' + t.Nom).join(' ; '),
      date_ouverture: this._formatDate(original.DISPOSITIF_DATE_DEBUT),
      date_releve_intermediaire: undefined,
      date_cloture: this._formatDate(original.DISPOSITIF_DATE_FIN),
      url_source: programTeeUrl,
      contact_question: this._getContact(original['Contact Question'], programTeeUrl),
      activation_etape_1: this._getStepString(original.étape1),
      activation_etape_1_liens: this._generateStepLinks(original.étape1, programTeeUrl),
      activation_etape_2: this._getStepString(original.étape2),
      activation_etape_2_liens: this._generateStepLinks(original.étape2, programTeeUrl),
      activation_etape_3: this._getStepString(original.étape3),
      activation_etape_3_liens: this._generateStepLinks(original.étape3, programTeeUrl),
      activation_etape_4: this._getStepString(original.étape4),
      activation_etape_4_liens: this._generateStepLinks(original.étape4, programTeeUrl),
      activation_etape_5: this._getStepString(original.étape5),
      etape_activation_5_liens: this._generateStepLinks(original.étape5, programTeeUrl),
      activation_etape_6: this._getStepString(original.étape6),
      activation_etape_6_liens: this._generateStepLinks(original.étape6, programTeeUrl),
      eligibilite_geographique: this._getGeographicCoverage(original['Couverture géographique'], original['Zones géographiques']),
      eligibilite_geographique_exclusions: undefined,
      eligibilite_sectorielle: original['Eligibilité Sectorielle'] + ' ; ' + original['Eligibilité Naf'],
      eligibilite_sectorielle_naf: this._getNafCodesFromSectors(original as BaserowSectors),
      eligibilite_sectorielle_exclusions: undefined,
      eligibilite_effectif: original['Eligibilité Taille'],
      eligibilite_effectif_min: original.minEff,
      eligibilite_effectif_max: original.maxEff,
      eligibilite_existence: original['Eligibilité Existence'],
      eligibilite_existence_min: this._parseExistenceFromText(original['Eligibilité Existence']),
      eligibilite_existence_max: undefined,
      eligibilite_statuts_specifiques: this._checkSpecificStatus(original['Eligibilité Sectorielle']),
      eligibilite_statuts_exclus: original.microEntrepreneur === 'non' ? 'micro-entrepreneur' : undefined,
      eligibilite_autre: original['Eligibilité Spécifique'],
      date_mise_a_jour: this._getCurrentFormattedDate()
    }

    return schema
  }

  _getContact(baserowContactField: string, teeUrl: string): string {
    if (baserowContactField.toLowerCase().includes('#formulaire#')) {
      return teeUrl
    }
    return baserowContactField
  }

  _getProjectList(programSlug: string, projects: DataProject[]): string {
    const matchingTitles = projects.filter((project) => project.programs.includes(programSlug)).map((project) => project.title)

    return matchingTitles.join(';')
  }

  _getStepString(data: string) {
    if (!data) return ''

    const lines = data.split('\n')
    return lines[0]?.substring(2) ?? ''
  }

  _generateStepLinks(data: string, teeUrl: string): string | undefined {
    if (!data) return ''
    const lines = data.split('\n')
    const links = lines
      .slice(1)
      .map((line) => {
        if (line.toLowerCase().includes('#formulaire#')) {
          return `[mission transition écologique](${teeUrl})`
        }
        return line.substring(2) ?? ''
      })
      .filter((l): l is string => l !== null)

    return links.length > 0 ? links.join(' ; ') : undefined
  }

  _getEligibiliteEffectif(min?: number, max?: number): string {
    const hasMin = typeof min === 'number' && !isNaN(min)
    const hasMax = typeof max === 'number' && !isNaN(max)

    if (!hasMin && !hasMax) {
      return 'Toutes tailles'
    }

    const minStr = hasMin ? min.toString() : '0'
    const maxStr = hasMax ? max.toString() : 'Pas de taille maximale'

    return `${minStr} - ${maxStr}`
  }

  _mergeOperatorNames(operators1: Operator[] = [], operators2: Operator[] = []): string {
    return [...operators1, ...operators2]
      .map((op) => op.Nom)
      .filter(Boolean)
      .join(' ; ')
  }

  _mergeOperatorSiren(operators1: Operator[] = [], operators2: Operator[] = []): string {
    return [...operators1, ...operators2]
      .map((op) => {
        if (op.siren) {
          return op.siren
        }
        if (process.env['ENV'] == 'DEV') {
          return 'SIREN A CHERCHER ' + op.Nom
        }
        return ''
      })
      .filter(Boolean)
      .join(' ; ')
  }

  _getGeographicCoverage(coverage: GeographicCoverage, geographicAreas: GeographicAreas[] = []): string {
    if (coverage.Name === 'National') {
      return 'PAYS-99100'
    }
    return geographicAreas
      .map((area) => {
        const code = COG_MAPPING[area.Name]
        if (!code) {
          console.warn(`COG not found for geographic area: "${area.Name}"`)
        }
        return code
      })
      .filter((code): code is string => !!code)
      .join(';')
  }

  _getNafCodesFromSectors(baserowSectors: BaserowSectors): string {
    const selectedSectors = Object.keys(baserowSectors)
      .filter((key) => baserowSectors[key as keyof BaserowSectors])
      .map((key) => SectorKeys[key as keyof typeof SectorKeys])
      .filter((value) => value !== undefined)

    return selectedSectors.join('; ')
  }

  _formatDate(input?: string): string | undefined {
    if (!input) return undefined

    const date = new Date(input)
    if (isNaN(date.getTime())) return undefined

    const pad = (n: number) => n.toString().padStart(2, '0')

    const year = date.getFullYear()
    const month = pad(date.getMonth() + 1)
    const day = pad(date.getDate())
    const hour = pad(date.getHours())
    const minute = pad(date.getMinutes())

    return `${year}-${month}-${day}-${hour}-${minute}`
  }

  _getCurrentFormattedDate(): string {
    return new Date().toISOString().replace(/T|:/g, '-').slice(0, 16)
  }

  _parseExistenceFromText(text?: string): number | undefined {
    if (!text || !text.toLowerCase().includes('au moins')) return undefined

    const match = text.match(/au moins\s+(\d+|un)/i)
    if (!match) return undefined

    const value = match[1].toLowerCase()
    return value === 'un' ? 1 : parseInt(value, 10)
  }

  _checkSpecificStatus(text?: string): string | undefined {
    if (!text) return undefined

    const normalized = text.toLowerCase().trim()
    if (normalized === 'artisan' || normalized === 'réservée aux artisans') {
      return 'Artisan'
    }

    return undefined
  }
}
