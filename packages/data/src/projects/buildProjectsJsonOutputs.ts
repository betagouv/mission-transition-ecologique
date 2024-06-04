import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { BaserowImage, BaserowLinkedObject, BaserowProject, BaserowTheme, RawProject } from './types'

dotenv.config()
const API_TOKEN = process.env.BASEROW_TOKEN
const BASE_URL = 'https://api.baserow.io/api'
const databaseId = 114839
// const updateImages = true

const themeTableId = 305258

export async function buildProjectsJSONOutputs(): Promise<void> {
  const projectTableId = 305253

  const baserawProjects = (await getTableData(projectTableId)) as BaserowProject[]
  const baserawThemes = (await getTableData(themeTableId)) as BaserowTheme[]
  const validBaserawProjects = baserawProjects.filter((value) => {
    return !value.OK // TODO To invert when we have a valid BD !
  })
  const rawProjects = await Promise.all(
    validBaserawProjects.map(async (project) => {
      return await convertToRawProjectType(project, baserawThemes)
    })
  )

  validateData(rawProjects)

  writeJson(rawProjects, './generated/projects.json')
  return
}

async function getTableData(tableId: number) {
  try {
    const response = await axios.get(`${BASE_URL}/database/rows/table/${tableId}/?user_field_names=true`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      },
      params: {
        database_id: databaseId
      }
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return response.data.results
  } catch (error) {
    console.error('Error fetching project data from baserow:', error)
    return []
  }
}

async function convertToRawProjectType(baserowProject: BaserowProject, baserawThemes: BaserowTheme[]): Promise<RawProject> {
  return {
    id: baserowProject.id,
    title: baserowProject.Titre,
    nameTag: baserowProject.NameTag,
    shortDescription: baserowProject['Description courte'],
    image: await handleImage(baserowProject.Image, baserowProject.id)
      .then(() => {
        return `./generated/projectImages/${baserowProject.id}` //TODO check consistency with other static file path.
      })
      .catch(() => {
        return ''
      }),
    longDescription: baserowProject['Qu’est-ce que c’est ?'],
    moreDescription: baserowProject['Pour aller plus loin'],
    themes: generateThemeList(baserowProject['Thématique principale'], baserowProject['Thématiques secondaires'], baserawThemes),
    mainTheme: generateMainTheme(baserowProject['Thématique principale'], baserawThemes),
    programs: generateProgramList(baserowProject.Dispositifs),
    linkedProjects: generateLinkedProjectList(baserowProject['Projets complémentaires'])
  }
}

function generateMainTheme(mainTheme: BaserowLinkedObject[], baserawThemes: BaserowTheme[]): string {
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

function generateThemeList(
  mainTheme: BaserowLinkedObject[],
  secondaryThemes: BaserowLinkedObject[],
  baserawThemes: BaserowTheme[]
): string[] {
  const themeList = [generateMainTheme(mainTheme, baserawThemes)]
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

function generateProgramList(programs: BaserowLinkedObject[]): string[] {
  return programs.map((value) => {
    return value.value
  })
}

function generateLinkedProjectList(projects: BaserowLinkedObject[]): number[] {
  return projects.map((value) => {
    return value.id
  })
}

async function handleImage(baserowImage: BaserowImage[], projectId: number): Promise<string> {
  if (!baserowImage.length) {
    throw new Error('No image in baserow data')
  }
  const url = baserowImage[0].url

  try {
    // Ensure the output directory exists
    const directoryPath = path.resolve('./generated/projectImages')
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true })
    }
    const filePath = path.resolve(directoryPath, projectId.toString())
    await downloadImage(url, filePath)
    return filePath
  } catch (error) {
    console.error('Error downloading the image:', error)
    throw error
  }
}

async function downloadImage(url: string, filename: string) {
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  fs.writeFile(filename, response.data, (err) => {
    if (err) throw err
    console.log('Image downloaded successfully!', filename)
  })
}

function writeJson(rawProjects: RawProject[], filePath: string) {
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

import jsonPrograms from '@tee/data/generated/dataset_out.json'

import Theme from '@tee/common/src/theme/theme'
import { Program } from '@/type/program'
function validateData(rawProjects: RawProject[]) {
  const programs = jsonPrograms as unknown as Program[]
  rawProjects.forEach((project) => {
    // validate Themes
    project.themes.forEach((themeId) => {
      const themeFound = Theme.themes.some((theme) => theme.id === themeId)
      if (!themeFound) {
        console.warn(`In Project "${project.title}", id ${project.id}, unknown theme-id: ${themeId}`)
      }
    })

    // Validate linked Projects
    project.linkedProjects.forEach((projectId) => {
      const projectFound = rawProjects.some((project) => project.id === projectId)
      if (!projectFound) {
        console.warn(`In Project "${project.title}", id ${project.id}, unknown project-id: ${projectId}`)
      }
    })

    // Validate Programs :
    project.programs.forEach((programId) => {
      const programFound = programs.some((program) => program.id === programId)
      if (!programFound) {
        console.warn(`In Project "${project.title}", id ${project.id}, unknown program-id: ${programId}`)
      }
    })
  })
  return
}

// TODO : swap to class
// Separate baserow from generic code that would stay the same wo baserow !

// Note : should be executed AFTER the program generation !

// Questions :
// 1
// should i use the baserow field names ex "qu'est ce que c'est?" ou baserow field ids ?
// Using fieldNames will break more often but seem more robust to check unwanted changes.
// 2
// I feel like that producing augmented themes will lead to complications :
// how to let front end dev moke some change without regenerating the full data ?
// The place where the data is defined by the devs and where its imported from will differ. That feels weird !
// 3
// image location ?
//
//
