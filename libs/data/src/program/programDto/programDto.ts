import fs from 'fs'
import * as yaml from 'js-yaml'
import { Logger } from '../../common/logger/logger'
import { LogLevel } from '../../common/logger/types'
import { SlugValidator } from '../../common/validators/slugValidator'
import { DataProgram, DataProgramType, Status, YamlImage } from '../types/domain'
import { EligibilityData, ProgramAidType } from '../types/shared'
import { validateExternalUrlLink } from './linksValidator'
import { setOperators } from './operatorsDto'
import { setObjectives } from './objectiveDto'
import { setEligibilityTexts } from './eligibilityTextDto'
import { ConditionalDataGenerator } from './conditionalDataDto'
import { LinkValidator } from '../../common/validators/linkValidator'
import { z } from 'zod'
import { EligibilityDto } from './eligibilityDto'
import { PublicodesGenerator } from './publicodesGenerator'

export class ProgramDto {
  valid = true
  programData: { [key: string]: unknown } = {}

  constructor(
    public rawProgram: DataProgram,
    public logger: Logger
  ) {}

  async process() {
    this._validateSlug()

    this._addSimpleField('titre', this.rawProgram.Titre, true)
    this._addSimpleField('metaTitre', this.rawProgram['Meta Titre'], false)
    this._addSimpleField('promesse', this.rawProgram.Promesse, true)
    this._addSimpleField('description', this.rawProgram['Description courte'], true)
    await LinkValidator.logInvalidLinks(
      this.rawProgram['Description courte'],
      this.logger,
      LogLevel.Minor,
      'Description courte',
      this.rawProgram['Id fiche dispositif'],
      this.rawProgram.id
    )
    this._addSimpleField('metaDescription', this.rawProgram['Meta Description'], false)
    this._addSimpleField('description longue', this.rawProgram['Description longue'])
    await LinkValidator.logInvalidLinks(
      this.rawProgram['Description longue'],
      this.logger,
      LogLevel.Minor,
      'Description longue',
      this.rawProgram['Id fiche dispositif'],
      this.rawProgram.id
    )
    this._addValidatedDateField('début de validité', this.rawProgram.DISPOSITIF_DATE_DEBUT)
    this._addValidatedDateField('fin de validité', this.rawProgram.DISPOSITIF_DATE_FIN)
    if (this.rawProgram.Statuts.includes(Status.InProdNotAvailable)) {
      this._addSimpleField('aide temporairement indisponible', 'oui')
    }
    this._addSimpleField('illustration', this._setIllustration())
    setOperators(this)
    await this._setContactQuestion()
    if (await validateExternalUrlLink(this)) {
      this._addSimpleField('url', this.rawProgram['URL externe'])
    }
    this._setProgramType()
    this._setFinancialData()
    if (this.rawProgram['Dispositif activable en autonomie']) {
      this.programData['activable en autonomie'] = 'oui'
    }
    await setObjectives(this)
    await setEligibilityTexts(this)
    this.programData['eligibilityData'] = new EligibilityDto().setEligibility(this)
    this.programData['publicodes'] = new PublicodesGenerator().generatePublicodes(this.programData['eligibilityData'] as EligibilityData)
    new ConditionalDataGenerator(this.rawProgram, this.logger).generate(this.programData)
    this.programData['id'] = this.rawProgram['Id fiche dispositif']
  }

  public get generatedData(): { [key: string]: unknown } {
    return this.programData
  }

  private _validateSlug() {
    if (!SlugValidator.validate(this.rawProgram['Id fiche dispositif'])) {
      this.logger.log(
        LogLevel.Critic,
        'Slug non valide, yaml non généré.',
        this.rawProgram['Id fiche dispositif'],
        this.rawProgram.id,
        'slug à corriger: ' + this.rawProgram['Id fiche dispositif']
      )
      this.valid = false
    }
  }

  private _addSimpleField(key: string, value: unknown, mandatory = false) {
    if (mandatory && !value) {
      this.logger.log(
        LogLevel.Critic,
        'champ obligatoire "' + key + '"manquant. Dispositif non mis en ligne ou à jour',
        this.rawProgram['Id fiche dispositif'],
        this.rawProgram.id
      )
      this.valid = false
      return
    }
    if (value && (!Array.isArray(value) || value.length > 0)) {
      this.programData[key] = value
    }
  }

  private async _setContactQuestion() {
    const rawData = this.rawProgram['Contact Question']

    const isEmail = z.string().email().safeParse(rawData).success
    const isForm = rawData === '#formulaire#'
    const isUrl = z.string().url().safeParse(rawData).success
    if (isForm) {
      this.programData['contact question'] = 'formulaire'
      return
    }
    if (isUrl) {
      this.programData['contact question'] = LinkValidator.forceHttps(rawData)
      if (!(await LinkValidator.isValidLink(rawData))) {
        this.logger.log(
          LogLevel.Major,
          `Lien invalide lors de la vérification automatique dans le champ "Contact Question". A vérifier manuellement avant mise en prod.`,
          this.rawProgram['Id fiche dispositif'],
          this.rawProgram.id,
          `[Lien cassé](${rawData})`
        )
      }
      return
    }
    if (isEmail) {
      this.programData['contact question'] = 'mailto:' + rawData
      return
    }
    this.logger.log(
      LogLevel.Critic,
      `Champ obligatoire "Contact Question" invalide ou manquant. Dispositif non mis en ligne ou à jour.`,
      this.rawProgram['Id fiche dispositif'],
      this.rawProgram.id
    )
  }

  private _setIllustration(): string {
    const oldImage = this._loadYamlImage(this.rawProgram['Id fiche dispositif'])

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

  private _loadYamlImage(oldProgramId: string): string | null {
    const filePath = 'programs/' + oldProgramId + '.yaml'
    try {
      const yamlContent = fs.readFileSync(filePath, 'utf8')
      const oldContent = yaml.load(yamlContent) as YamlImage
      return oldContent.illustration
    } catch {
      return null
    }
  }

  private _setProgramType() {
    let helpType = this.rawProgram["Nature de l'aide"].toLowerCase()
    if (helpType === 'financement-étude') {
      helpType = 'étude'
    }
    if (!Object.values(ProgramAidType).includes(helpType as ProgramAidType)) {
      this.logger.log(
        LogLevel.Critic,
        "type d'aide inconnue, dispositif non mis en ligne ou à jour",
        this.rawProgram['Id fiche dispositif'],
        this.rawProgram.id,
        this.rawProgram["Nature de l'aide"]
      )
      this.valid = false
    }
    this.programData["nature de l'aide"] = helpType
  }

  private _setFinancialData() {
    switch (this.rawProgram["Nature de l'aide"]) {
      case DataProgramType.Financing:
      case DataProgramType.FinancingStudy:
        this.programData['montant du financement'] = this.rawProgram["Montant de l'aide ou coût"]
        return
      case DataProgramType.Study:
      case DataProgramType.Training:
        this.programData["coût de l'accompagnement"] = this.rawProgram["Montant de l'aide ou coût"]
        this.programData["durée de l'accompagnement"] = this.rawProgram["Durée de l'aide"]
        return
      case DataProgramType.Loan:
        this.programData['montant du prêt'] = this.rawProgram["Montant de l'aide ou coût"]
        this.programData['durée du prêt'] = this.rawProgram["Durée de l'aide"]
        return
      case DataProgramType.TaxAdvantage:
        this.programData["montant de l'avantage fiscal"] = this.rawProgram["Montant de l'aide ou coût"]
        return
      default:
        this.logger.log(
          LogLevel.Critic,
          "Type d'aide non traitée dans les données financières, dispositif non mis en ligne ou à jour",
          this.rawProgram['Id fiche dispositif'],
          this.rawProgram.id,
          this.rawProgram["Nature de l'aide"]
        )
        this.valid = false
        return
    }
  }

  private _addValidatedDateField(key: 'début de validité' | 'fin de validité', value: string | undefined) {
    const fieldLabel = key
    const raw = value?.trim()
    if (!raw) {
      return
    }

    // Check format
    const formatRegex = /^\d{2}\/\d{2}\/\d{4}$/ // Required format: DD/MM/YYYY
    if (!formatRegex.test(raw)) {
      this.logger.log(
        LogLevel.Major,
        `Le champ "${fieldLabel}" est manquant ou mal formaté (attendu: JJ/MM/AAAA) et ne sera pas pris en compte.`,
        this.rawProgram['Id fiche dispositif'],
        this.rawProgram.id,
        `Valeur reçue : ${raw}`
      )
      return
    }

    // Check logical validity
    const [day, month, year] = raw.split('/').map(Number)
    const dateObj = new Date(year, month - 1, day)

    const isDateValid = dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day

    if (!isDateValid) {
      this.logger.log(
        LogLevel.Major,
        `Le champ "${fieldLabel}" contient une date invalide (n'existe pas dans le calendrier) et ne sera pas pris en compte.`,
        this.rawProgram['Id fiche dispositif'],
        this.rawProgram.id,
        `Valeur reçue : ${raw}`
      )
      return
    }

    this.programData[key] = raw
  }
}
