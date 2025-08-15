import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import Config from '../../config'
import { DataProgram } from '../../program/types/domain'
import { MailType } from './types'

export default class BrevoMail {
  private readonly _programInProdNotification = 13
  private readonly _programSixMonthNotification = 14
  private readonly _programEolNotification = 15
  private _api = new TransactionalEmailsApi()

  private readonly _baseProdCatalogUrl = 'https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise/' // Bad Practice, to discuss with yohann
  private readonly _baseProdFormUrl = 'https://mission-transition-ecologique.beta.gouv.fr/ajouter-une-aide-entreprises/' // Bad Practice, to discuss with yohann

  constructor() {
    this._api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, Config.BREVO_API_TOKEN)
  }

  async sendInitialMail(program: DataProgram) {
    await this._sendMail(program, MailType.Initial)
  }

  async sendPeriodicMail(program: DataProgram) {
    await this._sendMail(program, MailType.Periodic)
  }

  async sendEolMail(program: DataProgram) {
    await this._sendMail(program, MailType.EndOfLife)
  }

  private async _sendMail(program: DataProgram, mailType: MailType): Promise<void> {
    try {
      await this._api.sendTransacEmail(this._createEmail(program, mailType))
    } catch (err: unknown) {
      console.log(err)
    }
  }

  private _createEmail(program: DataProgram, mailType: MailType) {
    if (!program.internalContact) {
      throw new Error('Program has no internal contact when contact validity has already been tested !')
    }

    const email = new SendSmtpEmail()

    if (mailType == MailType.Initial) {
      email.templateId = this._programInProdNotification
      email.params = {
        programName: program.Titre,
        programLink: this._baseProdCatalogUrl + program['Id fiche dispositif'],
        formLink: this._baseProdFormUrl
      }
    }
    if (mailType == MailType.Periodic) {
      email.templateId = this._programSixMonthNotification
      email.params = {
        programName: program.Titre,
        programLink: this._baseProdCatalogUrl + program['Id fiche dispositif']
      }
    }
    if (mailType == MailType.EndOfLife) {
      email.templateId = this._programEolNotification
      email.params = {
        programName: program.Titre,
        programLink: this._baseProdCatalogUrl + program['Id fiche dispositif'],
        programEndDate: program.DISPOSITIF_DATE_FIN,
        formLink: this._baseProdFormUrl
      }
    }

    email.sender = { id: Config.BREVO_SENDER_ID }
    email.to = [{ email: program.internalContact?.mail, name: program.internalContact?.name }]

    this._setHeaders(email)

    return email
  }

  private _setHeaders(email: SendSmtpEmail) {
    if (Config.BREVO_SANDBOX) {
      email.headers = { 'X-Sib-Sandbox': 'drop' }
    }
  }
}
