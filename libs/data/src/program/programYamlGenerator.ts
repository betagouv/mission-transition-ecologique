import path from 'path'
import fs from 'fs'
import * as yaml from 'js-yaml'
import { Objective, Program, ProgramType, Status } from './types'
import { Baserow } from '../common/baserow/baserow'
import { PublicodesGenerator } from './publicodesGenerator'

export class ProgramYamlGenerator {
  outputDirectory: string = path.join(__dirname, '../../programs/')

  async createProgramYamls(): Promise<void> {
    // while working on the script, to avoid hitting Baserow API limits and to decrease our global impact, please cache locally the data : 
    // on the first run use getPrograms(false) then for all following call use getPrograms(true)
    const programs = await new Baserow(this.outputDirectory).getPrograms(false)

    programs.forEach((program) => {
      if (!program.Statuts.includes(Status.InProd)) {
        return
      }
      console.log('Working on program ' + program['Id fiche dispositif'])
      this._createProgramYaml(program)
    })
    return
  }

  private _loadOldYamlContent(oldProgramId:string) : Program | null{
    let filePath = 'programs/' + oldProgramId + '.yaml'
    try {
      const oldFileContent = fs.readFileSync(filePath, 'utf8')
      return yaml.load(oldFileContent) as Program
    } catch {}
    return null
  }

  private _createProgramYaml(program: Program) {    
    let oldData = this._loadOldYamlContent(program['Id fiche dispositif'])
    
    let yamlContent: { [key: string]: any } = {}

    const addField = (key: string, value: any) => {
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
    addField('illustration', this._setIllustration(oldData))
    addField('opérateur de contact', program['Opérateur de contact'][0].Nom)
    addField(
      'autres opérateurs',
      program['Autres opérateurs'].map((operator) => operator.Nom)
    )
    addField('url', program['URL externe'])
    addField("nature de l'aide", program["Nature de l'aide"].toLowerCase())
    this._setFinancialData(yamlContent, program)
    if (program['Dispositif activable en autonomie']) {
      addField('activable en autonomie', 'oui')
    }
    this._setObjectives(yamlContent, program)
    this._setEligibility(yamlContent, program)
    yamlContent['publicodes'] = new PublicodesGenerator(program).generatePublicodes()

    let yamlString = yaml.dump(yamlContent, { noArrayIndent: true })
    fs.writeFileSync('programs/' + program['Id fiche dispositif'] + '.yaml', yamlString, 'utf8')
  }

  private _setIllustration(oldData: any): string {
    if (oldData && oldData['illustration']) {
      return oldData['illustration']
    } else {
      return this._setRandomIllustration()
    }
  }

  private _setRandomIllustration(): any {
    const illustrations = ['images/TEE_energie_verte.png', 'images/TEE_ampoule.png', 'images/TEE_eolienne.png']
    return illustrations[Math.floor(Math.random() * 3)]
  }

  private _setFinancialData(fileContent: { [key: string]: any }, program: Program) {
    if (program["Nature de l'aide"] == ProgramType.Financing) {
      fileContent['montant du financement'] = program["Montant de l'aide"]
      return
    }
    if (program["Nature de l'aide"] == ProgramType.Accompagnement || program["Nature de l'aide"] == ProgramType.Training) {
      fileContent["coût de l'accompagnement"] = program['Coût reste à charge']
      fileContent["durée de l'accompagnement"] = program['Prestation (durée + étalement)']
      return
    }
    if (program["Nature de l'aide"] == ProgramType.Loan) {
      fileContent['durée du prêt'] = program['Prestation (durée + étalement)']
      fileContent['montant du prêt'] = `De ${program['MontantMin aide']} € à ${program['MontantMax aide']} €`
      return
    }
    if (program["Nature de l'aide"] == ProgramType.TaxAdvantage) {
      fileContent["montant de l'avantage fiscal"] = program["Montant de l'aide"]
      return
    }
    console.log("type d'aide non traitée dans les données financières")
    return
  }

  parseStep(step: string): Objective {
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

  private _setObjectives(fileContent: { [key: string]: any }, program: Program) {
    const objectifs: Objective[] = []

    for (let i = 1; i <= 6; i++) {
      const step = program[`étape${i}` as keyof typeof program] as string
      if (step) {
        objectifs.push(this.parseStep(step))
      }
    }
    fileContent['objectifs'] = objectifs
    return
  }

  private _setEligibility(fileContent: { [key: string]: any }, program: Program) {
    let eligibility_conditions: { [key: string]: any } = {
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
  private _setEligibilityYears(program: Program): any {
    if (program['Eligibilité Existence']) {
      return [program['Eligibilité Existence']]
    }
    return ['Éligible à toutes les entreprises']
  }

  private _setEligibilitySector(program: Program) {
    if (!program['Eligibilité Sectorielle']) {
      console.log('Eligibilité sectorielle manquante !')
    }
    if (program['Eligibilité Naf']){
      return [program['Eligibilité Sectorielle'], program['Eligibilité Naf']]
    }
    return [program['Eligibilité Sectorielle']]
  }
  private _setEligibilityGeography(program: Program) {
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

  private _setEligibilitySize(program: Program): string {
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

  private _setMicroEntreprise(program: Program) {
    if (program.microEntreprise == 'oui') {
      return 'Éligible aux micro-entreprises'
    }
    return 'Non éligible aux micro-entreprises'
  }

}