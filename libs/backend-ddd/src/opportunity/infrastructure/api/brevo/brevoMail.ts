import { SendSmtpEmail, TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo'
import { Maybe } from 'true-myth'
import Config from '../../../../config'
import { MailerManager } from '../../../domain/spi'
import { ProgramType, Program, Project } from '@tee/data'
import { Opportunity, OpportunityType } from '@tee/common'

export default class BrevoMail {
  private readonly _programTemplateReceipt = 11
  private readonly _projectTemplateReceipt = 12
  private _api = new TransactionalEmailsApi()

  constructor() {
    this._api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, Config.BREVO_API_TOKEN)
  }

  sendReturnReceipt: MailerManager['sendReturnReceipt'] = async (
    opportunity: Opportunity,
    programOrProject: ProgramType | Project,
    opportunityType: OpportunityType
  ): Promise<Maybe<Error> | void> => {
    try {
      await this._api.sendTransacEmail(this._email(opportunity, programOrProject, opportunityType))
    } catch (error: unknown) {
      return Maybe.just(error as Error)
    }
  }

  private _email(opportunity: Opportunity, programOrProject: ProgramType | Project, opportunityType: OpportunityType) {
    const email = new SendSmtpEmail()

    switch (opportunityType) {
      case OpportunityType.Program:
        email.templateId = this._programTemplateReceipt
        email.params = this._paramsProgram(opportunity, programOrProject as ProgramType)
        break
      case OpportunityType.Project:
        email.templateId = this._projectTemplateReceipt
        email.params = this._paramsProject(opportunity, programOrProject as Project)
        break
    }
    email.sender = { id: Config.BREVO_SENDER_ID }
    email.to = [{ email: opportunity.email, name: this._getFullName(opportunity) }]

    this._setHeaders(email)

    return email
  }

  private _paramsProgram(opportunity: Opportunity, program: ProgramType) {
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
