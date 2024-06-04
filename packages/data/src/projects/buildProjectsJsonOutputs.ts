import axios from 'axios'
import dotenv from 'dotenv'
import { BaserowImage, BaserowLinkedObject, BaserowProject, RawProject } from './types'
import path from 'path'

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
  const rawProjects = validBaserawProjects.map(async (project) => {
    return await convertToRawProjectType(project)
  })
  console.log(rawProjects[0])
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

import fs from 'fs'
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


// It should be restrained in baserow
// but to be certain that my implem will not create any bugs
// I will add a manual validation to check that all added highlightProjects Id are the ProjectJson.

// function validateIds(rawProject: RawProject): Project {
//   throw new Error('Funcion not implemented.')
// }
