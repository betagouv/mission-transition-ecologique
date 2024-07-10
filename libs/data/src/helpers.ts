// requiring path and fs modules
import * as fs from 'fs'

export const createFolderIfNotExists = (folderName: string): void => {
  try {
    if (!fs.existsSync(folderName)) {
      console.log('📁 Output folder does not exist. Creating...')
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err)
  }
}
