import { ProgramUpdater } from './programDto/programUpdater'
import { JsonGenerator } from './services/jsonGenerator'
import { YamlGenerator } from './services/yamlsGenerator'
import { TypeGenerator } from './services/typeGenerator'
import { AdemeThemeJsonGenerator } from '../ademeTheme/ademeThemeJsonGenerator'
import { AdemeThemeBaserow } from '../common/baserow/ademeThemeBaserow'

export class ProgramFeatures {
  async updatePrograms(): Promise<void> {
    const programs = await new ProgramUpdater().getProcessedProgramsAndGenerateRedirects()

    await new YamlGenerator().export(programs)
    await new JsonGenerator().export(programs)
    await new AdemeThemeJsonGenerator().export(await new AdemeThemeBaserow().getAll())
  }

  async generateProgramType(): Promise<void> {
    await new TypeGenerator().generateProgramType()
  }
}
