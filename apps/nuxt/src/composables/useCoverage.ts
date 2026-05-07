import { computed, type Ref } from 'vue'
import { coverage, jsonPrograms } from '@tee/data/static'
import { StructureSize, SizeToWorkforce } from '@tee/common'
import type { CoverageProgram, CoverageProject } from '@tee/data/src/coverage/types'

/** Operator lookup by program id, built from the full programs dataset */
const operatorByProgramId = new Map<string, string>(
  jsonPrograms.map((p) => [p.id as string, ((p as Record<string, unknown>)['opérateur de contact'] as string) ?? ''])
)

export function getOperator(programId: string): string {
  return operatorByProgramId.get(programId) ?? ''
}

/** Unique sorted list of operators across all coverage programs */
export const ALL_OPERATORS: string[] = [
  ...new Set(coverage.programs.map((p) => getOperator(p.id)).filter(Boolean))
].sort((a, b) => a.localeCompare(b, 'fr'))

export const METRO_REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  "Provence-Alpes-Côte d'Azur"
]

export const OVERSEAS_REGIONS = ['Guadeloupe', 'Guyane', 'La Réunion', 'Martinique', 'Mayotte']

export const ALL_REGIONS = [...METRO_REGIONS, ...OVERSEAS_REGIONS]

/** Aid types we consider "standard" for coverage gap analysis */
export const STANDARD_AID_TYPES = ['étude', 'financement', 'prêt', 'formation'] as const
type StandardAidType = (typeof STANDARD_AID_TYPES)[number]

export type CoverageLevel = 'none' | 'financement-gap' | 'type-gap' | 'covered'

export interface RegionCoverage {
  region: string
  programs: CoverageProgram[]
  aidTypesPresent: string[]
  missingAidTypes: StandardAidType[]
  level: CoverageLevel
}

export interface CoverageStats {
  totalPrograms: number
  regionsCovered: number
  hardGaps: number
  aidTypeGaps: number
}

function matchesSize(program: CoverageProgram, size: StructureSize | null): boolean {
  if (!size) {
    return true
  }
  const workforce = SizeToWorkforce[size]
  if (program.excludeMicroentrepreneur && size === StructureSize.EI) {
    return false
  }
  if (program.minEmployees !== null && workforce < program.minEmployees) {
    return false
  }
  if (program.maxEmployees !== null && workforce > program.maxEmployees) {
    return false
  }
  return true
}

function matchesSector(program: CoverageProgram, sector: string | null): boolean {
  if (!sector) {
    return true
  }
  return program.sectors === null || program.sectors.includes(sector)
}

function matchesProject(program: CoverageProgram, projectId: number | null): boolean {
  if (!projectId) {
    return true
  }
  return program.projectIds.includes(projectId)
}

function matchesOperator(program: CoverageProgram, operator: string | null): boolean {
  if (!operator) return true
  return getOperator(program.id) === operator
}

function matchesRegion(program: CoverageProgram, region: string): boolean {
  return program.regions === null || program.regions.includes(region)
}

function computeLevel(programs: CoverageProgram[], missingAidTypes: StandardAidType[]): CoverageLevel {
  if (programs.length === 0) {
    return 'none'
  }
  if (missingAidTypes.includes('financement')) {
    return 'financement-gap'
  }
  if (missingAidTypes.length > 0) {
    return 'type-gap'
  }
  return 'covered'
}

export function useCoverage(
  projectId: Ref<number | null>,
  sector: Ref<string | null>,
  size: Ref<StructureSize | null>,
  operator: Ref<string | null>
) {
  const filteredPrograms = computed(() =>
    coverage.programs.filter(
      (p) =>
        matchesProject(p, projectId.value) &&
        matchesSector(p, sector.value) &&
        matchesSize(p, size.value) &&
        matchesOperator(p, operator.value)
    )
  )

  const coverageByRegion = computed<RegionCoverage[]>(() =>
    ALL_REGIONS.map((region) => {
      const programs = filteredPrograms.value.filter((p) => matchesRegion(p, region))
      const aidTypesPresent = [...new Set(programs.map((p) => p.aidType))]
      const missingAidTypes = STANDARD_AID_TYPES.filter((t) => !aidTypesPresent.includes(t))
      return {
        region,
        programs,
        aidTypesPresent,
        missingAidTypes,
        level: computeLevel(programs, missingAidTypes)
      }
    })
  )

  const stats = computed<CoverageStats>(() => {
    const regions = coverageByRegion.value
    return {
      totalPrograms: filteredPrograms.value.length,
      regionsCovered: regions.filter((r) => r.level !== 'none').length,
      hardGaps: regions.filter((r) => r.level === 'none').length,
      aidTypeGaps: regions.filter((r) => r.level === 'financement-gap' || r.level === 'type-gap').length
    }
  })

  /** Regions sorted: none first, then financement-gap, then type-gap, then covered */
  const sortedRegions = computed<RegionCoverage[]>(() => {
    const order: Record<CoverageLevel, number> = { none: 0, 'financement-gap': 1, 'type-gap': 2, covered: 3 }
    return [...coverageByRegion.value].sort((a, b) => order[a.level] - order[b.level])
  })

  return { coverageByRegion, sortedRegions, stats, filteredPrograms }
}

// ─── Main misses ───────────────────────────────────────────────────────────────

export type MissCategory = 'national-void' | 'national-financement-gap' | 'national-type-gap' | 'regional-void' | 'regional-type-gap'

export interface ProjectMiss {
  project: CoverageProject
  category: MissCategory
  /** Types missing across all metro regions */
  missingTypesNational: string[]
  /** Metro regions with 0 programs */
  emptyRegions: string[]
  /** Metro regions missing at least one type */
  regionsWithTypeGap: string[]
  totalPrograms: number
}

export function useMainMisses(sector: Ref<string | null>, size: Ref<StructureSize | null>, operator: Ref<string | null>) {
  const misses = computed<ProjectMiss[]>(() => {
    const result: ProjectMiss[] = []

    for (const project of coverage.projects) {
      const programs = coverage.programs.filter(
        (p) =>
          p.projectIds.includes(project.id) &&
          matchesSector(p, sector.value) &&
          matchesSize(p, size.value) &&
          matchesOperator(p, operator.value)
      )

      const regionCoverages = METRO_REGIONS.map((region) => {
        const regionPrograms = programs.filter((p) => matchesRegion(p, region))
        const aidTypesPresent = [...new Set(regionPrograms.map((p) => p.aidType))]
        const missingTypes = STANDARD_AID_TYPES.filter((t) => !aidTypesPresent.includes(t))
        return { region, count: regionPrograms.length, aidTypesPresent, missingTypes }
      })

      const emptyRegions = regionCoverages.filter((r) => r.count === 0).map((r) => r.region)
      const regionsWithTypeGap = regionCoverages.filter((r) => r.count > 0 && r.missingTypes.length > 0).map((r) => r.region)
      const totalPrograms = programs.length

      // Types absent from ALL metro regions (national gap)
      const missingTypesNational = STANDARD_AID_TYPES.filter((t) => !regionCoverages.some((r) => r.aidTypesPresent.includes(t)))

      let category: MissCategory | null = null

      if (emptyRegions.length === METRO_REGIONS.length) {
        category = 'national-void'
      } else if (missingTypesNational.includes('financement')) {
        category = 'national-financement-gap'
      } else if (missingTypesNational.length > 0) {
        category = 'national-type-gap'
      } else if (emptyRegions.length > 0) {
        category = 'regional-void'
      } else if (regionsWithTypeGap.length > 0) {
        category = 'regional-type-gap'
      }

      if (category) {
        result.push({ project, category, missingTypesNational, emptyRegions, regionsWithTypeGap, totalPrograms })
      }
    }

    const order: Record<MissCategory, number> = {
      'national-void': 0,
      'national-financement-gap': 1,
      'national-type-gap': 2,
      'regional-void': 3,
      'regional-type-gap': 4,
    }
    return result.sort((a, b) => order[a.category] - order[b.category])
  })

  return { misses }
}
