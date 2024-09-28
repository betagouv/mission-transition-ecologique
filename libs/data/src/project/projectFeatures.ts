import path from 'path'
import fs from 'fs'
import { ProjectBaserow } from '../common/baserow/projectBaserow'
import { RawProject } from './types/domain'
import { jsonPrograms } from '../../generated/index'
import { ProgramType } from '../index'
import { ThemeId } from '../theme/types/shared'
import { SlugValidator } from '../common/validators/slugValidator'

export class ProjectFeatures {
  private readonly _outputDirectory: string = path.join(__dirname, '../../static/')
  private readonly _outputImageDirectory: string = path.join(__dirname, '../../../../apps/web/public/images/projet')
  private _programs: ProgramType[] = []

  constructor() {
    this._programs = jsonPrograms as unknown as ProgramType[]
  }

  async generateProjectsJson(): Promise<void> {
    console.log(`Start loading Baserow data and creating the project images`)
    const projects = await new ProjectBaserow(this._outputImageDirectory).getValidProjects()

    console.log(`Baserow Data sucessfully downloaded.\n\nStarting to validate the project data and generating the project JSON.`)
    this._validateData(projects)
    this._writeJson(projects)
    return
  }

  private _validateData(rawProjects: RawProject[]) {
    rawProjects.forEach((project) => {
      SlugValidator.validate(project.slug)
      this._validateThemes(project)
      this._validateLinkedProjects(project, rawProjects)
      this._validatePrograms(project, this._programs)
    })
  }

  private _validateThemes(project: RawProject) {
    const validThemeIds = Object.values(ThemeId)

    project.themes = project.themes.filter((themeId) => {
      const isValidTheme = validThemeIds.includes(themeId as ThemeId)
      if (!isValidTheme) {
        console.warn(`In Project "${project['title']}", id ${project['id']}, unknown theme-id: ${themeId}`)
      }
      return isValidTheme
    })
  }

  private _validateLinkedProjects(project: RawProject, rawProjects: RawProject[]) {
    project.linkedProjects = project.linkedProjects.filter((projectId) => {
      const projectFound = rawProjects.some((proj) => proj['id'] === projectId)
      if (!projectFound) {
        console.warn(`In Project "${project['title']}", id ${project['id']}, unknown linked project-id: ${projectId}, link deleted`)
      }
      return projectFound
    })
  }

  private _validatePrograms(project: RawProject, programs: ProgramType[]) {
    project.programs = project.programs.filter((programId) => {
      const programFound = programs.some((program) => program.id === programId)
      if (!programFound) {
        console.warn(`In Project "${project['title']}", id ${project['id']}, unknown program-id: ${programId}`)
      }
      return programFound
    })
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
