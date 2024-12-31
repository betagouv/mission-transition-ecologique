import { z } from 'zod'
import { CompanyDataRegisterType, EstablishmentFront, LegalCategory, ManualCompanyData, Region, StructureSize } from '@/types'

const RegionEnum = z.nativeEnum(Region)
const StructureSizeEnum = z.nativeEnum(StructureSize)

const ManualCompanyDataSchema: z.ZodType<ManualCompanyData> = z.object({
  region: RegionEnum,
  ville: z.string(),
  codePostal: z.string(),
  secteur: z.string(),
  codeNAF: z.string(),
  codeNAF1: z.string(),
  denomination: z.string(),
  structure_size: StructureSizeEnum.optional()
})

const LegalCategoryEnum = z.nativeEnum(LegalCategory)

const SiretCompanyDataSchema: z.ZodType<EstablishmentFront> = z.object({
  siret: z.string(),
  codeNAF: z.string(),
  codeNAF1: z.string(),
  ville: z.string(),
  codePostal: z.string(),
  legalCategory: LegalCategoryEnum.or(z.string()),
  region: RegionEnum.optional(),
  structure_size: StructureSizeEnum.optional(),
  denomination: z.string().optional(),
  secteur: z.string(),
  creationDate: z.string()
})

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
