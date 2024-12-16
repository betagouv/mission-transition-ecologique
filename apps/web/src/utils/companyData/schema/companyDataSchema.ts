import { z } from 'zod'
import { EstablishmentFront, LegalCategory, ManualCompanyData, Region, Sector, StructureSize } from '@/types'

const RegionEnum = z.nativeEnum(Region)
type RegionEnum = z.infer<typeof RegionEnum>

const SectorEnum = z.nativeEnum(Sector)
type SectorEnum = z.infer<typeof SectorEnum>

const StructureSizeEnum = z.nativeEnum(StructureSize)
type StructureSizeEnum = z.infer<typeof StructureSizeEnum>

export const ManualCompanyDataSchema: z.ZodType<ManualCompanyData> = z.object({
  region: RegionEnum,
  secteur: SectorEnum,
  denomination: z.string(),
  structure_size: StructureSizeEnum.optional()
})

const LegalCategoryEnum = z.nativeEnum(LegalCategory)
type LegalCategoryEnum = z.infer<typeof LegalCategoryEnum>

export const SiretCompanyDataSchema: z.ZodType<EstablishmentFront> = z.object({
  siret: z.string(),
  codeNAF: z.string(),
  codeNAF1: z.string(),
  ville: z.string(),
  codePostal: z.string(),
  legalCategory: LegalCategoryEnum.or(z.string()),
  region: z.string(),
  structure_size: StructureSizeEnum,
  denomination: z.string(),
  secteur: z.string(),
  creationDate: z.string()
})
