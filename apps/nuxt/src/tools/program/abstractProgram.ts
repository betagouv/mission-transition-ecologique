import Navigation from '@/tools/navigation'
import { AbstractProgramTypeForFront, ProgramTypeForFront, ProgramTypes, ProjectType, RouteName } from '@/types'
import { RouteLocationRaw } from 'vue-router'
import type { Ref } from 'vue'

export default class AbstractProgram {
  public static getCurrent(): Ref<AbstractProgramTypeForFront | undefined> {
    const { currentProgram, currentExtProgram } = storeToRefs(useProgramStore())

    return currentProgram.value
      ? (currentProgram as Ref<AbstractProgramTypeForFront | undefined>)
      : (currentExtProgram as Ref<AbstractProgramTypeForFront | undefined>)
  }

  public static isTemporaryUnavailable(program: AbstractProgramTypeForFront | ProgramTypeForFront | undefined) {
    return program?.[`aide temporairement indisponible`] === 'oui'
  }

  public static isTeeProgram(
    program: AbstractProgramTypeForFront | ProgramTypeForFront | undefined | null
  ): program is ProgramTypeForFront {
    return program?.type === ProgramTypes.TEE
  }

  public static isExternalProgram(
    program: AbstractProgramTypeForFront | ProgramTypeForFront | undefined | null
  ): program is AbstractProgramTypeForFront {
    return program?.type === ProgramTypes.extAdeme
  }

  static getBackLink(
    program: AbstractProgramTypeForFront | ProgramTypeForFront | undefined,
    currentProject?: ProjectType | undefined
  ): RouteLocationRaw | undefined {
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
