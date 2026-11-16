import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import { Maybe } from 'true-myth'
import { OpportunityAssociatedData } from '../../../domain/opportunityAssociatedData'
import Config from '../../../../config'
import { MailerManager } from '../../../domain/spi'
import { ProgramType, ProgramNameFormatter } from '@tee/data'
import { Opportunity } from '@tee/common'
import Monitor from '../../../../common/domain/monitoring/monitor'
import { ensureError } from '../../../../common/domain/error/errors'

export default class BrevoMail {
  private readonly _programTemplateReceipt = 11
  private readonly _projectTemplateReceipt = 12
  // The custom project title is typed by the user: it is never echoed in the email sent to the given address (phishing)
  static readonly customProjectName = 'Projet sur mesure'
  private _api = new TransactionalEmailsApi()

  constructor() {
    this._api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, Config.BREVO_API_TOKEN)
  }

  sendReturnReceipt: MailerManager['sendReturnReceipt'] = async (
    opportunity: Opportunity,
    associatedData: OpportunityAssociatedData
  ): Promise<Maybe<Error> | void> => {
    try {
      await this._api.sendTransacEmail(this._email(opportunity, associatedData))
    } catch (err: unknown) {
      const error = ensureError(err)
      Monitor.exception(error, { email: this._email(opportunity, associatedData) })
      return Maybe.just(error)
    }
  }

  private _email(opportunity: Opportunity, associatedData: OpportunityAssociatedData) {
    const email = new SendSmtpEmail()

    if (associatedData.isProgram()) {
      email.templateId = this._programTemplateReceipt
      email.params = this._paramsProgram(associatedData.data)
    } else if (associatedData.isProject() || associatedData.isCustomProject()) {
      email.templateId = this._projectTemplateReceipt
      email.params = this._paramsProject(associatedData.isCustomProject() ? BrevoMail.customProjectName : associatedData.data.title)
    } else {
      throw new Error(`Unsupported Opportunity Type in brevo mail receipt`)
    }
    email.sender = { id: Config.BREVO_SENDER_ID }
    // The recipient name is not set: it would echo the first and last names typed by the user in the "To" header
    email.to = [{ email: opportunity.email }]

    this._setHeaders(email)

    return email
  }

  // Only our own data is sent to the templates: nothing typed by the user can be echoed in the email,
  // even if a template is changed later (phishing)
  private _paramsProgram(program: ProgramType) {
    return {
      programName: program.titre,
      prefixedProgramName: ProgramNameFormatter.getPrefixedProgramName(program),
      programPromise: program.promesse,
      operatorName: program['opérateur de contact'],
      date: this._date()
    }
  }

  private _paramsProject(projectName: string) {
    return {
      projectName: projectName,
      date: this._date()
    }
  }

  private _date() {
    return new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' })
  }

  private _setHeaders(email: SendSmtpEmail) {
    if (Config.BREVO_SANDBOX) {
      email.headers = { 'X-Sib-Sandbox': 'drop' }
    }
  }
}
