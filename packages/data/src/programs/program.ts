import path from 'path'
import fs from 'fs'
import * as yaml from 'js-yaml'
import { Baserow } from '../common/baserow/baserow'
import { Program, ProgramType, Publicodes, Status } from './types'
import { ThemeType } from '../common/baserow/types'

interface Step {
  description: string
  liens?: { lien: string; texte: string }[]
}

interface Output {
  objectifs: Step[]
}

export class ProgramYamlGenerator {
  outputDirectory: string = path.join(__dirname, '../../programs/')

  async createProgramYamls(): Promise<void> {
    const programs = await new Baserow(this.outputDirectory).getPrograms()
    // // fs.writeFileSync('program_tmp.json', JSON.stringify(programs, null, 2))
    // const data = fs.readFileSync('program_tmp.json', 'utf-8')
    // const programs: Program[] = JSON.parse(data)
    const selectPrograms = programs.slice(0, 10)
    selectPrograms.forEach((program) => {
      if (!program.Statuts.includes(Status.InProd)) {
        return
      }
      console.log('Working on program ' + program['Id fiche dispositif'])
      // this._validateData(program)
      this._writeYaml(program)
    })
    return
  }

  private _validateData(program: Program) {
    console.log('validate program todo', program)
  }

  private _writeYaml(program: Program) {
    let filePath = 'programs/' + program['Id fiche dispositif'] + '.yaml'
    let yamlOldData: any
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      yamlOldData = yaml.load(fileContents)
    } catch {}

    let fileContent: { [key: string]: any } = {}

    const addField = (key: string, value: any) => {
      if (value && (!Array.isArray(value) || value.length > 0)) {
        fileContent[key] = value
      }
    }
    addField('titre', program.Titre)
    addField('promesse', program.Promesse)
    addField('description', program['Description courte'])
    addField('description longue', program['Description longue'])
    addField('début de validité', program.DISPOSITIF_DATE_DEBUT)
    addField('fin de validité', program.DISPOSITIF_DATE_FIN)
    if (yamlOldData && yamlOldData['illustration']) {
      fileContent['illustration'] = yamlOldData['illustration']
    } else {
      fileContent['illustration'] = this._setRandomIllustration()
    }
    addField('opérateur de contact', program['Opérateur de contact'][0].Nom)
    addField(
      'autres opérateurs',
      program['Autres opérateurs'].map((operator) => operator.Nom)
    )
    addField('url', program['URL externe'])
    addField("nature de l'aide", program["Nature de l'aide"].toLowerCase())
    this._setFinancialData(fileContent, program)
    if (program['Dispositif activable en autonomie']) {
      fileContent['activable en autonomie'] = 'oui'
    }
    this._setObjectives(fileContent, program)
    this._setEligibility(fileContent, program)
    this._setPublicodes(fileContent, program)

    const yamlStr = yaml.dump(fileContent, { noArrayIndent: true })
    fs.writeFileSync(filePath, yamlStr, 'utf8')
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
      fileContent['montant du prêt'] = `De ${program['MontantMin aide']} € à ${program['MontantMax aide']} €` // TODO CLEAN VALUES
      return
    }
    if (program["Nature de l'aide"] == ProgramType.TaxAdvantage) {
      fileContent["montant de l'avantage fiscal"] = program["Montant de l'aide"]
      return
    }
    console.log("type d'aide non traitée dans les données financières")
    return
  }

  parseStep(step: string): Step {
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
    const objectifs: Step[] = []

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
    if (program.microEntreprise) {
      return 'Éligible aux micro-entreprises'
    }
    return 'Non éligible aux micro-entreprises'
  }

  private _setPublicodes(fileContent: { [key: string]: any }, program: Program) {
    let publicodes: any = {}
    let cibles: string[] = []
    let eligibility: any = {}
    let eligibilityConditions: any = []
    publicodes[Publicodes.CIBLE] = { [Publicodes.ALL]: cibles }

    if (program.DISPOSITIF_DATE_DEBUT || program.DISPOSITIF_DATE_FIN) {
      if (program.DISPOSITIF_DATE_DEBUT && program.DISPOSITIF_DATE_FIN) {
        eligibility['applicable si'] = {
          [Publicodes.ALL]: ['dispositif . début de validité <= date du jour', 'date du jour <= dispositif . fin de validité']
        }
      } else if (program.DISPOSITIF_DATE_DEBUT) {
        eligibility['applicable si'] = 'dispositif . début de validité <= date du jour'
      } else {
        eligibility['applicable si'] = 'date du jour <= dispositif . fin de validité'
      }
    }

    if (this._pcEffectif(program)) {
      eligibilityConditions.push('a un effectif éligible')
    }
    if (program['Couverture géographique'].Name != 'National') {
      eligibilityConditions.push(Publicodes.ZONE_GEO) // TOFIX : mistake in original script; check consequences
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

    if (this._pcEffectif(program)) {
      publicodes[Publicodes.EFFECTIF] = this._pcEffectif(program)
    }

    if (this._pcSector(program)) {
      publicodes[Publicodes.SECTEUR] = this._pcSector(program)
      cibles.push("est dans un secteur d'activité ciblé")
    }

    if (this._pcObjectif(program)) {
      publicodes[Publicodes.OBJECTIF] = this._pcObjectif(program)
      cibles.push('a un objectif ciblé')
    }

    // pc_regions
    if (program['Couverture géographique'].Name == 'Régional') {
      publicodes[Publicodes.ZONE_GEO] = {
        [Publicodes.ANY]: program['Zones géographiques'].map((zone) => `région = ${zone.Name}`).sort((a, b) => a.localeCompare(b, 'fr-FR'))
      }
    }

    if (!program['Parcours "Je ne sais pas par où commencer"']) {
      cibles.push('questionnaire . parcours = objectif précis')
    }

    if (program.Propriétaire && program.Propriétaire != '*') {
      cibles.push(Publicodes.PROPRIO)
    }

    fileContent['publicodes'] = publicodes
    return
  }
  private _pcObjectif(program: Program) {
    const programThemes = program['Thèmes Ciblés']
    const themeToPublicodesMapping = {
      [ThemeType.Building]: 'est rénover mon bâtiment',
      [ThemeType.Mobility]: 'est la mobilité durable',
      [ThemeType.Waste]: 'est la gestion des déchets',
      [ThemeType.Water]: "est diminuer ma consommation d'eau",
      [ThemeType.Energy]: 'est ma performance énergétique',
      [ThemeType.RH]: 'est former ou recruter',
      [ThemeType.Environmental]: 'est mon impact environnemental',
      [ThemeType.EcoDesign]: "est l'écoconception"
    }

    if (!programThemes) {
      return null
    }
    return {
      [Publicodes.ANY]: programThemes.map(
        (theme) => 'questionnaire . objectif prioritaire . ' + themeToPublicodesMapping[theme['Nom (Tech)']]
      )
    }
  }

  private _pcSector(program: Program) {
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

    const programNaf: string[] = []
    secteurs.forEach((sector) => {
      if (program[sector as keyof typeof program] == 1) {
        programNaf.push(sector[0])
      }
    })
    if (programNaf.length) {
      return {
        'une de ces conditions': programNaf.map((nafCode) => `code NAF niveau 1 . est ${nafCode}`)
      }
    }
    return null
  }

  private _pcEffectif(program: Program) {
    if (program.minEff > 0 || program.maxEff) {
      let constraint = []
      if (program.minEff > 0) {
        constraint.push(`effectif >= ${program.minEff}`)
      }
      if (program.maxEff) {
        constraint.push(`effectif <= ${program.maxEff}`)
      }
      if (constraint) {
        return {
          [Publicodes.ALL]: constraint
        }
      }
    }
    return null
  }
}
