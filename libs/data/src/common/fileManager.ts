import fs from 'fs'

export class FileManager {
  static readJson<T>(filepath: string) {
    const data = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(data) as T
  }

  static writeJson(fullPath: string, data: unknown, successMessage?: string) {
    const dataJson = JSON.stringify(data, null, 2)
    fs.writeFile(fullPath, dataJson, (err) => {
      if (err) {
        console.log('Error writing file:', err)
      } else if (successMessage) {
        console.log(successMessage)
      }
    })
  }
}
