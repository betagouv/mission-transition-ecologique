import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import { Maybe } from 'true-myth'
import { OpportunityAssociatedData } from '../../../domain/opportunityAssociatedData'
import Config from '../../../../config'
import { MailerManager } from '../../../domain/spi'
import { ProgramType, ProgramNameFormatter, ProjectType } from '@tee/data'
import { Opportunity } from '@tee/common'
import Monitor from '../../../../common/domain/monitoring/monitor'
import { ensureError } from '../../../../common/domain/error/errors'
import { CustomProject } from '../../../domain/types'

export default class BrevoMail {
  private readonly _programTemplateReceipt = 11
  private readonly _projectTemplateReceipt = 12
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
      email.params = this._paramsProgram(opportunity, associatedData.data)
    } else if (associatedData.isProject() || associatedData.isCustomProject()) {
      email.templateId = this._projectTemplateReceipt
      email.params = this._paramsProject(opportunity, associatedData.data)
    } else {
      throw new Error(`Unsupported Opportunity Type in brevo mail receipt`)
    }
    email.sender = { id: Config.BREVO_SENDER_ID }
    email.to = [{ email: opportunity.email, name: this._getFullName(opportunity) }]

    this._setHeaders(email)

    return email
  }

  private _paramsProgram(opportunity: Opportunity, program: ProgramType) {
    return {
      programName: program.titre,
      prefixedProgramName: ProgramNameFormatter.getPrefixedProgramName(program),
      programLink: opportunity.linkToPage,
      programPromise: program.promesse,
      operatorName: program['opérateur de contact'],
      needs: opportunity.message,
      firstname: opportunity.firstName,
      lastname: opportunity.lastName,
      phone: opportunity.phoneNumber,
      siret: opportunity.companySiret,
      date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' })
    }
  }

  private _paramsProject(opportunity: Opportunity, data: ProjectType | CustomProject) {
    return {
      projectName: data.title,
      needs: opportunity.message,
      firstname: opportunity.firstName,
      lastname: opportunity.lastName,
      phone: opportunity.phoneNumber,
      siret: opportunity.companySiret,
      date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'numeric', day: 'numeric' })
    }
  }

  private _getFullName(opportunity: Opportunity) {
    return `${opportunity.firstName} ${opportunity.lastName}`
  }

  private _setHeaders(email: SendSmtpEmail) {
    if (Config.BREVO_SANDBOX) {
      email.headers = { 'X-Sib-Sandbox': 'drop' }
    }
  }
}
