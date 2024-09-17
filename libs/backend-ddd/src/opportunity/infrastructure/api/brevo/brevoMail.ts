import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import { Maybe } from 'true-myth'
import Config from '../../../../config'
import { MailerManager } from '../../../domain/spi'
import { ProgramTypeWithPublicode, Program, Project } from '@tee/data'
import { Opportunity, OpportunityType } from '@tee/common'
import Monitor from '../../../../common/domain/monitoring/monitor'
import { ensureError } from '../../../../common/domain/error/errors'

export default class BrevoMail {
  private readonly _programTemplateReceipt = 11
  private readonly _projectTemplateReceipt = 12
  private _api = new TransactionalEmailsApi()

  constructor() {
    this._api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, Config.BREVO_API_TOKEN)
  }

  sendReturnReceipt: MailerManager['sendReturnReceipt'] = async (
    opportunity: Opportunity,
    programOrProject: ProgramTypeWithPublicode | Project
  ): Promise<Maybe<Error> | void> => {
    try {
      await this._api.sendTransacEmail(this._email(opportunity, programOrProject))
    } catch (err: unknown) {
      const error = ensureError(err)
      Monitor.exception(error, { email: this._email(opportunity, programOrProject) })
      return Maybe.just(error)
    }
  }

  private _email(opportunity: Opportunity, programOrProject: ProgramTypeWithPublicode | Project) {
    const email = new SendSmtpEmail()

    switch (opportunity.type) {
      case OpportunityType.Program:
        email.templateId = this._programTemplateReceipt
        email.params = this._paramsProgram(opportunity, programOrProject as ProgramTypeWithPublicode)
        break
      case OpportunityType.Project:
        email.templateId = this._projectTemplateReceipt
        email.params = this._paramsProject(opportunity, programOrProject as Project)
        break
      default:
        throw new Error(`Unsupported Opportunity Type in brevo mail receipt`)
    }
    email.sender = { id: Config.BREVO_SENDER_ID }
    email.to = [{ email: opportunity.email, name: this._getFullName(opportunity) }]

    this._setHeaders(email)

    return email
  }

  private _paramsProgram(opportunity: Opportunity, program: ProgramTypeWithPublicode) {
    return {
      programName: program.titre,
      prefixedProgramName: Program.getPrefixedProgramName(program),
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

  private _paramsProject(opportunity: Opportunity, project: Project) {
    return {
      projectName: project.title,
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
