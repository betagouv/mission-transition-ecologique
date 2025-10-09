import path from 'path'
import { fileURLToPath } from 'url'
import { ProjectBaserow } from '../common/baserow/projectBaserow'
import { FaqFilter } from '../faq/faqFilter'
import { FaqRepositoryInterface } from '../faq/types/domain'
import { DataProject, ProjectStatus } from './types/domain'
import { jsonPrograms } from '../../static'
import { ProgramType } from '../program/types/shared'
import { ThemeId } from '@tee/common'
import { SlugValidator } from '../common/validators/slugValidator'
import { LinkValidator } from '../common/validators/linkValidator'
import { Logger } from '../common/logger/logger'
import { LogLevel } from '../common/logger/types'
import { FileManager } from '../common/fileManager'
import Redirect from '../common/redirect/redirect'

export class ProjectFeatures {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly _outputFilePath: string = path.join(this.__dirname, '../../static/projects.json')
  private readonly _outputImageDirectory: string = path.join(this.__dirname, '../../../../apps/nuxt/src/public/images/projet')
  private _programs: ProgramType[] = []

  constructor(
    private _logger: Logger,
    private _faqBaserow: FaqRepositoryInterface
  ) {
    this._programs = jsonPrograms as unknown as ProgramType[]
  }

  async generateProjectsJson(): Promise<void> {
    console.log(`Start loading Baserow data and creating the project images`)
    const projects = await new ProjectBaserow(this._outputImageDirectory, this._logger).getProdAndArchivedProjects()

    await this._addFaqsToProjects(projects)

    console.log(`Baserow Data sucessfully downloaded.\n\nStarting to validate the project data and generating the project JSON.`)
    new Redirect(this._logger).updateProjectsRedirects(projects)

    const validProjects = await this._validateData(projects)
    const sanitizedProjects = validProjects.map(({ status: _status, ...rest }) => rest)
    FileManager.writeJson(this._outputFilePath, sanitizedProjects, 'projects.json updated')
    this._logger.write('projectGeneration.log')

    return
  }

  private async _addFaqsToProjects(projects: DataProject[]) {
    const projectFaqs = await this._getFaqsByProjects(projects)
    for (const project of projects) {
      project.faqs = projectFaqs[project.id] ?? []
    }
  }

  private async _validateData(rawProjects: DataProject[]) {
    const validProjects: DataProject[] = []
    for (const project of rawProjects) {
      if (project.status != ProjectStatus.InProd) {
        continue
      }
      this._validateThemes(project)
      this._validateLinkedProjects(project, rawProjects)
      this._validatePrograms(project, this._programs)
      await this._validateLinks(project)

      if (this._validateSlug(project)) {
        validProjects.push(project)
      }
    }
    return validProjects
  }

  private _validateSlug(project: DataProject) {
    if (!SlugValidator.validate(project.slug)) {
      this._logger.log(
        LogLevel.Critic,
        'Slug non valide, yaml non généré.',
        project['title'],
        project.id,
        'slug à corriger: ' + project.slug
      )
      return false
    }
    return true
  }

  private _validateThemes(project: DataProject) {
    const validThemeIds = Object.values(ThemeId)

    project.themes = project.themes.filter((themeId) => {
      const isValidTheme = validThemeIds.includes(themeId as ThemeId)
      if (!isValidTheme) {
        this._logger.log(LogLevel.Major, `Thème inconnu, thème supprimé`, project['title'], project.id, themeId)
      }
      return isValidTheme
    })
  }

  private _validateLinkedProjects(project: DataProject, rawProjects: DataProject[]) {
    project.linkedProjects = project.linkedProjects.filter((projectId) => {
      const projectFound = rawProjects.some((proj) => proj['id'] === projectId)
      if (!projectFound) {
        this._logger.log(
          LogLevel.Minor,
          `Projet lié inconnu, projet lié supprimé`,
          project['title'],
          project.id,
          'Id du projet inconnu ' + projectId
        )
      }
      return projectFound
    })
  }

  private _validatePrograms(project: DataProject, programs: ProgramType[]) {
    project.programs = project.programs.filter((programId) => {
      const programFound = programs.some((program) => program.id === programId)
      if (!programFound) {
        this._logger.log(
          LogLevel.Minor,
          `Programme liée inconnu et supprimé`,
          project['title'],
          project.id,
          'nom du programme ' + programId
        )
      }
      return programFound
    })
  }

  private async _validateLinks(project: DataProject) {
    const invalidLinks: string[] = await LinkValidator.findInvalidLinks(project.moreDescription)
    for (const link of invalidLinks) {
      this._logger.log(
        LogLevel.Major,
        `Erreur de validation de lien dans le champ "pour aller plus loin"`,
        project['title'],
        project.id,
        `[Lien cassé](${link})`
      )
    }
  }

  private async _getFaqsByProjects(projects: DataProject[]) {
    const faqsByProjects = await this._faqBaserow.getProjectsFaqs(projects)
    for (const index in faqsByProjects) {
      faqsByProjects[index] = await new FaqFilter(this._logger).byValidatedQuestions(faqsByProjects[index])
    }

    return faqsByProjects
  }
}
