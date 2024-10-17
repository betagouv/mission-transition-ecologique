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
    fs.writeFile(fullPath, data, (err) => {
      if (err) {
        console.log('Error writing file:', err)
      } else if (successMessage) {
        console.log(successMessage)
      }
    })
  }
}
