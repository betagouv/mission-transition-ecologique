import path from 'path'
import { fileURLToPath } from 'url'
import { FileManager } from '../common/fileManager'
import type { ProgramType } from '../program/types/shared'
import type { ProjectType } from '../project/types/shared'
import type { CoverageData, CoverageProgram, CoverageProject } from './types'

const STATIC_FOLDER = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../static')
const OUTPUT_PATH = path.join(STATIC_FOLDER, 'coverage.json')

// All valid NAF section codes in France (A–U)
const ALL_NAF_SECTIONS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U']

export class CoverageGenerator {
  generate(): void {
    const programs = FileManager.readJson<ProgramType[]>(path.join(STATIC_FOLDER, 'programs.json'))
    const projects = FileManager.readJson<ProjectType[]>(path.join(STATIC_FOLDER, 'projects.json'))

    const programToProjectIds = this._buildProgramToProjectMap(projects)

    const coveragePrograms: CoverageProgram[] = programs
      .filter((p) => (programToProjectIds.get(p.id) ?? []).length > 0)
      .map((p) => this._toCoverageProgram(p, programToProjectIds))

    const coverageProjects: CoverageProject[] = projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      mainTheme: p.mainTheme
    }))

    const data: CoverageData = {
      generatedAt: new Date().toISOString(),
      projects: coverageProjects,
      programs: coveragePrograms
    }

    FileManager.writeJson(
      OUTPUT_PATH,
      data,
      `✅ coverage.json written (${coveragePrograms.length} programs, ${coverageProjects.length} projects)`
    )
  }

  private _buildProgramToProjectMap(projects: ProjectType[]): Map<string, number[]> {
    const map = new Map<string, number[]>()
    for (const project of projects) {
      for (const programId of project.programs) {
        if (!map.has(programId)) {
          map.set(programId, [])
        }
        map.get(programId)!.push(project.id)
      }
    }
    return map
  }

  private _toCoverageProgram(program: ProgramType, programToProjectIds: Map<string, number[]>): CoverageProgram {
    const company = program.eligibilityData?.company

    const regions = company?.allowedRegion && company.allowedRegion.length > 0 ? company.allowedRegion : null

    const nafSections = company?.allowedNafSections ?? []
    const sectors = this._isAllSectors(nafSections) ? null : nafSections.length > 0 ? nafSections : null

    return {
      id: program.id,
      title: program['titre'],
      projectIds: programToProjectIds.get(program.id) ?? [],
      aidType: program["nature de l'aide"] ?? '',
      regions,
      sectors,
      minEmployees: company?.minEmployees != null ? Number(company.minEmployees) : null,
      maxEmployees: company?.maxEmployees != null ? Number(company.maxEmployees) : null,
      excludeMicroentrepreneur: company?.excludeMicroentrepreneur ?? false
    }
  }

  private _isAllSectors(nafSections: string[]): boolean {
    if (nafSections.length < ALL_NAF_SECTIONS.length) {
      return false
    }
    return ALL_NAF_SECTIONS.every((code) => nafSections.includes(code))
  }
}
