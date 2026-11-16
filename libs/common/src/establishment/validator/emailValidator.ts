import { z } from 'zod'
import { OpportunityFieldMaxLength } from '../../opportunity/opportunityFieldMaxLength'

export class EmailValidator {
  // Single rule for the form and the API: the form must not accept an address that the API rejects
  static readonly schema = z.string().trim().max(OpportunityFieldMaxLength.email).email()

  static readonly validate = (email: string | undefined): boolean => {
    return this.schema.safeParse(email).success
  }
}
