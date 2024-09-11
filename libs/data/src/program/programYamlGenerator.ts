import path from 'path'
import fs from 'fs'
import * as yaml from 'js-yaml'
import { YamlObjective, DataProgram, DataProgramType, Status, YamlImage } from './types/domain'
import { ProgramBaserow } from '../common/baserow/programBaserow'
import { PublicodesGenerator } from './publicodesGenerator'
import { SlugValidator } from '../common/validators/slugValidator'
import axios from 'axios'

export class ProgramYamlGenerator {
  outputDirectory: string = path.join(__dirname, '../../programs/')

  async createProgramYamls(): Promise<void> {
    // while working on the script, to avoid hitting Baserow API limits and to decrease our global impact, please cache locally the data :
    // on the first run use getPrograms(false) then for all following call use getPrograms(true)
    const programs = await new ProgramBaserow().getPrograms(true)

    for (const program of programs) {
      if (!program.Statuts.includes(Status.InProd)) {
        continue
      }
      if (!(await this._validateProgramData(program))) {
        continue
      }
      this._createProgramYaml(program)
    }
    return
  }
  private async _validateProgramData(program: DataProgram) {
    let valid = true
    if (!SlugValidator.validate(program['Id fiche dispositif'])) {
      this._log(program['Id fiche dispositif'] + 'slug not valid, not generating the associated yaml.')
      valid = false
    }
    await this._validateLinks(program)
    return valid
  }

  private _loadYamlImage(oldProgramId: string): string | null {
    const filePath = 'programs/' + oldProgramId + '.yaml'
    try {
      const yamlContent = fs.readFileSync(filePath, 'utf8')
      const oldContent = yaml.load(yamlContent) as YamlImage
      return oldContent.illustration
    } catch {
      // known empty bloc, comment for the linter!
    }
    return null
  }

  private _createProgramYaml(program: DataProgram) {
    const yamlContent: { [key: string]: unknown } = {}

    const addField = (key: string, value: unknown) => {
      if (value && (!Array.isArray(value) || value.length > 0)) {
        yamlContent[key] = value
      }
    }

    addField('titre', program.Titre)
    addField('promesse', program.Promesse)
    addField('description', program['Description courte'])
    addField('description longue', program['Description longue'])
    addField('début de validité', program.DISPOSITIF_DATE_DEBUT)
    addField('fin de validité', program.DISPOSITIF_DATE_FIN)
    addField('illustration', this._setIllustration(program['Id fiche dispositif']))
    addField('opérateur de contact', program['Opérateur de contact'][0].Nom)
    addField(
      'autres opérateurs',
      program['Autres opérateurs'].map((operator) => operator.Nom)
    )
    addField('url', program['URL externe'])
    this._setProgramType(yamlContent, program)
    this._setFinancialData(yamlContent, program)
    if (program['Dispositif activable en autonomie']) {
      addField('activable en autonomie', 'oui')
    }
    this._setObjectives(yamlContent, program)
    this._setEligibility(yamlContent, program)
    yamlContent['publicodes'] = new PublicodesGenerator(program).generatePublicodes()

    const yamlString = yaml.dump(yamlContent)
    fs.writeFileSync('programs/' + program['Id fiche dispositif'] + '.yaml', yamlString, 'utf8')
  }
  private _setProgramType(fileContent: { [key: string]: unknown }, program: DataProgram) {
    let helpType = program["Nature de l'aide"].toLowerCase()
    if (helpType === 'financement-étude') {
      helpType = 'étude'
    }
    fileContent["nature de l'aide"] = helpType
  }

  private _setIllustration(programId: string): string {
    const oldImage = this._loadYamlImage(programId)

    if (oldImage) {
      return oldImage
    } else {
      return this._setRandomIllustration()
    }
  }

  private _setRandomIllustration(): string {
    const illustrations = ['images/TEE_energie_verte.png', 'images/TEE_ampoule.png', 'images/TEE_eolienne.png']
    return illustrations[Math.floor(Math.random() * 3)]
  }

  private _setFinancialData(fileContent: { [key: string]: unknown }, program: DataProgram) {
    switch (program["Nature de l'aide"]) {
      case DataProgramType.Financing:
      case DataProgramType.FinancingStudy:
        fileContent['montant du financement'] = program["Montant de l'aide ou coût"]
        return
      case DataProgramType.Study:
      case DataProgramType.Training:
        fileContent["coût de l'accompagnement"] = program["Montant de l'aide ou coût"]
        fileContent["durée de l'accompagnement"] = program["Durée de l'aide"]
        return
      case DataProgramType.Loan:
        fileContent['montant du prêt'] = program["Montant de l'aide ou coût"]
        fileContent['durée du prêt'] = program["Durée de l'aide"]
        return
      case DataProgramType.TaxAdvantage:
        fileContent["montant de l'avantage fiscal"] = program["Montant de l'aide ou coût"]
        return
      default:
        this._log(program['Id fiche dispositif'] + ": type d'aide non traitée dans les données financières")
        return
    }
  }

  private _parseStep(step: string): YamlObjective {
    const lines = step.split('\n')
    const description = lines[0].substring(2)

    const liens = lines
      .slice(1)
      .map((line) => {
        const match = line.match(/\[(.*?)\]\((.*?)\)/)
        if (match) {
          return { lien: match[2], texte: match[1] }
        }
        return null
      })
      .filter((link) => link !== null) as { lien: string; texte: string }[]

    return { description, liens: liens.length > 0 ? liens : undefined }
  }

  private _setObjectives(fileContent: { [key: string]: unknown }, program: DataProgram) {
    const objectifs: YamlObjective[] = []

    for (let i = 1; i <= 6; i++) {
      const step = program[`étape${i}` as keyof typeof program] as string
      if (step) {
        objectifs.push(this._parseStep(step))
      }
    }
    fileContent['objectifs'] = objectifs
    return
  }

  private _setEligibility(fileContent: { [key: string]: unknown }, program: DataProgram) {
    const eligibility_conditions: { [key: string]: string[] } = {
      "taille de l'entreprise": [this._setEligibilitySize(program), this._setMicroEntreprise(program)],
      'secteur géographique': this._setEligibilityGeography(program),
      "secteur d'activité": this._setEligibilitySector(program),
      "nombre d'années d'activité": this._setEligibilityYears(program)
    }
    if (program['Eligibilité Spécifique']) {
      const otherEligibilities = this._setOtherEligibilityCriteria(program)
      if (otherEligibilities.length) {
        eligibility_conditions["autres critères d'éligibilité"] = otherEligibilities
      }
    }
    fileContent["conditions d'éligibilité"] = eligibility_conditions
    return
  }

  private _setOtherEligibilityCriteria(program: DataProgram): string[] {
    const criteriaList = program['Eligibilité Spécifique'].split('\n').map((criteria) => criteria.trim())
    if (criteriaList.filter((criteria) => !criteria.startsWith('- ')).length) {
      this._log(program['Id fiche dispositif'] + ': problème de format du champ "éligibilité spécifique" qui doit être une liste !')
      return []
    }
    return criteriaList.map((criteria) => criteria.substring(2))
  }

  private _setEligibilityYears(program: DataProgram): string[] {
    if (program['Eligibilité Existence']) {
      return [program['Eligibilité Existence']]
    }
    return ['Éligible à toutes les entreprises']
  }

  private _setEligibilitySector(program: DataProgram) {
    if (!program['Eligibilité Sectorielle']) {
      this._log(program['Id fiche dispositif'] + ':Eligibilité sectorielle manquante !')
    }
    if (program['Eligibilité Naf']) {
      return [program['Eligibilité Sectorielle'], program['Eligibilité Naf']]
    }
    return [program['Eligibilité Sectorielle']]
  }
  private _setEligibilityGeography(program: DataProgram) {
    if (program['Couverture géographique'].Name == 'National') return ["France et territoires d'outre-mer"]

    if (program['Zones Spécifiques (géographie)']) {
      this._log(program['Id fiche dispositif'] + ': Zone géographique spécifique, YAML à modifier manuellement')
    }

    return [
      program['Zones géographiques']
        .map((geographicArea) => geographicArea.Name)
        .sort((a, b) => a.localeCompare(b, 'fr-FR'))
        .join(', ')
    ]
  }

  private _setEligibilitySize(program: DataProgram): string {
    if (program['Eligibilité Taille']) {
      return program['Eligibilité Taille']
    }
    const minimumStaff = program.minEff
    const maximumStaff = program.maxEff
    if (minimumStaff && maximumStaff) {
      return `Effectif compris entre ${minimumStaff} et ${maximumStaff} employés`
    } else if (minimumStaff) {
      return `Effectif supérieur à ${minimumStaff} employés`
    } else if (maximumStaff) {
      return `Effectif inférieur à ${maximumStaff} employés`
    } else {
      return 'Toutes tailles'
    }
  }

  private _setMicroEntreprise(program: DataProgram) {
    if (program.microEntreprise === 'oui') {
      return 'Éligible aux micro-entreprises'
    }
    return 'Non éligible aux micro-entreprises'
  }

  private async _validateLinks(program: DataProgram) {
    if (program['Id fiche dispositif'] == 'baisse-les-watts') return
    if (program['URL externe']) {
      if (!(await this._isValidLink(program['URL externe']))) {
        this._log(program['Id fiche dispositif'] + ': problème de validation du lien du champ URL externe')
      }
    }

    for (let i = 1; i <= 6; i++) {
      const step = program[`étape${i}` as keyof typeof program] as string
      if (step) {
        const objectives = this._parseStep(step)
        if (!objectives.liens) {
          continue
        }
        for (const lien of objectives.liens) {
          if (!(await this._isValidLink(lien.lien))) {
            this._log(program['Id fiche dispositif'] + ": problème de validation d'un lien du champ étape " + i)
          }
        }
      }
    }
  }

  private _exceptionLinks = [
    'https://www.baisseleswatts.fr/?mtm_campaign=missiontransitionecologique&mtm_source=missiontransitionecologique&mtm_medium=missiontransitionecologique&mtm_content=missiontransitionecologique',
    'https://www.cci.fr/ressources/developpement-durable/cfde/nos-formations',
    'https://www.impots.gouv.fr/sites/default/files/formulaires/2079-bio-sd/2024/2079-bio-sd_4636.pdf'
  ]

  private async _isValidLink(link: string) {
    if (this._exceptionLinks.includes(link)) {
      return true
    }
    try {
      const response = await axios.head(link, { timeout: 2000 })
      if (response.status === 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    } finally {
      // Add a 100ms delay
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  private _log(message: string): void {
    console.log(message)
    fs.appendFileSync('programYamlLog.log', message + '\n', { encoding: 'utf-8' })
  }
}
