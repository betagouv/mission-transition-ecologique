import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { fileURLToPath } from 'url'
import { ProgramUtils } from '../program/programUtils'
import { Cible, COG_MAPPING, DataProgramTypeToTypeAide, Porteur, PorteurRole, schemaProgram, SchemaProgramCsv } from './type'
import { DataProgram, GeographicAreas, GeographicCoverage, Operator } from '../program/types/domain'
import { ProgramBaserow } from '../common/baserow/programBaserow'
import { randomUUID, UUID } from 'crypto'
import { BaserowSectors, SectorKeys } from '../common/baserow/types'
import { Logger } from '../common/logger/logger'
import { LoggerType } from '../common/logger/types'
import { ProjectBaserow } from '../common/baserow/projectBaserow'
import { DataProject } from '../project/types/domain'

export class ProgramExport {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputFilePath: string = path.join(this.__dirname, '../../static/data_gouv_export.csv')
  private readonly _teeBaseUrl = 'https://mission-transition-ecologique.beta.gouv.fr'
  private readonly _dataGouvUtm = '?utm_campaign=openData'

  async exportAsCsv(): Promise<void> {
    const programs = await new ProgramBaserow().getPrograms(true) //TODO remove true which use local cached data
    const projects = await new ProjectBaserow('', new Logger(LoggerType.Project)).getProdProjects(false)

    const previousExportedPrograms = this._readPreviousCSV()

    const schemaPrograms: schemaProgram[] = programs
      .filter((program) => ProgramUtils.isInProd(program))
      .map((program) => {
        const previous = previousExportedPrograms.find((p) => p.titre === program.Titre) // Note : pas optimal,
        // ne prend pas en compte les renommages
        // mais ça semble trop de travail de faire mieux pour le nombre d'utilisations prévues du code.
        return this._convertFromDataTypeToSchemaType(program, projects, previous?.id as UUID)
      })

    const csvString = this._flattenProgramsAndCreateCsv(schemaPrograms)
    fs.writeFileSync(this._outputFilePath, csvString, 'utf-8')
  }

  private _readPreviousCSV(): SchemaProgramCsv[] {
    if (!fs.existsSync(this._outputFilePath)) {
      return []
    }

    const content = fs.readFileSync(this._outputFilePath, 'utf-8')
    const records: SchemaProgramCsv[] = parse(content, {
      columns: true,
      skip_empty_lines: true
    })
    return records
  }

  private _convertFromDataTypeToSchemaType(original: DataProgram, projects: DataProject[], previousId?: UUID): schemaProgram {
    const schema: schemaProgram = {
      id: previousId || randomUUID(),
      titre: original.Titre,
      promesse: original.Promesse,
      description: this._createDescription(original, projects),
      eligibilite: this._createEligibility(original),
      types_aides: DataProgramTypeToTypeAide[original["Nature de l'aide"]],
      porteurs: this._formatOperators(original['Opérateur de contact'], original['Autres opérateurs']),
      url_source: `${this._teeBaseUrl}/aides-entreprise/${original['Id fiche dispositif']}${this._dataGouvUtm}`,
      cibles: [Cible.Professionnels],
      eligibilite_geographique: this._getGeographicCoverage(original['Couverture géographique'], original['Zones géographiques']),
      date_ouverture: this._formatDate(original.DISPOSITIF_DATE_DEBUT),
      date_cloture: this._formatDate(original.DISPOSITIF_DATE_FIN),
      date_mise_a_jour: this._getCurrentFormattedDate()
    }

    return schema
  }

  private _flattenProgramsAndCreateCsv(schemaPrograms: schemaProgram[]): string {
    const schemaFieldOrder: (keyof SchemaProgramCsv)[] = [
      'id',
      'titre',
      'promesse',
      'description',
      'eligibilite',
      'types_aides',
      'porteurs',
      'programmes_parents',
      'url_source',
      'cibles',
      'eligibilite_geographique',
      'eligibilite_geographique_exclusions',
      'date_ouverture',
      'date_cloture',
      'date_mise_a_jour'
    ]

    const csvPrograms = schemaPrograms.map((program) => ({
      ...program,
      types_aides: this._joinOrEmpty(program.types_aides),
      porteurs: JSON.stringify(program.porteurs),
      cibles: this._joinOrEmpty(program.cibles),
      eligibilite_geographique: this._joinOrEmpty(program.eligibilite_geographique),
      eligibilite_geographique_exclusions: '',
      programmes_parents: ''
    }))

    const reorderedPrograms = csvPrograms.map((row) => schemaFieldOrder.map((fieldName) => row[fieldName] ?? ''))
    reorderedPrograms.unshift(schemaFieldOrder)
    return stringify(reorderedPrograms, { columns: schemaFieldOrder, quoted: true, quoted_empty: true })
  }

  private _joinOrEmpty(value?: string[] | string): string {
    if (!value) {
      return ''
    }
    return Array.isArray(value) ? value.join('|') : value
  }

  private _formatOperators(operators1: Operator[], operators2: Operator[]): Porteur[] {
    const tempMap = new Map<number, Porteur>()

    for (const op of operators1) {
      op.siren === undefined && console.log(`WARNING, Missing siren: ${op.Nom}`)
      tempMap.set(op.id, {
        nom: op.Nom,
        siren: op.siren,
        roles: [PorteurRole.Instructeur, PorteurRole.Diffuseur]
      })
    }

    for (const op of operators2) {
      op.siren === undefined && console.log(`WARNING, Missing siren: ${op.Nom}`)
      if (tempMap.has(op.id)) {
        const existing = tempMap.get(op.id)
        if (!existing) {
          tempMap.set(op.id, {
            nom: op.Nom,
            siren: op.siren,
            roles: [PorteurRole.Diffuseur]
          })
        }
      }
    }

    return Array.from(tempMap.values())
  }

  private _getGeographicCoverage(coverage: GeographicCoverage, geographicAreas: GeographicAreas[] = []): string[] {
    if (coverage.Name === 'National') {
      return ['PAYS-99100']
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
  }

  private _formatDate(input?: string): string | undefined {
    if (!input) {
      return undefined
    }

    const date = new Date(input)
    if (isNaN(date.getTime())) {
      return undefined
    }

    return date.toISOString()
  }

  private _getCurrentFormattedDate(): string {
    return new Date().toISOString()
  }

  private _createDescription(program: DataProgram, projects: DataProject[]): string {
    const lines: string[] = []

    lines.push(program['Description courte'])

    lines.push(`Projets liés au dispositif d'aide :\n` + this._getProjectList(program['Id fiche dispositif'], projects))

    lines.push(`Montant de l'aide ou cout: ${program["Montant de l'aide ou coût"]}`)
    if (program["Durée de l'aide"]) {
      lines.push(`Durée de l'aide: ${program["Durée de l'aide"]}`)
    }
    const conditionalText = this._getConditionalEligibilityText(program)
    if (conditionalText) {
      lines.push(conditionalText)
    }
    if (program['Dispositif activable en autonomie']) {
      lines.push('Ce dispositif est activable en autonomie')
    }
    lines.push(`Contact public pour les questions sur le dispositif: ` + this._getContact(program))
    lines.push(this._generateActivationStepText(program))

    lines.push(`Lien externe de présentation de l'aide ${program['URL externe']}`)
    // commented cause too long if used
    // if (program['Description longue']) {
    //   lines.push(`Description plus détaillée:\n ${program['Description longue']}`)
    // }
    return lines.join('\n\n')
  }

  private _getProjectList(programSlug: string, projects: DataProject[]): string {
    return projects
      .filter((project) => project.programs.includes(programSlug))
      .map((project) => `${project.title}`)
      .join('\n')
  }

  private _getContact(program: DataProgram) {
    if (program['Contact Question'].includes('formulaire')) {
      return `${this._teeBaseUrl}/aides-entreprise/${program['Id fiche dispositif']}${this._dataGouvUtm}`
    } else {
      return program['Contact Question']
    }
  }

  private _getConditionalEligibilityText(program: DataProgram): string | undefined {
    const data = program.conditionalData
    if (!data || data.length === 0) {
      return undefined
    }

    const hasRegion = data.some((c) => c['Type de condition'] === 'géographique')
    const hasCompanySize = data.some((c) => c['Type de condition'] === 'nombre de salariés')

    if (hasRegion && hasCompanySize) {
      return "Le montant, le coût ou la durée de l'aide peuvent varier en fonction de la région et de la taille de l'entreprise"
    } else if (hasRegion) {
      return "Le montant, le coût ou la durée de l'aide peuvent varier en fonction de la région de l'entreprise"
    } else if (hasCompanySize) {
      return "Le montant, le coût ou la durée de l'aide peuvent varier en fonction de la taille de l'entreprise"
    }

    return undefined
  }

  private _generateActivationStepText(program: DataProgram): string {
    const fieldNames = ['étape1', 'étape2', 'étape3', 'étape4', 'étape5', 'étape6'] as const
    let resultString = 'Etapes pour activer le dispositif :\n'

    for (const fieldName of fieldNames) {
      const stepValue = program[fieldName as keyof DataProgram] as string | undefined
      if (stepValue) {
        resultString += this._getStepString(stepValue) + '\n'

        const textLink = this._generateStepLinks(
          stepValue,
          `${this._teeBaseUrl}/aides-entreprise/${program['Id fiche dispositif']}${this._dataGouvUtm}`
        )

        if (textLink) {
          resultString += `Liens liés à l'étape : ${textLink}\n`
        }
      }
    }

    return resultString
  }

  private _getStepString(data: string) {
    if (!data) {
      return ''
    }

    const lines = data.split('\n')
    return lines[0]?.substring(2) ?? ''
  }

  private _generateStepLinks(data: string, teeUrl: string): string | undefined {
    if (!data) {
      return ''
    }
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

    return links.length > 0 ? links.join(' | ') : undefined
  }

  private _createEligibility(program: DataProgram): string {
    const lines: string[] = []

    lines.push(`Eligibilité Sectorielle : ${program['Eligibilité Sectorielle']}`)
    lines.push(`Secteurs principalement concernés par le dispositif : ${this._getNafCodesFromSectors(program)}`)
    if (program['Eligibilité Naf']) {
      lines.push(`Précisions sur l'éligibilité sectorielle : ${program['Eligibilité Naf']}`)
    }

    lines.push(`Eligibilité en fonction du nombre de salariés: ${this._getEligibiliteEffectif(program.minEff, program.maxEff)}`)
    if (program['Eligibilité Existence']) {
      lines.push(`Eligibilité lié à la durée d'existence de l'entreprise : ${program['Eligibilité Existence']}`)
    }
    if (program.microEntrepreneur === 'non') {
      lines.push('Non éligible aux micro entreprises')
    }
    if (program['Couverture géographique'].Name !== 'National') {
      lines.push(`Aires géographiques éligibles : ${program['Zones géographiques'].map((area) => area.Name).join(', ')}`)
    }
    if (program['Eligibilité Spécifique']) {
      lines.push(`\n Autres conditions d'éligibilité :\n${program['Eligibilité Spécifique']}`)
    }

    return lines.join('\n')
  }

  private _getEligibiliteEffectif(min?: number, max?: number): string {
    const hasMin = typeof min === 'number' && !isNaN(min)
    const hasMax = typeof max === 'number' && !isNaN(max)

    if (!hasMin && !hasMax) {
      return 'Toutes tailles'
    }

    const minStr = hasMin ? min.toString() : '0'
    const maxStr = hasMax ? max.toString() : 'Pas de taille maximale'

    return `${minStr} - ${maxStr}`
  }

  private _getNafCodesFromSectors(baserowSectors: BaserowSectors): string {
    const selectedSectors = Object.keys(baserowSectors)
      .filter((key) => baserowSectors[key as keyof BaserowSectors])
      .map((key) => SectorKeys[key as keyof typeof SectorKeys])
      .filter((value) => value !== undefined)

    return selectedSectors.join('|')
  }
}
