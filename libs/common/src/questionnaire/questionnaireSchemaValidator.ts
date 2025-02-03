import { ThemeId } from '@tee/data'
import { z } from 'zod'
import { stringBoolean } from '../validator'
import { BuildingProperty, MobilityStatus, StructureSize, WasteManagementStatus, WasteSortingStatus, YesNo } from './types/types'

export const structureSizeSchema = z.nativeEnum(StructureSize)
export const themeIdSchema = z.nativeEnum(ThemeId)
export const buildingPropertySchema = z.nativeEnum(BuildingProperty)
export const mobilityStatusSchema = z.nativeEnum(MobilityStatus)
export const wasteManagementStatusSchema = z.nativeEnum(WasteManagementStatus)
export const wasteSortingStatusSchema = z.nativeEnum(WasteSortingStatus)
export const yesNoSchema = z.nativeEnum(YesNo)

export const questionnaireDataSchema = z.object({
  codeNaf: z.string().optional(),
  region: z.string().optional(),
  structure_size: structureSizeSchema.optional(),
  priority_objective: themeIdSchema.optional(),
  building_property: buildingPropertySchema.optional(),
  sustainable_mobility_objective: mobilityStatusSchema.optional(),
  wastes_management_objective: wasteManagementStatusSchema.optional(),
  wastes_sorting_objective: wasteSortingStatusSchema.optional(),
  wastes_materials_objective: yesNoSchema.optional(),
  water_reduction_objective: yesNoSchema.optional(),
  energy_reduction_objective: yesNoSchema.optional(),
  recently_audited: yesNoSchema.optional(),
  recent_audits: z.string().optional(),
  legalCategory: z.string().optional(),
  siret: z.string().optional(),
  codeNAF: z.string().optional(),
  codeNAF1: z.string().optional(),
  ville: z.string().optional(),
  codePostal: z.string().optional(),
  denomination: z.string().optional(),
  secteur: z.string().optional(),
  creationDate: z.string().optional(),
  onlyEligible: z.boolean().optional()
})

export const serverQuestionnaireDataSchema = questionnaireDataSchema.setKey('onlyEligible', stringBoolean.optional())
