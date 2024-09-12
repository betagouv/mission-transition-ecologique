import path from 'path'
import fs from 'fs'
import * as yaml from 'js-yaml'
import { YamlObjective, DataProgram, DataProgramType, Status, YamlImage } from './types/domain'
import { ProgramBaserow } from '../common/baserow/programBaserow'
import { PublicodesGenerator } from './publicodesGenerator'
import { SlugValidator } from '../common/validators/slugValidator'

export class ProgramYamlGenerator {
  outputDirectory: string = path.join(__dirname, '../../programs/')

  async createProgramYamls(): Promise<void> {
    // while working on the script, to avoid hitting Baserow API limits and to decrease our global impact, please cache locally the data :
    // on the first run use getPrograms(false) then for all following call use getPrograms(true)
    const programs = await new ProgramBaserow().getPrograms(true)

    programs.forEach((program) => {
      if (!program.Statuts.includes(Status.InProd)) {
        return
      }
      console.log('Working on program ' + program['Id fiche dispositif'])
      if (!this._validateProgramData(program)) {
        return
      }
      this._createProgramYaml(program)
    })
    return
  }
  private _validateProgramData(program: DataProgram) {
    let valid = true
    if (!SlugValidator.validate(program['Id fiche dispositif'])) {
      valid = false
    }
    if (!valid) {
      console.log(program['Id fiche dispositif'] + 'not valid, not generating the associated yaml.')
    }
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
    this._setConditionnalData(yamlContent, program)

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
        console.log("type d'aide non traitée dans les données financières")
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
      eligibility_conditions["autres critères d'éligibilité"] = program['Eligibilité Spécifique']
        .split('\n')
        .map((criteria) => criteria.substring(2))
    }
    fileContent["conditions d'éligibilité"] = eligibility_conditions
    return
  }

  private _setEligibilityYears(program: DataProgram): string[] {
    if (program['Eligibilité Existence']) {
      return [program['Eligibilité Existence']]
    }
    return ['Éligible à toutes les entreprises']
  }

  private _setEligibilitySector(program: DataProgram) {
    if (!program['Eligibilité Sectorielle']) {
      console.log('Eligibilité sectorielle manquante !')
    }
    if (program['Eligibilité Naf']) {
      return [program['Eligibilité Sectorielle'], program['Eligibilité Naf']]
    }
    return [program['Eligibilité Sectorielle']]
  }
  private _setEligibilityGeography(program: DataProgram) {
    if (program['Couverture géographique'].Name == 'National') return ["France et territoires d'outre-mer"]

    if (program['Zones Spécifiques (géographie)']) {
      console.log('Zone géographique spécifique, YAML à modifier manuellement')
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

  private _setConditionnalData(yamlContent: { [key: string]: unknown }, program: DataProgram) {
    if (!program.conditionnalData || !program.conditionnalData.length) {
      return
    }

    const champsConditionnels: any = []
    program.conditionnalData.forEach((conditionnal) => {
      if (conditionnal['Type de condition'] != 'géographique') {
        console.log('Warning, type de donnée conditionnelle non gérée et donc non prise en compte')
        return
      }
      const conditionGeographique = conditionnal['valeur de la condition géographique']
      const champAModifier1 = conditionnal['Champ à modifier 1']
      const valeurDeRemplacement1 = conditionnal['Valeur 1']

      const uneDeCesConditions = conditionGeographique.map((region) => {
        return 'région = ' + region
      })

      const conditionnelEntry = {
        'une de ces conditions': uneDeCesConditions,
        [champAModifier1]: valeurDeRemplacement1
      }

      champsConditionnels.push(conditionnelEntry)
    })

    yamlContent['champs conditionnels'] = champsConditionnels
  }
}
