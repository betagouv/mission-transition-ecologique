import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import { Result } from 'true-myth'
import Config from '../../../../config'
import { Program as ProgramType } from '../../../../program/domain/types'
import Program from '../../../../../../common/src/program/program'
import { MailRepository } from '../../../domain/spi'
import { Opportunity } from '../../../domain/types'

export default class BrevoMail {
  private readonly _templateReceipt = 11
  private _api = new TransactionalEmailsApi()

  constructor() {
    this._api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, Config.BREVO_API_TOKEN)
    this._setHeaders()
  }

  sendReturnReceipt: MailRepository['sendReturnReceipt'] = async (
    opportunity: Opportunity,
    program: ProgramType
  ): Promise<Result<void, Error>> => {
    const email = new SendSmtpEmail()

    email.templateId = this._templateReceipt
    email.sender = { id: Config.BREVO_SENDER_ID }
    email.to = [{ email: opportunity.email, name: this._getFullName(opportunity) }]
    email.params = {
      programName: program.titre,
      prefixedProgramName: Program.getPrefixedProgramName(program),
      programLink: opportunity.programUrl,
      programPromise: program.promesse,
      operatorName: program['opérateur de contact'],
      needs: opportunity.message,
      firstname: opportunity.firstName,
      lastname: opportunity.lastName,
      phone: opportunity.phoneNumber,
      siret: opportunity.companySiret,
      date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' })
    }

    try {
      await this._api.sendTransacEmail(email)

      return Result.ok(undefined)
    } catch (error: unknown) {
      return Result.err(error as Error)
    }
  }

  private _getFullName(opportunity: Opportunity) {
    return `${opportunity.firstName} ${opportunity.lastName}`
  }

  private _setHeaders() {
    if (Config.BREVO_SANDBOX) {
      this._api.defaultHeaders = { 'X-Sib-Sandbox': 'drop' }
    }
  }
}
