import { ProgramUpdater } from './programDto/programUpdater'
import { JsonGenerator } from './services/jsonGenerator'
import { YamlGenerator } from './services/yamlsGenerator'
import { TypeGenerator } from './services/typeGenerator'

export class ProgramFeatures {
  async updatePrograms(): Promise<void> {
    const programs = await new ProgramUpdater().getProcessedProgramsAndGenerateRedirects()

    await new YamlGenerator().export(programs) // working
    await new JsonGenerator().export(programs)
  }

  async generateProgramType(): Promise<void> {
    await new TypeGenerator().generateProgramType()
  }
}
