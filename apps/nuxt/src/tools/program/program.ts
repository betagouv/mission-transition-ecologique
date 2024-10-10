import type { ProgramData as ProgramType, Project as ProjectType } from '@/types'

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

  static getLinkedProjects(program: ProgramType | undefined, projects: ProjectType[]) {
    if (program) {
      const programId: string = program.id
      const linkedProjects: ProjectType[] = projects.filter((project: ProjectType) => project.programs.includes(programId))
      return linkedProjects
    }
  }
}
