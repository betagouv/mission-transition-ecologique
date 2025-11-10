import fs from 'fs'
import path from 'path'
import * as yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import { ProgramStaticBaseType } from '../types/shared'

export class YamlGenerator {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  private readonly outputDir = path.join(this.__dirname, '../../../programs/')

  async export(programs: ProgramStaticBaseType[]): Promise<void> {
    for (const program of programs) {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { id, eligibilityData, ...yamlData } = program

      const yamlString = yaml.dump(yamlData)
      const filePath = path.join(this.outputDir, `${id}.yaml`)
      fs.writeFileSync(filePath, yamlString, 'utf8')
    }
  }
}
