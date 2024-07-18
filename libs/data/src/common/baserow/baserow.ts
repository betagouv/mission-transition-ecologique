import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { RawProject } from '../../project/types'
import { Id, ImageTable, LinkedObject as LinkObject, Program, Project } from './types'
import { DataProgram, Status, DataProgramType, Operator, GeographicCoverage, GeographicAreas } from '../../program/types'
import { Theme } from '../../theme/themes'

dotenv.config()

export class Baserow {
  private readonly _apiToken = this._setBaserowToken()
  private readonly _baseUrl = 'https://api.baserow.io/api'
  private readonly _projectTableId = 305253
  private readonly _themeTableId = 305258
  private readonly _imageTableId = 315189
  private _operatorTableId = 314410
  private _geographicCoverageTableId = 314470
  private _geographicAreasTableId = 314474
  private _programTableId = 314437
  private readonly _axiosHeader = {
    headers: {
      Authorization: `Token ${this._apiToken}`
    }
  }
  private readonly _imagePath = '/images/projet/'
  private readonly _defaultImageName = 'plan-transition-bas-carbone.webp'

  constructor(private readonly _imageDirectory: string) {}

  async getValidProjects(): Promise<RawProject[]> {
    const baserowProjects = await this._getTableData<Project>(this._projectTableId)
    const validBaserowProjects = baserowProjects.filter((value) => {
      return value.Publié || true // TODO delete or true when there will be real data in baserow !
    })

    const baserawThemes = await this._getTableData<Theme>(this._themeTableId)

    const projects: RawProject[] = []
    for (const project of validBaserowProjects) {
      try {
        const result = await this._convertToRawProjectType(project, baserawThemes)
        projects.push(result)
        console.info(`successfully loaded project ${project.id}`)
        await this._delay(300)
      } catch (error) {
        console.error(`Error processing project ${project.id}:`, error)
      }
    }
    return projects
  }

  // Note : caching the downloaded data by default to nudge towards reducing the data transfer from baserow.
  async getPrograms(useLocalRawData: boolean): Promise<DataProgram[]> {
    if (useLocalRawData) {
      try {
        const data = fs.readFileSync('program_tmp.json', 'utf-8')
        return JSON.parse(data) as DataProgram[]
      } catch {
        // known empty bloc, comment for the linter!
      }
    }

    const allBaserowPrograms = await this._getTableData<Program>(this._programTableId)
    const operators = await this._getTableData<Operator>(this._operatorTableId)
    const geographicCoverages = await this._getTableData<GeographicCoverage>(this._geographicCoverageTableId)
    const geographicAreas = await this._getTableData<GeographicAreas>(this._geographicAreasTableId)
    const themes = await this._getTableData<Theme>(this._themeTableId)

    const dataPrograms = allBaserowPrograms.map((baserowProgram) =>
      this._convertToDataProgram(baserowProgram, operators, geographicCoverages, geographicAreas, themes)
    )

    try {
      fs.writeFileSync('program_tmp.json', JSON.stringify(dataPrograms, null, 2))
    } catch {
      // known empty bloc, comment for the linter!
    }

    return dataPrograms
  }

  private async _getTableData<T>(tableId: number): Promise<T[]> {
    try {
      const response = await axios.get(`${this._baseUrl}/database/rows/table/${tableId}/?user_field_names=true`, this._axiosHeader)
      await this._delay(100)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      let results = response.data.results
      let next = response.data.next
      while (next) {
        const newResponse = await axios.get(next, this._axiosHeader)
        await this._delay(100)
        results = results.concat(newResponse.data.results)
        next = newResponse.data.next
      }
      return results
    } catch (error) {
      console.error('Error fetching project data from baserow:', error)
      return []
    }
  }

  private async _getRowData<T>(tableId: number, rowId: number): Promise<T | null> {
    try {
      const response = await axios.get(`${this._baseUrl}/database/rows/table/${tableId}/${rowId}/?user_field_names=true`, this._axiosHeader)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return response.data
    } catch (error) {
      console.error('Error fetching a specific row of data from baserow :', error)
      return null
    }
  }

  private async _convertToRawProjectType(baserowProject: Project, baserawThemes: Theme[]): Promise<RawProject> {
    const imageName = await this._handleImage(baserowProject.Image)

    return {
      id: baserowProject.id,
      slug: baserowProject.Nom,
      title: baserowProject.Titre,
      nameTag: baserowProject.NameTag,
      shortDescription: baserowProject['Description courte'],
      image: this._imagePath + imageName,
      longDescription: baserowProject['Qu’est-ce que c’est ?'],
      moreDescription: baserowProject['Pour aller plus loin'],
      themes: this._generateThemeList(baserowProject['Thématique principale'], baserowProject['Thématiques secondaires'], baserawThemes),
      mainTheme: this._generateMainTheme(baserowProject['Thématique principale'], baserawThemes),
      programs: this._generateProgramList(baserowProject.Dispositifs),
      linkedProjects: this._generateLinkedProjectList(baserowProject['Projets complémentaires']),
      priority: baserowProject.Prio
    }
  }

  private async _handleImage(baserowImage: LinkObject[]): Promise<string> {
    if (!baserowImage.length) {
      console.log('No image found, defaulting to plan-transition-bas-carbone.webp')
      return this._defaultImageName
    }
    // request the image url in the image table
    const imageId = baserowImage[0].id
    const imageInfos = (await this._getRowData<ImageTable>(this._imageTableId, imageId)) as ImageTable
    let imageDownloadResponse
    try {
      imageDownloadResponse = await axios.get(imageInfos.Image[0].url, { responseType: 'arraybuffer' })
    } catch {
      console.error('Error while trying to download the image ' + imageId)
      console.log('Defaulting to the default image : ' + this._defaultImageName)
      return this._defaultImageName
    }

    const imageBuffer = Buffer.from(imageDownloadResponse.data, 'binary')
    const webpBuffer = await this._sharpImage(imageBuffer)

    const fileName = `${imageInfos['Image URL TEE']}.webp`
    const filePath = path.join(this._imageDirectory, fileName)
    fs.writeFileSync(filePath, webpBuffer)

    return fileName
  }

  private async _sharpImage(imageBuffer: Buffer): Promise<Buffer> {
    let imageSharp = sharp(imageBuffer)
    const metadata = await imageSharp.metadata()
    if (metadata.width && metadata.width > 1280) {
      imageSharp = imageSharp.resize(1280)
    }
    return await imageSharp.webp({ quality: 60 }).toBuffer()
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

  private async _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private _setBaserowToken(): string {
    if (process.env['BASEROW_TOKEN']) {
      return process.env['BASEROW_TOKEN']
    }
    throw Error('Baserow token not found.')
  }

  private _replaceLinkedObjectbyTableData<T extends Id>(links: LinkObject[], referencedTableData: T[]): T[] {
    const tableData = links.map((link) => referencedTableData.find((object) => link.id === object.id))

    if (tableData.includes(undefined)) {
      console.log("warning, a baserow link isn't defined, it should never happen", links)
    }

    return tableData.filter((operator) => operator !== undefined) as T[]
  }

  private _convertToDataProgram(
    program: Program,
    operators: Operator[],
    geographicCoverages: GeographicCoverage[],
    geographicAreas: GeographicAreas[],
    themes: Theme[]
  ): any {
    const {
      Statuts,
      "Nature de l'aide": aidTypes,
      'Opérateur de contact': contactOperator,
      'Autres opérateurs': otherOperator,
      'Couverture géographique': geographicCoverage,
      'Zones géographiques': programGeographicAreas,
      'Thèmes Ciblés': programThemes,
      ...nonModifiedFields
    } = program

    const rawStatuts = Statuts.map((linkedObj) => linkedObj.value as Status)
    const domainContactOperator = this._replaceLinkedObjectbyTableData<Operator>(contactOperator, operators)
    const domainOtherOperator = this._replaceLinkedObjectbyTableData<Operator>(otherOperator, operators)
    const domainGeographicCoverage = this._replaceLinkedObjectbyTableData<GeographicCoverage>(geographicCoverage, geographicCoverages)
    const domainProgramGeographicAreas = this._replaceLinkedObjectbyTableData<GeographicAreas>(programGeographicAreas, geographicAreas)
    const domainProgramThemes = this._replaceLinkedObjectbyTableData<Theme>(programThemes, themes)

    const rawProgram: DataProgram = {
      ...nonModifiedFields,
      Statuts: rawStatuts,
      'Opérateur de contact': domainContactOperator,
      'Autres opérateurs': domainOtherOperator,
      "Nature de l'aide": aidTypes ? (aidTypes.value as DataProgramType) : DataProgramType.Undefined,
      'Zones géographiques': domainProgramGeographicAreas,
      'Couverture géographique': domainGeographicCoverage[0],
      'Thèmes Ciblés': domainProgramThemes
    }

    return rawProgram
  }
}
