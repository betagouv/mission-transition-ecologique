import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { Image, LinkedObject, Program, Project, Theme } from './types'
import { RawProject as DataProject } from '../../projects/types'
import { Program as DataProgram, Status, ProgramType, Operator, GeographicCoverage, GeographicAreas } from '../../programs/types'
dotenv.config()

export class Baserow {
  private API_TOKEN = process.env.BASEROW_TOKEN
  private BASE_URL = 'https://api.baserow.io/api'
  private _databaseId = 114839
  private _projectTableId = 305253
  private _programTableId = 314437
  private _themeTableId = 305258
  private _operatorTableId = 314410
  private _geographicCoverageTableId = 314470
  private _geographicAreasTableId = 314474
  private _outputDirectory: string
  private _imageSubDirectory: string = 'projectImages'
  constructor(outputDirectory: string) {
    this._outputDirectory = outputDirectory
  }

  async getValidProjects(): Promise<DataProject[]> {
    const allBaserowProjects = await this._getTableData<Project>(this._projectTableId)
    const validBaserawProjects = allBaserowProjects.filter((value) => {
      return value.Publié || true // TODO delete or true when there will be real data in baserow !
    })
    const baserawThemes = await this._getTableData<Theme>(this._themeTableId)

    return await Promise.all(
      validBaserawProjects.map(async (project) => {
        return await this._convertToRawProjectType(project, baserawThemes)
      })
    )
  }

  // Note : caching the downloaded data by default to nudge towards reducing the data transfer from baserow.
  async getPrograms(useLocalRawData:boolean): Promise<DataProgram[]> {
    if (useLocalRawData){
      const data = fs.readFileSync('program_tmp.json', 'utf-8')
      const programs: DataProgram[] = JSON.parse(data)
      return programs
    }

    const allBaserowPrograms = await this._getTableData<Program>(this._programTableId)

    const operators = await this._getTableData<Operator>(this._operatorTableId)
    const geographicCoverages = await this._getTableData<GeographicCoverage>(this._geographicCoverageTableId)
    const geographicAreas = await this._getTableData<GeographicAreas>(this._geographicAreasTableId)
    const themes = await this._getTableData<Theme>(this._themeTableId)

    const programs: DataProgram[] = []
    allBaserowPrograms.forEach((program) => {
      try {
        programs.push(this._convertToRawProgram(program, operators, geographicCoverages, geographicAreas, themes))
      } catch {}
    })
    fs.writeFileSync('program_tmp.json', JSON.stringify(programs, null, 2))

    return programs
  }

  async getOperators(): Promise<string[]> {
    const operators = await this._getTableData<Operator>(this._operatorTableId)
    return operators.map((operator) => operator.Nom)
  }

  private async _getTableData<T>(tableId: number): Promise<T[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/database/rows/table/${tableId}/?user_field_names=true`, {
        headers: {
          Authorization: `Token ${this.API_TOKEN}`
        },
        params: {
          database_id: this._databaseId
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      let results = response.data.results
      let next = response.data.next
      while (next) {
        await this._delay(200)
        const newResponse = await axios.get(next, {
          headers: {
            Authorization: `Token ${this.API_TOKEN}`
          },
          params: {
            database_id: this._databaseId
          }
        })
        results = results.concat(newResponse.data.results)
        next = newResponse.data.next
      }
      return results
    } catch (error) {
      console.error('Error fetching project data from baserow:', error)
      return []
    }
  }

  private async _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async _convertToRawProjectType(baserowProject: Project, baserawThemes: Theme[]): Promise<DataProject> {
    return {
      id: baserowProject.id,
      title: baserowProject.Titre,
      nameTag: baserowProject.NameTag,
      shortDescription: baserowProject['Description courte'],
      image: await this._handleImage(baserowProject.Image, baserowProject.id)
        .then(() => {
          return 'data/' + path.relative(process.cwd(), this._imagePath(baserowProject.id))
        }) // not sure about this.
        // I wanted to avoid using relative path from the source file but is it really better ?
        .catch(() => {
          return ''
        }),
      longDescription: baserowProject['Qu’est-ce que c’est ?'],
      moreDescription: baserowProject['Pour aller plus loin'],
      themes: this.generateThemeList(baserowProject['Thématique principale'], baserowProject['Thématiques secondaires'], baserawThemes),
      mainTheme: this.generateMainTheme(baserowProject['Thématique principale'], baserawThemes),
      programs: this.generateProgramList(baserowProject.Dispositifs),
      linkedProjects: this.generateLinkedProjectList(baserowProject['Projets complémentaires']),
      priority: baserowProject.Prio
    }
  }

  private _imagePath(projectId: number) {
    return path.join(this._outputDirectory, this._imageSubDirectory, projectId.toString())
  }

  private async _handleImage(baserowImage: Image[], projectId: number): Promise<string> {
    if (!baserowImage.length) {
      throw new Error('No image in baserow data')
    }
    const url = baserowImage[0].url

    try {
      const filePath = this._imagePath(projectId)
      const directoryPath = path.dirname(filePath)
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true })
      }
      await this.downloadImage(url, filePath)
      return filePath
    } catch (error) {
      console.error('Error downloading the image:', error)
      throw error
    }
  }

  async downloadImage(url: string, filename: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    fs.writeFile(filename, response.data, (err) => {
      if (err) throw err
      console.log('Image downloaded successfully!', filename)
    })
  }

  generateMainTheme(mainTheme: LinkedObject[], baserawThemes: Theme[]): string {
    if (mainTheme.length != 1) {
      console.warn('Missing mainTheme Or mainTheme not unique in a field')
    }
    const themeId = mainTheme[0].id
    const matchingTheme = baserawThemes.find((theme) => theme.id === themeId)
    if (matchingTheme === undefined) {
      console.warn('theme not found in baserow data (should not happen!)')
      return ''
    }
    return matchingTheme['Nom (Tech)']
  }

  generateThemeList(mainTheme: LinkedObject[], secondaryThemes: LinkedObject[], baserawThemes: Theme[]): string[] {
    const themeList = [this.generateMainTheme(mainTheme, baserawThemes)]
    secondaryThemes.forEach((element) => {
      const themeId = element.id
      const matchingTheme = baserawThemes.find((theme) => theme.id === themeId)
      if (matchingTheme) {
        themeList.push(matchingTheme['Nom (Tech)'])
      } else {
        console.warn('theme not found in baserow data (should not happen!)')
      }
    })
    return themeList
  }

  generateProgramList(programs: LinkedObject[]): string[] {
    return programs.map((value) => {
      return value.value
    })
  }

  generateLinkedProjectList(projects: LinkedObject[]): number[] {
    return projects.map((value) => {
      return value.id
    })
  }

  private _convertToRawProgram(
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

    const domainContactOperator = contactOperator
      .map((contact) => {
        return operators.find((operator) => operator.id === contact.id)
      })
      .filter((operator) => operator !== undefined) as Operator[]

    const domainOtherOperator = otherOperator
      .map((contact) => {
        return operators.find((operator) => operator.id === contact.id)
      })
      .filter((operator) => operator !== undefined) as Operator[]

    const domainGeographicCoverage = geographicCoverage
      .map((contact) => {
        return geographicCoverages.find((operator) => operator.id === contact.id)
      })
      .filter((operator) => operator !== undefined) as GeographicCoverage[]
    const domainProgramGeographicAreas = programGeographicAreas
      .map((contact) => {
        return geographicAreas.find((operator) => operator.id === contact.id)
      })
      .filter((operator) => operator !== undefined) as GeographicAreas[]
    const domainProgramThemes = programThemes
      .map((contact) => {
        return themes.find((operator) => operator.id === contact.id)
      })
      .filter((operator) => operator !== undefined) as Theme[]

    const rawProgram: DataProgram = {
      ...nonModifiedFields,
      Statuts: rawStatuts,
      'Opérateur de contact': domainContactOperator,
      'Autres opérateurs': domainOtherOperator,
      "Nature de l'aide": aidTypes.value as ProgramType,
      'Zones géographiques': domainProgramGeographicAreas,
      'Couverture géographique': domainGeographicCoverage[0],
      'Thèmes Ciblés': domainProgramThemes
    }

    return rawProgram
  }
}
