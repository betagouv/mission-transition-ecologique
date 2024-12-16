import { z } from 'zod'
import { CompanyDataRegisterType, EstablishmentFront } from '@/types'
import { ManualCompanyDataSchema, SiretCompanyDataSchema } from '@/utils/companyData/schema/companyDataSchema'

export class CompanyDataValidator {
  static validate(data: CompanyDataRegisterType) {
    if (!data) {
      return false
    }

    try {
      this._isEstablishmentFront(data) ? SiretCompanyDataSchema.parse(data) : ManualCompanyDataSchema.parse(data)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Missing required field in Company Data', error.issues[0])
      } else {
        console.error('Error validating Company Data', error)
      }
      return false
    }
  }

  private static _isEstablishmentFront(value: NonNullable<CompanyDataRegisterType>): value is EstablishmentFront {
    return 'siret' in value
  }
}
