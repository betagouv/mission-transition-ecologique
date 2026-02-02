import fs from 'fs'

export class FileManager {
  static readJson<T>(filepath: string) {
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data) as T
  }

  static writeJson(fullPath: string, data: unknown, successMessage?: string) {
    const dataJson = JSON.stringify(data, null, 2)
    this.writeRaw(fullPath, dataJson, successMessage)
  }

  static writeRaw(fullPath: string, data: string, successMessage?: string) {
    try {
      fs.writeFileSync(fullPath, data)
      if (successMessage) {
        console.log(successMessage)
      }
    } catch (err) {
      console.log('Error writing file:', err)
    }
  }

  static createFolderIfNotExists(folderName: string): void {
    try {
      if (!fs.existsSync(folderName)) {
        console.log('📁 Output folder does not exist. Creating...')
        fs.mkdirSync(folderName)
      }
    } catch (err) {
      console.error(err)
    }
  }
}
