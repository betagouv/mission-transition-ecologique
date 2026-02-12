import { ProgramTypeForFront, ProjectType } from '@/types'

export default class Program {
  static getEndDate(program: ProgramTypeForFront | undefined): Date | undefined {
    if (program === undefined || program['fin de validité'] === undefined) {
      return undefined
    }

    const dateArr: string[] = program['fin de validité'].split('/')
    return new Date(`${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`)
  }

  static isAvailable(program: ProgramTypeForFront | undefined) {
    const endDate = this.getEndDate(program)

    return endDate !== undefined ? endDate >= new Date() : true
  }

  static getLinkedProjects(program: ProgramTypeForFront | undefined, projects: ProjectType[]) {
    if (program) {
      return projects.filter((project: ProjectType) => project.programs.includes(program.id))
    }
  }

  static isProgramAutonomous(program: ProgramTypeForFront | undefined) {
    return program?.['activable en autonomie'] === 'oui'
  }

  static hasFormInObjectives(program: ProgramTypeForFront) {
    for (const objectif of program.objectifs) {
      if (Array.isArray(objectif.liens)) {
        for (const lien of objectif.liens) {
          if ('formulaire' in lien && lien.formulaire) {
            return true
          }
        }
      }
    }
    return false
  }
}
