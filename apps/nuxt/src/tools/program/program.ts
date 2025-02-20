import Navigation from '@/tools/navigation'
import { ProgramData as ProgramType, ProjectType as ProjectType, RouteName } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

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

  static isProgramAutonomous(program: ProgramType | undefined) {
    return program?.['activable en autonomie'] === 'oui'
  }

  static getBackLink(program: ProgramType | undefined, currentProject?: ProjectType | undefined): RouteLocationRaw | undefined {
    if (!program) {
      return undefined
    }

    const navigation = new Navigation()
    if (navigation.isCatalogProgramDetail() && !navigation.isProgramFromProject()) {
      return {
        name: RouteName.CatalogPrograms,
        hash: '#' + program.id,
        query: undefined
      }
    }
    if (navigation.isCatalogProgramDetail() && navigation.isProgramFromProject() && currentProject) {
      return {
        name: RouteName.CatalogProjectDetail,
        hash: '#' + program.id,
        params: { projectSlug: currentProject.slug },
        query: undefined
      }
    }

    const query = useNavigationStore().query
    if (navigation.isQuestionnaireProgramDetail() && !navigation.isProgramFromProject()) {
      return {
        name: RouteName.QuestionnaireResult,
        hash: '#' + program.id,
        query: query
      }
    }
    if (navigation.isQuestionnaireProgramDetail() && navigation.isProgramFromProject() && currentProject) {
      return {
        name: RouteName.ProjectResultDetail,
        hash: '#' + program.id,
        params: { projectSlug: currentProject.slug },
        query: query
      }
    }
  }
}
