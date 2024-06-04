import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

import { BaserowImage, BaserowLinkedObject, BaserowProject, RawProject } from './types'

dotenv.config()
const API_TOKEN = process.env.BASEROW_TOKEN
const BASE_URL = 'https://api.baserow.io/api'
const databaseId = 114839

export async function buildProjectsJSONOutputs(): Promise<void> {
  const tableId = 305253

  const baserawProjects = (await getTableData(tableId)) as BaserowProject[]
  const validBaserawProjects = baserawProjects.filter((value) => {
    return !value.OK // To invert when we have a valid BD !
  })
  const rawProjects = await Promise.all(
    validBaserawProjects.map(async (project) => {
      return await convertToRawProjectType(project)
    })
  )
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

async function convertToRawProjectType(baserowProject: BaserowProject): Promise<RawProject> {
  return {
    id: baserowProject.id,
    title: baserowProject.Titre,
    nameTag: baserowProject.NameTag,
    shortDescription: baserowProject['Description courte'],
    image: await handleImage(baserowProject.Image, baserowProject.id)
      .then(() => {
        return 'done'
      })
      .catch(() => {
        return ''
      }),
    longDescription: baserowProject['Qu’est-ce que c’est ?'],
    moreDescription: baserowProject['Pour aller plus loin'],
    themes: generateThemeList(baserowProject['Thématique principale'], baserowProject['Thématiques secondaires']),
    mainTheme: baserowProject['Thématique principale'].length ? baserowProject['Thématique principale'][0].value : 'Non renseigné',
    programs: generateProgramList(baserowProject.Dispositifs),
    linkedProjects: generateLinkedProjectList(baserowProject['Projets complémentaires'])
  }
}

function generateThemeList(mainTheme: BaserowLinkedObject[], secondaryThemes: BaserowLinkedObject[]): string[] {
  const themeList = [mainTheme.length ? mainTheme[0].value : 'data expected']
  secondaryThemes.forEach((element) => {
    themeList.push(element.value)
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
    return ''
  }
  console.log('in handle image core code')
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

// function validateIds(rawProject: RawProject): Project {
//   throw new Error('Funcion not implemented.')
// }
// The main idea is to cheack that each id will properly link to an object and to display if it isn't the case.
// I can also check if the programs are active.

// TODO : i shoud invert the logic. Instead of going every project i parallel, i think i should descend them vertically.
// TODO : swap to class
