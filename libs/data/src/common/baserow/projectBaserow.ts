import path from 'path'
import { AbstractBaserow } from './abstractBaserow'
import { RawProject } from '../../project/types/domain'
import { LinkObject, Project } from './types'
import { Theme } from '../../theme/types/domain'
import { ImageBaserow } from './imageBaserow'

export class ProjectBaserow extends AbstractBaserow {
  private readonly _projectTableId = 305253
  private readonly _imagePath = '/images/projet/'
  private readonly _logPath: string = path.join(__dirname, '../../../static/project_images_download_info.json')
  private _imageDownloader: ImageBaserow

  constructor(imageDirectory: string) {
    super()
    this._imageDownloader = new ImageBaserow(imageDirectory, this._logPath)
  }

  async getValidProjects(): Promise<RawProject[]> {
    const baserowProjects = await this._getTableData<Project>(this._projectTableId)
    const validBaserowProjects = baserowProjects.filter((value) => {
      return value.Publié
    })

    const baserowThemes = await this._getTableData<Theme>(this._themeTableId)

    const projects: RawProject[] = []
    for (const project of validBaserowProjects) {
      try {
        const result = await this._convertToRawProjectType(project, baserowThemes)
        projects.push(result)
        console.info(`successfully loaded project ${project.id}`)
        await this._delay(100)
      } catch (error) {
        console.error(`Error processing project ${project.id}:`, error)
      }
    }
    this._imageDownloader.cleanup()
    return projects
  }

  private async _convertToRawProjectType(baserowProject: Project, baserowThemes: Theme[]): Promise<RawProject> {
    const imageName = await this._imageDownloader.handleImage(baserowProject.Image)

    return {
      id: baserowProject.id,
      slug: baserowProject.Nom,
      title: baserowProject.Titre,
      nameTag: baserowProject.NameTag,
      shortDescription: baserowProject['Description courte'],
      image: this._imagePath + imageName,
      longDescription: baserowProject['Qu’est-ce que c’est ?'],
      moreDescription: baserowProject['Pour aller plus loin'],
      themes: this._generateThemeList(baserowProject['Thématique principale'], baserowProject['Thématiques secondaires'], baserowThemes),
      mainTheme: this._generateMainTheme(baserowProject['Thématique principale'], baserowThemes),
      programs: this._generateProgramList(baserowProject.Dispositifs),
      linkedProjects: this._generateLinkedProjectList(baserowProject['Projets complémentaires']),
      priority: baserowProject.Prio
    }
  }

  private _generateMainTheme(mainTheme: LinkObject[], baserowThemes: Theme[]): string {
    if (mainTheme.length != 1) {
      console.warn('Missing mainTheme Or mainTheme not unique in a field')
    }
    const themeId = mainTheme[0].id
    const matchingTheme = baserowThemes.find((theme) => theme.id === themeId)
    if (matchingTheme === undefined) {
      console.warn('theme not found in baserow data (should not happen!)')
      return ''
    }
    return matchingTheme['Nom (Tech)']
  }

  private _generateThemeList(mainTheme: LinkObject[], secondaryThemes: LinkObject[], baserowThemes: Theme[]): string[] {
    const themeList = [this._generateMainTheme(mainTheme, baserowThemes)]
    secondaryThemes.forEach((secondaryTheme) => {
      const themeId = secondaryTheme.id
      const matchingTheme = baserowThemes.find((theme) => theme.id === themeId)
      if (matchingTheme) {
        themeList.push(matchingTheme['Nom (Tech)'])
      } else {
        console.warn('theme not found in baserow data (should not happen!)')
      }
    })
    return themeList
  }

  private _generateProgramList(programs: LinkObject[]): string[] {
    return programs.map((program) => {
      return program.value
    })
  }

  private _generateLinkedProjectList(projects: LinkObject[]): number[] {
    return projects.map((project) => {
      return project.id
    })
  }
}
