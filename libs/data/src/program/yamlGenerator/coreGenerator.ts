import fs from 'fs'
import * as yaml from 'js-yaml'
import { Logger } from '../../common/logger/logger'
import { LogLevel } from '../../common/logger/types'
import { SlugValidator } from '../../common/validators/slugValidator'
import { DataProgram, DataProgramType, Status, YamlImage } from '../types/domain'
import { ProgramAidType } from '../types/shared'
import { validateExternalUrlLink } from './linksValidator'
import { setOperators } from './operatorsGenerator'
import { PublicodesGenerator } from './publicodesGenerator'
import { setObjectives } from './objectiveGenerator'
import { setEligibility } from './eligibilityGenerator'
import { ConditionalDataGenerator } from './conditionalDataGenerator'

export class CoreGenerator {
  valid = true
  yamlContent: { [key: string]: unknown } = {}

  constructor(
    public program: DataProgram,
    public logger: Logger
  ) {}

  async process() {
    this._validateSlug()

    this._addSimpleField('titre', this.program.Titre, true)
    this._addSimpleField('promesse', this.program.Promesse, true)
    this._addSimpleField('description', this.program['Description courte'], true)
    this._addSimpleField('description longue', this.program['Description longue'])
    this._addSimpleField('début de validité', this.program.DISPOSITIF_DATE_DEBUT)
    this._addSimpleField('fin de validité', this.program.DISPOSITIF_DATE_FIN)
    if (this.program.Statuts.includes(Status.InProdNotAvailable)) {
      this._addSimpleField('aide temporairement indisponible', 'oui')
    }
    this._addSimpleField('illustration', this._setIllustration())
    setOperators(this)
    this._addSimpleField('contact question', this.program['Contact Question'])
    if (await validateExternalUrlLink(this)) {
      this._addSimpleField('url', this.program['URL externe'])
    }
    this._setProgramType()
    this._setFinancialData()
    if (this.program['Dispositif activable en autonomie']) {
      this.yamlContent['activable en autonomie'] = 'oui'
    }
    setObjectives(this)
    setEligibility(this)
    this.yamlContent['publicodes'] = new PublicodesGenerator(this.program).generatePublicodes()
    new ConditionalDataGenerator(this.program).generate(this.yamlContent)
  }

  public get generatedData(): { [key: string]: unknown } {
    return this.yamlContent
  }

  private _validateSlug() {
    if (!SlugValidator.validate(this.program['Id fiche dispositif'])) {
      this.logger.log(
        LogLevel.Critic,
        'Slug non valide, yaml non généré.',
        this.program['Id fiche dispositif'],
        this.program.id,
        'slug à corriger: ' + this.program['Id fiche dispositif']
      )
      this.valid = false
    }
  }

  private _addSimpleField(key: string, value: unknown, mandatory = false) {
    if (mandatory && !value) {
      this.logger.log(
        LogLevel.Critic,
        'champ obligatoire "' + key + '"manquant. Dispositif non mis en ligne ou à jour',
        this.program['Id fiche dispositif'],
        this.program.id
      )
      this.valid = false
      return
    }
    if (value && (!Array.isArray(value) || value.length > 0)) {
      this.yamlContent[key] = value
    }
  }

  private _setIllustration(): string {
    const oldImage = this._loadYamlImage(this.program['Id fiche dispositif'])

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
    let helpType = this.program["Nature de l'aide"].toLowerCase()
    if (helpType === 'financement-étude') {
      helpType = 'étude'
    }
    if (!Object.values(ProgramAidType).includes(helpType as ProgramAidType)) {
      this.logger.log(
        LogLevel.Critic,
        "type d'aide inconnue, dispositif non mis en ligne ou à jour",
        this.program['Id fiche dispositif'],
        this.program.id,
        this.program["Nature de l'aide"]
      )
      this.valid = false
    }
    this.yamlContent["nature de l'aide"] = helpType
  }

  private _setFinancialData() {
    switch (this.program["Nature de l'aide"]) {
      case DataProgramType.Financing:
      case DataProgramType.FinancingStudy:
        this.yamlContent['montant du financement'] = this.program["Montant de l'aide ou coût"]
        return
      case DataProgramType.Study:
      case DataProgramType.Training:
        this.yamlContent["coût de l'accompagnement"] = this.program["Montant de l'aide ou coût"]
        this.yamlContent["durée de l'accompagnement"] = this.program["Durée de l'aide"]
        return
      case DataProgramType.Loan:
        this.yamlContent['montant du prêt'] = this.program["Montant de l'aide ou coût"]
        this.yamlContent['durée du prêt'] = this.program["Durée de l'aide"]
        return
      case DataProgramType.TaxAdvantage:
        this.yamlContent["montant de l'avantage fiscal"] = this.program["Montant de l'aide ou coût"]
        return
      default:
        this.logger.log(
          LogLevel.Critic,
          "Type d'aide non traitée dans les données financières, dispositif non mis en ligne ou à jour",
          this.program['Id fiche dispositif'],
          this.program.id,
          this.program["Nature de l'aide"]
        )
        this.valid = false
        return
    }
  }
}
