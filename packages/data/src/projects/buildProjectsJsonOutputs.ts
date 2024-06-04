import axios from 'axios'
import dotenv from 'dotenv'
import { BaserowLinkedObject, BaserowProject, RawProject } from './types'

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
  const rawProjects = validBaserawProjects.map((project) => {
    return convertToRawProjectType(project)
  })
  console.log(rawProjects)
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

function convertToRawProjectType(baserowProject: BaserowProject): RawProject {
  console.log(baserowProject)
  return {
    id: baserowProject.id,
    title: baserowProject.Titre,
    nameTag: baserowProject.NameTag,
    shortDescription: baserowProject['Description courte'],
    image: 'TODO',
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

// It should be restrained in baserow
// but to be certain that my implem will not create any bugs
// I will add a manual validation to check that all added highlightProjects Id are the ProjectJson.

// function validateIds(rawProject: RawProject): Project {
//   throw new Error('Funcion not implemented.')
// }

// image field :
// "Image": [
//     {
//         "url": "https://files.baserow.io/user_files/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
//         "thumbnails": {
//             "tiny": {
//                 "url": "https://files.baserow.io/media/thumbnails/tiny/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
//                 "width": 21,
//                 "height": 21
//             },
//             "small": {
//                 "url": "https://files.baserow.io/media/thumbnails/small/VXotniBOVm8tbstZkKsMKbj2Qg7KmPvn_39d354a76abe56baaf569ad87d0333f58ee4bf3eed368e3b9dc736fd18b09dfd.png",
//                 "width": 48,
//                 "height": 48
//             }
//         },
