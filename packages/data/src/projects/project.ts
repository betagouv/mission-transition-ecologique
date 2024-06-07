import path from 'path'
import fs from 'fs'

import { Baserow } from './baserows'
import { RawProject } from './types'
import { Program } from '@/type/program'

import jsonPrograms from '@tee/data/generated/dataset_out.json'
import Theme from '@tee/common/src/theme/theme'

export class ProjectRepository {
  async buildProjectsJSONOutputs(): Promise<void> {
    const rawProjects = await new Baserow().getValidProjects()
    this._validateData(rawProjects)
    this._writeJson(rawProjects, './generated/projects.json')
    return
  }

  private _validateData(rawProjects: RawProject[]) {
    const programs = jsonPrograms as unknown as Program[]
    rawProjects.forEach((project) => {
      this._validateThemes(project)
      this._validateLinkedProjects(project, rawProjects)
      this._validatePrograms(project, programs)
    })
  }

  private _validateThemes(project: RawProject) {
    project.themes.forEach((themeId) => {
      const themeFound = Theme.themes.some((theme) => theme.id === themeId)
      if (!themeFound) {
        console.warn(`In Project "${project.title}", id ${project.id}, unknown theme-id: ${themeId}`)
      }
    })
  }

  private _validateLinkedProjects(project: RawProject, rawProjects: RawProject[]) {
    project.linkedProjects.forEach((projectId) => {
      const projectFound = rawProjects.some((proj) => proj.id === projectId)
      if (!projectFound) {
        console.warn(`In Project "${project.title}", id ${project.id}, unknown project-id: ${projectId}`)
      }
    })
  }

  private _validatePrograms(project: RawProject, programs: Program[]) {
    project.programs.forEach((programId) => {
      const programFound = programs.some((program) => program.id === programId)
      if (!programFound) {
        console.warn(`In Project "${project.title}", id ${project.id}, unknown program-id: ${programId}`)
      }
    })
  }

  private _writeJson(rawProjects: RawProject[], filePath: string) {
    const projectJson = JSON.stringify(rawProjects)
    const fullPath = path.resolve(filePath)
    fs.writeFile(fullPath, projectJson, (err) => {
      if (err) {
        console.log('Error writing file:', err)
      } else {
        console.log('Successfully wrote file')
      }
    })
  }
}
