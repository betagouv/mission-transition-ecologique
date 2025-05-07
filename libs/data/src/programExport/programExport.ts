import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import { fileURLToPath } from 'url'
import { ProgramUtils } from '../program/programUtils'
import { schemaProgram } from './type' // assumed to be your SchemaType definition
import { DataProgram, GeographicAreas, GeographicCoverage, Operator } from '../program/types/domain'
import { ProgramBaserow } from '../common/baserow/programBaserow'
import { randomUUID } from 'crypto'
import { BaserowSectors, SectorKeys } from '../common/baserow/types'

export class ProgramExport {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputFilePath: string = path.join(this.__dirname, '../../static/programs.csv')

  async exportAsCsv(): Promise<void> {
    const programs = await new ProgramBaserow().getPrograms(false)

    const previousExportedPrograms = this._readPreviousCSV()

    const schemaPrograms: schemaProgram[] = programs.filter(ProgramUtils.isInProd).map((program) => {
      const previous = previousExportedPrograms.find((p) => p.nom === program.Titre) // Note : pas optimal mais ça semble trop de travail de faire mieux pour le nombre d'utilisations prévues du code.
      return this.convertFromDataTypeToSchemaType(program, previous)
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

  convertFromDataTypeToSchemaType(original: DataProgram, previousExport?: schemaProgram): schemaProgram {
    const schema: schemaProgram = {
      id_aide: previousExport?.id_aide || randomUUID(),
      nom: original.Titre,
      promesse: original.Promesse,
      description_courte: original['Description courte'],
      description_longue: original['Description longue'],
      debut_de_validite: original.DISPOSITIF_DATE_DEBUT,
      fin_de_validite: original.DISPOSITIF_DATE_FIN,
      url_source: original['URL externe'],
      illustration: undefined,
      thematique_aide: original['Thèmes Ciblés'].map((t) => 'écologie > ' + t.Nom).join(' ; '),
      etape_activation_1: this._getStepString(original.étape1),
      etape_activation_1_liens: this._generateStepLinks(original.étape1, original['Id fiche dispositif']),
      etape_activation_2: this._getStepString(original.étape2),
      etape_activation_2_liens: this._generateStepLinks(original.étape2, original['Id fiche dispositif']),
      etape_activation_3: this._getStepString(original.étape3),
      etape_activation_3_liens: this._generateStepLinks(original.étape3, original['Id fiche dispositif']),
      etape_activation_4: this._getStepString(original.étape4),
      etape_activation_4_liens: this._generateStepLinks(original.étape4, original['Id fiche dispositif']),
      etape_activation_5: this._getStepString(original.étape5),
      etape_activation_5_liens: this._generateStepLinks(original.étape5, original['Id fiche dispositif']),
      etape_activation_6: this._getStepString(original.étape6),
      etape_activation_6_liens: this._generateStepLinks(original.étape6, original['Id fiche dispositif']),
      contact_question: undefined,
      programme_aides: undefined,
      porteurs_aide: this._mergeOperatorNames(original['Opérateur de contact'], original['Autres opérateurs']),
      porteur_siren: this._mergeOperatorSiren(original['Opérateur de contact'], original['Autres opérateurs']),
      types_aides: original["Nature de l'aide"] || '',
      type_depense: undefined,
      montant_aide_ou_cout: original["Montant de l'aide ou coût"],
      duree_aide: original["Durée de l'aide"],
      beneficiaires_aide: 'Entreprises privées',
      eligibilite_geographique: this._getGeographicCoverage(
        original['Couverture géographique'],
        original['Zones géographiques'],
        original['Zones Spécifiques (géographie)']
      ),
      eligibilite_sectorielle: this._concatSectorAndNaf(original['Eligibilité Sectorielle'], original['Eligibilité Naf']),
      eligibilite_effectif: this._getEligibiliteEffectif(original.minEff, original.maxEff),
      eligibilite_autre: this._concatSpecificAndExistence(original['Eligibilité Spécifique'], original['Eligibilité Existence']),
      cible: this._getCibleFromSectors(original as BaserowSectors)
    }

    return schema
  }

  _getStepString(data: string) {
    if (!data) return ''

    const lines = data.split('\n')
    return lines[0]?.substring(2) ?? ''
  }

  _generateStepLinks(data: string, slug: string): string | undefined {
    if (!data) return ''
    const lines = data.split('\n')
    const links = lines
      .slice(1)
      .map((line) => {
        if (line.toLowerCase().includes('#formulaire#')) {
          return `[mission transition écologique](https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise/${slug})`
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

  _getGeographicCoverage(coverage: GeographicCoverage, geographicAreas: GeographicAreas[] = [], specificZones = ''): string {
    let result = coverage.Name === 'National' ? 'France entière' : geographicAreas.map((area) => area.Name).join(' ; ')

    if (specificZones) {
      result += ` ; ${specificZones}`
    }

    return result
  }

  private _concatSectorAndNaf(sector = '', naf = ''): string {
    return [sector, naf].filter(Boolean).join(' ; ')
  }

  private _concatSpecificAndExistence(specific = '', existence = ''): string {
    return [specific, existence].filter(Boolean).join(' ; ')
  }

  private _getCibleFromSectors(baserowSectors: BaserowSectors): string {
    const selectedSectors = Object.keys(baserowSectors)
      .filter((key) => baserowSectors[key as keyof BaserowSectors])
      .map((key) => SectorKeys[key as keyof typeof SectorKeys])
      .filter((value) => value !== undefined)

    return `'Secteurs Préférentiels de l'aide' : [${selectedSectors.join(', ')}]`
  }
}
