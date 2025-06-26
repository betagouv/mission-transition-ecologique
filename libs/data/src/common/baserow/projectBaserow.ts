import path from 'path'
import { AbstractBaserow } from './abstractBaserow'
import { DataProject, ProjectStatus } from '../../project/types/domain'
import { LinkObject, BaserowProject, BaserowSectors, SectorKeys } from './types'
import { Theme } from '../../theme/types/domain'
import { ImageBaserow } from './imageBaserow'
import { Logger } from '../logger/logger'
import { LogLevel } from '../logger/types'

export class ProjectBaserow extends AbstractBaserow {
  private readonly _imagePath = '/images/projet/'
  private readonly _logPath: string = path.join(this.__dirname, '../../../static/project_images_download_info.json')
  private _imageDownloader: ImageBaserow
  private readonly _defaultProjectImageName = 'plan-transition-bas-carbone.webp'

  constructor(
    imageDirectory: string,
    private _logger: Logger
  ) {
    super()
    this._imageDownloader = new ImageBaserow(imageDirectory, this._logPath)
  }

  async getProdAndArchivedProjects(): Promise<DataProject[]> {
    const baserowProjects = await this._getTableData<BaserowProject>(this._projectTableId)
    const validBaserowProjects = baserowProjects.filter((project) => {
      return this._convertStatus(project?.Statut) == ProjectStatus.InProd || this._convertStatus(project?.Statut) == ProjectStatus.Archived
    })
    return await this._convertProjectList(validBaserowProjects)
  }

  private async _convertProjectList(projectList: BaserowProject[]): Promise<DataProject[]> {
    const baserowThemes = await this._getTableData<Theme>(this._themeTableId)

    const projects: DataProject[] = []
    for (const project of projectList) {
      try {
        const result = await this._convertToDataProjectType(project, baserowThemes)
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

  private async _convertToDataProjectType(baserowProject: BaserowProject, baserowThemes: Theme[]): Promise<DataProject> {
    const maybeImageName = await this._imageDownloader.handleImage(baserowProject.Image)
    let imageName
    if (maybeImageName.isErr) {
      this._logger.log(
        LogLevel.Major,
        maybeImageName.error.message + '\n, defaulting to a default image',
        baserowProject.Titre,
        baserowProject.id
      )
      imageName = this._defaultProjectImageName
    } else {
      imageName = maybeImageName.value
    }

    const redirect = this._generateRedirect(baserowProject)

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
      priority: baserowProject.Prio,
      highlightPriority: baserowProject['Mise En Avant'],
      sectors: this._generateSectors(baserowProject as BaserowSectors),
      status: this._convertStatus(baserowProject?.Statut),
      ...(redirect !== undefined && { redirectTo: redirect })
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

  private _generateSectors(sectors: BaserowSectors): string[] {
    const result: string[] = []
    Object.keys(sectors).forEach((key) => {
      const sectorKey = key as keyof BaserowSectors
      if (sectors[sectorKey]) {
        const sectorValue = SectorKeys[sectorKey as keyof typeof SectorKeys]
        if (sectorValue) {
          result.push(sectorValue)
        }
      }
    })

    return result
  }

  private _generateRedirect(project: BaserowProject): number | undefined {
    if (project['redirection-vers'].length > 1) {
      this._logger.log(LogLevel.Major, 'Redirection invalide: multiples redirections en conflit', project.Titre, project.id)
      return undefined
    }
    if (!project['redirection-vers'].length) {
      return undefined
    }
    return project['redirection-vers'][0].id
  }

  private _convertStatus(status: LinkObject | undefined): ProjectStatus {
    if (!status) {
      return ProjectStatus.Others
    }
    return Object.values(ProjectStatus).includes(status.value as ProjectStatus) ? (status.value as ProjectStatus) : ProjectStatus.Others
  }
}
