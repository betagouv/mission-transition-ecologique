import type { ProgramType, ProjectType } from '@/types'

export default class Program {
  static getEndDate(program: ProgramType | undefined): Date | undefined {
    if (program === undefined || program['fin de validité'] === undefined) {
      return undefined
    }

    const dateArr: string[] = program['fin de validité'].split('/')
    return new Date(`${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`)
  }

  static isAvailable(program: ProgramType | undefined) {
    const endDate = this.getEndDate(program)

    return endDate !== undefined ? endDate >= new Date() : true
  }

  public static isTemporaryUnavailable(program: ProgramType | undefined) {
    return program?.[`aide temporairement indisponible`] === 'oui'
  }

  static getLinkedProjects(program: ProgramType | undefined, projects: ProjectType[]) {
    if (program) {
      return projects.filter((project: ProjectType) => project.programs.includes(program.id))
    }
  }
}
