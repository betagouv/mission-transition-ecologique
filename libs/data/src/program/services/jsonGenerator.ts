import path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { FileManager } from '../../common/fileManager'
import { ProgramStaticBaseType } from '../types/shared'
import * as yaml from 'js-yaml'

const OUTPUT_FOLDER_PATH = '../../../static'
const OUTPUT_FILENAME = 'programs.json'
const INTERFACE_PATH = '../futureLegacy/interface.yaml'

export class JsonGenerator {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly outputDir = path.join(this.__dirname, OUTPUT_FOLDER_PATH)

  async export(programs: ProgramStaticBaseType[]): Promise<void> {
    const enrichedPrograms = this.prependPublicodesInterface(programs)
    this.writeFile(enrichedPrograms)
    console.log('🖊️  Program Json successfully written')
  }

  async prependPublicodesInterface(programs: ProgramStaticBaseType[]): Promise<unknown> {
    const interfacePath = path.join(this.__dirname, INTERFACE_PATH)
    const file = fs.readFileSync(interfacePath, 'utf8')
    const constants = yaml.load(file) as Record<string, unknown>
    return programs.map((program) => {
      const publicodes = { ...constants, ...(program['publicodes'] || {}) }

      return { ...program, publicodes }
    })
  }

  async writeFile(programs: unknown) {
    const dataAsJson = JSON.stringify(programs, null, 2)
    FileManager.createFolderIfNotExists(this.outputDir)
    const dataOutPath = path.join(this.outputDir, OUTPUT_FILENAME)
    fs.writeFileSync(dataOutPath, dataAsJson, 'utf8')
  }
}
