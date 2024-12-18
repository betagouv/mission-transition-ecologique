import { z } from 'zod'
import { EstablishmentFront, LegalCategory, ManualCompanyData, Region, Sector, StructureSize } from '@/types'

const RegionEnum = z.nativeEnum(Region)
const SectorEnum = z.nativeEnum(Sector)
const StructureSizeEnum = z.nativeEnum(StructureSize)

export const ManualCompanyDataSchema: z.ZodType<ManualCompanyData> = z.object({
  region: RegionEnum,
  secteur: SectorEnum,
  denomination: z.string(),
  structure_size: StructureSizeEnum.optional()
})

const LegalCategoryEnum = z.nativeEnum(LegalCategory)

export const SiretCompanyDataSchema: z.ZodType<EstablishmentFront> = z.object({
  siret: z.string(),
  codeNAF: z.string(),
  codeNAF1: z.string(),
  ville: z.string(),
  codePostal: z.string(),
  legalCategory: LegalCategoryEnum.or(z.string()),
  region: RegionEnum.optional(),
  structure_size: StructureSizeEnum,
  denomination: z.string().optional(),
  secteur: z.string(),
  creationDate: z.string()
})
