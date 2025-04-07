import path from 'path'
import fs from 'fs'
import * as yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import { DataProgram, Status } from '../types/domain'
import { ProgramBaserow } from '../../common/baserow/programBaserow'
import { Logger } from '../../common/logger/logger'
import { CoreGenerator } from './coreGenerator'
import { LoggerType } from '../../common/logger/types'
import { ProgramDataUtils } from '../programData'
import Redirect from '../../common/redirect/redirect'

export class ProgramYamlsGenerator {
  private readonly __dirname = path.dirname(fileURLToPath(import.meta.url))
  outputDirectory: string = path.join(this.__dirname, '../../programs/')
  private _logger: Logger

  constructor() {
    this._logger = new Logger(LoggerType.Program)
  }

  async updatePrograms(): Promise<void> {
    // while working on the script, to avoid hitting Baserow API limits and to decrease our global impact, please cache locally the data :
    // on the first run use getPrograms(false) then for all following call use getPrograms(true)
    const programs = await new ProgramBaserow().getPrograms(false)
    for (const program of programs) {
      if (ProgramDataUtils.isInProd(program)) {
        await this._createProgramYaml(program)
      }
    }

    const redirectWatchedPrograms = programs.filter((program) => {
      return ProgramDataUtils.isInProd(program) || program.Statuts.includes(Status.Replaced)
    })
    new Redirect(this._logger).updateProgramRedirects(redirectWatchedPrograms)

    this._logger.write('programYaml.log')
    return
  }

  private async _createProgramYaml(program: DataProgram) {
    const generator = new CoreGenerator(program, this._logger)
    await generator.process()
    if (generator.valid) {
      const yamlString = yaml.dump(generator.generatedData)
      fs.writeFileSync('programs/' + program['Id fiche dispositif'] + '.yaml', yamlString, 'utf8')
    }
  }
}
