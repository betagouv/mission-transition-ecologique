import path from 'path'
import fs from 'fs'
import { Baserow } from '@/common/baserow/baserow'
import { Program } from './types'

export class ProgramYamlGenerator {
  outputDirectory: string = path.join(__dirname, '../../programs/')

  async createProgramYamls(): Promise<void> {
    const programs = await new Baserow(this.outputDirectory).getPrograms()
    this._validateData(programs)
    this._writeYaml(programs)
    return
  }

  private _validateData(programs:Program[]) {
    console.log("validate program todo", programs)
    // programs.forEach((program) => {
    //   this._validateX(program)
    // })
  }

  private _writeYaml(programs:Program[]) {
    console.log("write  yaml todo", programs)
    // const projectJson = JSON.stringify(rawProjects)
    // const fullPath = path.join(this.outputDirectory, 'project.json')
    // fs.writeFile(fullPath, projectJson, (err) => {
    //   if (err) {
    //     console.log('Error writing file:', err)
    //   } else {
    //     console.log('Successfully wrote file')
    //   }
    // })
  }
}
