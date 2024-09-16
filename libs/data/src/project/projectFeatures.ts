import path from 'path'
import fs from 'fs'
import { ProjectBaserow } from '../common/baserow/projectBaserow'
import { RawProject } from './types/domain'
import { jsonPrograms } from '../../generated/index'
import { ProgramType } from '../index'
import { ThemeId } from '../theme/types/shared'
import { SlugValidator } from '../common/validators/slugValidator'
import { LinkValidator } from '../common/validators/linkValidators'

export class ProjectFeatures {
  private readonly _outputDirectory: string = path.join(__dirname, '../../static/')
  private readonly _outputImageDirectory: string = path.join(__dirname, '../../../../apps/web/public/images/projet')
  private _programs: ProgramType[] = []

  constructor() {
    this._programs = jsonPrograms as unknown as ProgramType[]
  }

  async generateProjectsJson(): Promise<void> {
    this._resetImageFolder()

    console.log(`Start loading Baserow data and creating the project images`)
    const projects = await new ProjectBaserow(this._outputImageDirectory).getValidProjects()

    console.log(`Baserow Data sucessfully downloaded.\n\nStarting to validate the project data and generating the project JSON.`)
    await this._validateData(projects)
    this._writeJson(projects)
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
    for (const project of rawProjects) {
      SlugValidator.validate(project.slug)
      this._validateThemes(project)
      this._validateLinkedProjects(project, rawProjects)
      this._validatePrograms(project, this._programs)
      await this._validateLinks(project)
    }
  }

  private _validateThemes(project: RawProject) {
    const validThemeIds = Object.values(ThemeId)

    project.themes = project.themes.filter((themeId) => {
      const isValidTheme = validThemeIds.includes(themeId as ThemeId)
      if (!isValidTheme) {
        this._log(`Majeur : dans le projet "${project['title']}", id ${project['id']}, thème inconnu : ${themeId}, thème supprimé`)
      }
      return isValidTheme
    })
  }

  private _validateLinkedProjects(project: RawProject, rawProjects: RawProject[]) {
    project.linkedProjects = project.linkedProjects.filter((projectId) => {
      const projectFound = rawProjects.some((proj) => proj['id'] === projectId)
      if (!projectFound) {
        this._log(
          `Warning : dans le projet "${project['title']}", id ${project['id']}, projet liée inconnu : ${projectId}, projet lié supprimé`
        )
      }
      return projectFound
    })
  }

  private _validatePrograms(project: RawProject, programs: ProgramType[]) {
    project.programs = project.programs.filter((programId) => {
      const programFound = programs.some((program) => program.id === programId)
      if (!programFound) {
        this._log(
          `Warning : dans le projet "${project['title']}", id ${project['id']}, programme liée inconnu : ${programId}, programme lié supprimé`
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
        this._log(
          `Majeur: dans le projet "${project['title']}", id ${project['id']} 'erreur de validation de lien dans le champs "pour aller plus loin", ${link}`
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

  private _log(message: string): void {
    console.log(message)
    fs.appendFileSync('projectGeneration.log', message + '\n', { encoding: 'utf-8' })
  }
}
