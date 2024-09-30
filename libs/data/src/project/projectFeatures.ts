import path from 'path'
import fs from 'fs'
import { ProjectBaserow } from '../common/baserow/projectBaserow'
import { RawProject } from './types/domain'
import { jsonPrograms } from '../../generated/index'
import { ProgramType } from '../index'
import { ThemeId } from '../theme/types/shared'
import { SlugValidator } from '../common/validators/slugValidator'
import { LinkValidator } from '../common/validators/linkValidator'
import { Logger } from '../common/logger/logger'
import { LoggerType, LogLevel } from '../common/logger/types'

export class ProjectFeatures {
  private readonly _outputDirectory: string = path.join(__dirname, '../../static/')
  private readonly _outputImageDirectory: string = path.join(__dirname, '../../../../apps/web/public/images/projet')
  private _programs: ProgramType[] = []
  private _logger: Logger

  constructor() {
    this._programs = jsonPrograms as unknown as ProgramType[]
    this._logger = new Logger(LoggerType.Project)
  }

  async generateProjectsJson(): Promise<void> {
    this._resetImageFolder()

    console.log(`Start loading Baserow data and creating the project images`)
    const projects = await new ProjectBaserow(this._outputImageDirectory).getValidProjects()

    console.log(`Baserow Data sucessfully downloaded.\n\nStarting to validate the project data and generating the project JSON.`)
    const validProjects = await this._validateData(projects)
    this._writeJson(validProjects)
    this._logger.write('projectGeneration.log')

    return
  }

  private _resetImageFolder() {
    const projectDir = this._outputImageDirectory

    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true })
    }
    fs.mkdirSync(projectDir, { recursive: true })
    console.log(`Created a fresh image directory : ${projectDir}.`)
  }

  private async _validateData(rawProjects: RawProject[]) {
    const validProjects: RawProject[] = []
    for (const project of rawProjects) {
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

  private _validateSlug(project: RawProject) {
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

  private _validateThemes(project: RawProject) {
    const validThemeIds = Object.values(ThemeId)

    project.themes = project.themes.filter((themeId) => {
      const isValidTheme = validThemeIds.includes(themeId as ThemeId)
      if (!isValidTheme) {
        this._logger.log(LogLevel.Major, `Thème inconnu, thème supprimé`, project['title'], project.id, themeId)
      }
      return isValidTheme
    })
  }

  private _validateLinkedProjects(project: RawProject, rawProjects: RawProject[]) {
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

  private _validatePrograms(project: RawProject, programs: ProgramType[]) {
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

  private async _validateLinks(project: RawProject) {
    const markdownText = project.moreDescription
    const linkRegex = /\[.*?\]\((https?:\/\/[^\s]+)\)|\bhttps?:\/\/[^\s]+/g
    const links = [...markdownText.matchAll(linkRegex)].map((match) => match[1] || match[0])
    for (const link of links) {
      if (!(await LinkValidator.isValidLink(link))) {
        this._logger.log(
          LogLevel.Major,
          `Erreur de validation de lien dans le champ "pour aller plus loin"`,
          project['title'],
          project.id,
          `[Lien cassé](${link})`
        )
      }
    }
  }

  private _writeJson(rawProjects: RawProject[]) {
    const projectJson = JSON.stringify(rawProjects, null, 2)
    const fullPath = path.join(this._outputDirectory, 'projects.json')
    fs.writeFile(fullPath, projectJson, (err) => {
      if (err) {
        console.log('Error writing file:', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
  }
}
