import { RedirectData } from '../redirect/types'
import { AbstractBaserow } from './abstractBaserow'
import { BaserowProject, Program, Redirect } from './types'

export class RedirectsBaserow extends AbstractBaserow {
  private readonly _redirectTableId = 481028

  async getAll(): Promise<RedirectData[]> {
    const redirects = await this._getTableData<Redirect>(this._redirectTableId)
    const baserowProjects = await this._getTableData<BaserowProject>(this._projectTableId)
    const baserowPrograms = await this._getTableData<Program>(this._programTableId)
    return redirects.flatMap((redirect) => this._convertToDomain(redirect, baserowPrograms, baserowProjects))
  }

  private _convertToDomain(redirect: Redirect, programs: Program[], projects: BaserowProject[]): RedirectData[] {
    const newProgram = this._replaceLinkObjectByTableData<Program>(redirect['Nouveau dispositif'], programs)
    const oldPrograms = this._replaceLinkObjectByTableData<Program>(redirect['Dispositifs à remplacer'], programs)
    const newProject = this._replaceLinkObjectByTableData<BaserowProject>(redirect['Nouveau Projet'], projects)
    const oldProjects = this._replaceLinkObjectByTableData<BaserowProject>(redirect['Projets à remplacer'], projects)

    const result: RedirectData[] = []

    if (newProgram.length == 1) {
      result.push({
        id: newProgram[0].id,
        type: 'program',
        currentUrl: newProgram[0]['Id fiche dispositif'],
        oldUrls: oldPrograms.map((program) => program['Id fiche dispositif'])
      })
    }
    if (newProject.length == 1) {
      result.push({
        id: newProject[0].id,
        type: 'project',
        currentUrl: newProject[0].Nom,
        oldUrls: oldProjects.map((project) => project.Nom)
      })
    }
    return result
  }
}
