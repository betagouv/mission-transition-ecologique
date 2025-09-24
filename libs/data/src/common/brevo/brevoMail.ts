import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import Config from '../../config'
import { DataProgram, MailSenderInterface } from '../../program/types/domain'
import { MailType } from './types'

export default class BrevoMail implements MailSenderInterface {
  private readonly _programInProdNotification = 13
  private readonly _programSixMonthNotification = 14
  private readonly _programEolNotification = 15
  private _api = new TransactionalEmailsApi()

  private readonly _baseProdCatalogUrl = 'https://mission-transition-ecologique.beta.gouv.fr/aides-entreprise/' // TODO Bad Practice, to discuss with yohann
  private readonly _baseProdFormUrl = 'https://mission-transition-ecologique.beta.gouv.fr/ajouter-une-aide-entreprises/' // TODO Bad Practice, to discuss with yohann

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

    const baseParams = {
      programName: program.Titre,
      programLink: `${this._baseProdCatalogUrl}${program['Id fiche dispositif']}`
    }

    const email = new SendSmtpEmail()
    switch (mailType) {
      case MailType.Initial: {
        email.templateId = this._programInProdNotification
        email.params = {
          ...baseParams,
          formLink: this._baseProdFormUrl
        }
        break
      }
      case MailType.Periodic: {
        email.templateId = this._programSixMonthNotification
        email.params = {
          ...baseParams
        }
        break
      }
      case MailType.EndOfLife: {
        email.templateId = this._programEolNotification
        email.params = {
          ...baseParams,
          programEndDate: program.DISPOSITIF_DATE_FIN,
          formLink: this._baseProdFormUrl
        }
        break
      }
      default: {
        throw new Error(`Unsupported mail type: ${mailType}`)
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
