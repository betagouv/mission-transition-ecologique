import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const API_TOKEN = process.env.BASEROW_TOKEN // Replace with your actual API token
const BASE_URL = 'https://api.baserow.io/api'
const databaseId = 114839

export async function buildProjectsJSONOutputs(): Promise<void> {
  const tableId = 305253

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await getTableData(tableId)
  console.log(data)
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
    console.error('Error fetching table data:', error)
    return []
  }
}

// function remapFields(data: any[]): any[] {
//   const fieldMappings: Record<string, string> = {
//     Nom: 'Name',
//     Titre: 'Title'
//     // Add more mappings as needed
//   }

//   return data.map((row) => {
//     const remappedRow: Record<string, any> = {}
//     for (const key in row) {
//       if (fieldMappings[key]) {
//         remappedRow[fieldMappings[key]] = row[key]
//       } else {
//         remappedRow[key] = row[key]
//       }
//     }
//     return remappedRow
//   })
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

// It should be restrained in baserow
// but to be certain that my implem will not create any bugs
// I will add a manual validation to check that all added highlightProjects Id are the ProjectJson.
