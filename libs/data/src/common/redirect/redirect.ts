import { fileURLToPath } from 'url'
import { redirects } from '../../../static/index'
import { ProgramDataUtils } from '../../program/programData'
import { DataProject } from '../../project/types/domain'
import { ProgramBaserow } from '../baserow/programBaserow'
import { ProjectBaserow } from '../baserow/projectBaserow'
import { RedirectsBaserow } from '../baserow/redirectBaserow'
import { FileManager } from '../fileManager'
import { Logger } from '../logger/logger'
import { LoggerType, LogLevel } from '../logger/types'
import { RedirectJson } from './types'
import path from 'path'

export default class Redirect {
  private readonly _jsonPath = '../../../static/redirects.json'
  private readonly oldRedirectData = redirects as unknown as RedirectJson
  private newRedirectData = JSON.parse(JSON.stringify(this.oldRedirectData)) as RedirectJson // deep copy for modifications

  private _logger: Logger

  constructor(logger: Logger) {
    this._logger = logger
  }

  updateProjectsRedirects(projects: DataProject[]) {
    this.handleProjectRenaming(projects)
    this.handleProjectReplacements(projects)

    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const outputFilePath: string = path.join(dirname, this._jsonPath)
    FileManager.writeJson(outputFilePath, this.newRedirectData, 'Project redirections updated')
  }

  handleProjectRenaming(projects: DataProject[]) {
    projects.forEach((project) => {
      if (this.newRedirectData.project_rowid_to_url_mapping[project.id]) {
        if (this.newRedirectData.project_rowid_to_url_mapping[project.id] != project.slug) {
          this._updateProjectSlug(this.newRedirectData.project_rowid_to_url_mapping[project.id], project.slug)
        }
      }

      this.newRedirectData.project_rowid_to_url_mapping[project.id] = project.slug
    })
  }

  private _updateProjectSlug(oldSlug: string, newSlug: string) {
    for (const [key, value] of Object.entries(this.newRedirectData.project_redirects)) {
      if (value === oldSlug) {
        this.newRedirectData.project_redirects[key] = newSlug
      }
    }

    this.newRedirectData.project_redirects[oldSlug] = newSlug
  }

  handleProjectReplacements(projects: DataProject[]) {
    projects.forEach((project) => {
      if (project.redirectTo) {
        console.log('jsuis bine la, ', project.title, project.redirectTo)
        const newSlug = this.newRedirectData.project_rowid_to_url_mapping[project.redirectTo]
        const redirectInProd = projects.some((proj) => proj.id === project.redirectTo)
        if (!newSlug || !redirectInProd) {
          console.log('jdevrais pas etre la')
          this._logger.log(LogLevel.Critic, "Redirection vers un projet non valide, risque d'erreur 404", project['title'], project.id)
        } else {
          // Add or update the redirection for this project's slug
          this.newRedirectData.project_redirects[project.slug] = newSlug
        }
      } else {
        // Remove the redirection if it existed but doesn't exist anymore
        delete this.newRedirectData.project_redirects[project.slug]
      }
    })
  }

  async generateRedirectJson() {
    const currentJsonData = redirects as unknown as RedirectJson
    console.log(currentJsonData)

    //program renaming redirects
    const programs = await new ProgramBaserow().getPrograms(false)

    const test: Record<number, string> = {}
    for (const program of programs) {
      if (!ProgramDataUtils.isInProd(program)) {
        continue
      }
      test[program.id] = program['Id fiche dispositif']
    }
    console.log(test)

    // project renaming redirects
    const projects = await new ProjectBaserow('unused', new Logger(LoggerType.Project)).getRawValidProjects()

    const test2: Record<number, string> = {}
    for (const project of projects) {
      test2[project.id] = project.Nom
    }
    console.log(test2)

    // redirect table
    const temp = await new RedirectsBaserow().getAll()
    // Pas convaincu par le format.
    // peut être juste old id; new id ?
    // et un mapping par id : current_url, old_urls
    console.log(temp)
  }
}
