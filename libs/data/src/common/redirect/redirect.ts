import { redirects } from '../../../static/index'
import { ProgramDataUtils } from '../../program/programData'
import { ProgramBaserow } from '../baserow/programBaserow'
import { ProjectBaserow } from '../baserow/projectBaserow'
import { RedirectsBaserow } from '../baserow/redirectBaserow'
import { Logger } from '../logger/logger'
import { LoggerType } from '../logger/types'
import { RedirectJson } from './types'

export default class Redirect {
  private readonly _jsonPath = '../../../static/redirects.json'

  async generateRedirectJson() {
    const currentJsonData = redirects as unknown as RedirectJson
    console.log(currentJsonData)

    //program renaming redirects
    const programs = await new ProgramBaserow().getPrograms(false)

    const test: Record<number, string> = {}
    for (const program of programs) {
      if (!ProgramDataUtils.isInProd(program)) {
        continue
      }
      test[program.id] = program['Id fiche dispositif']
    }
    console.log(test)

    // project renaming redirects
    const projects = await new ProjectBaserow('unused', new Logger(LoggerType.Project)).getRawValidProjects()

    const test2: Record<number, string> = {}
    for (const project of projects) {
      test2[project.id] = project.Nom
    }
    console.log(test2)

    // redirect table
    const temp = await new RedirectsBaserow().getAll()
    // Pas convaincu par le format.
    // peut être juste old id; new id ?
    // et un mapping par id : current_url, old_urls
    console.log(temp)
  }
}
