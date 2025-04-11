import { fileURLToPath } from 'url'
import { redirects } from '../../../static/index'
import { DataProject, ProjectStatus } from '../../project/types/domain'
import { FileManager } from '../fileManager'
import { Logger } from '../logger/logger'
import { LogLevel } from '../logger/types'
import { RedirectJson } from './types'
import path from 'path'
import { DataProgram, Status } from '../../program/types/domain'

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
        if (project.status == ProjectStatus.InProd) {
          this._logger.log(LogLevel.Major, 'Conflit : en prod / redirection active', project.title, project.id)
        }

        const newSlug = this.newRedirectData.project_rowid_to_url_mapping[project.redirectTo]
        const redirectInProd = projects.some((proj) => proj.id === project.redirectTo)
        if (!newSlug || !redirectInProd) {
          this._logger.log(LogLevel.Critic, "Redirection vers un projet non valide, risque d'erreur 404", project.title, project.id)
        } else {
          // Add or update the redirection for this project's slug
          this._updateProjectSlug(project.slug, newSlug)
        }
      } else {
        // Remove the redirection if it existed but doesn't exist anymore
        delete this.newRedirectData.project_redirects[project.slug]
      }
    })
  }

  updateProgramRedirects(programs: DataProgram[]) {
    this.handleProgramRenaming(programs)
    this.handleProgramReplacements(programs)

    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const outputFilePath: string = path.join(dirname, this._jsonPath)
    FileManager.writeJson(outputFilePath, this.newRedirectData, 'Program redirections updated')
  }

  handleProgramRenaming(programs: DataProgram[]) {
    programs.forEach((program) => {
      if (this.newRedirectData.program_rowid_to_url_mapping[program.id]) {
        if (this.newRedirectData.program_rowid_to_url_mapping[program.id] != program['Id fiche dispositif']) {
          this._updateProgramSlug(this.newRedirectData.program_rowid_to_url_mapping[program.id], program['Id fiche dispositif'])
        }
      }

      this.newRedirectData.program_rowid_to_url_mapping[program.id] = program['Id fiche dispositif']
    })
  }

  private _updateProgramSlug(oldSlug: string, newSlug: string) {
    for (const [key, value] of Object.entries(this.newRedirectData.program_redirects)) {
      if (value === oldSlug) {
        this.newRedirectData.program_redirects[key] = newSlug
      }
    }

    this.newRedirectData.program_redirects[oldSlug] = newSlug
  }

  handleProgramReplacements(programs: DataProgram[]) {
    programs.forEach((program) => {
      if (program['redirection-vers']) {
        if (!program.Statuts.includes(Status.Replaced)) {
          this._logger.log(
            LogLevel.Major,
            'Conflit : redirection non nulle mais statut "Remplacé" non inclus dans les statuts',
            program.Titre,
            program.id
          )
        }

        if (program['redirection-vers'].length > 1) {
          this._logger.log(LogLevel.Major, 'Redirection invalide: multiples redirections en conflit', program.Titre, program.id)
        }

        const newSlug = this.newRedirectData.program_rowid_to_url_mapping[program['redirection-vers'][0]]
        const redirectInProd = programs.some((progr) => progr.id === program['redirection-vers'][0])
        if (!newSlug || !redirectInProd) {
          this._logger.log(LogLevel.Critic, "Redirection vers un programme non valide, risque d'erreur 404", program.Titre, program.id)
        } else {
          // Add or update the redirection for this program's slug
          this._updateProgramSlug(program['Id fiche dispositif'], newSlug)
        }
      } else {
        // Remove the redirection if it existed but doesn't exist anymore
        delete this.newRedirectData.program_redirects[program['Id fiche dispositif']]
      }
    })
  }
}
