import { z } from 'zod'
import { CompanyDataRegisterType, EstablishmentFront, LegalCategory, NAF1, Region, StructureSize } from '@/types'

const RegionEnum = z.nativeEnum(Region)
const StructureSizeEnum = z.nativeEnum(StructureSize)
const codeNAF1Enum = z.nativeEnum(NAF1)

const LegalCategoryEnum = z.nativeEnum(LegalCategory)

const CompanyDataSchema: z.ZodType<EstablishmentFront> = z.object({
  siret: z.string().optional(),
  codeNAF: z.string(),
  codeNAF1: codeNAF1Enum,
  ville: z.string(),
  codePostal: z.string(),
  legalCategory: LegalCategoryEnum.or(z.string()).optional(),
  region: RegionEnum,
  structure_size: StructureSizeEnum.optional(),
  denomination: z.string().optional(),
  secteur: z.string(),
  creationDate: z.string().optional()
})

export class CompanyDataValidator {
  static validate(data: CompanyDataRegisterType) {
    if (!data) {
      return false
    }

    try {
      CompanyDataSchema.parse(data)
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
}
