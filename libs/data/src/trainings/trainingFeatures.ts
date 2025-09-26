import { parseStringPromise } from 'xml2js'
import axios from 'axios'
import { Training } from './types'
import { TrainingBaserow } from '../common/baserow/trainingBaserow'

export class TrainingFeatures {
  async loadTrainings(): Promise<void> {
    const trainings = await this.getXmlData()
    await this.updateDatabase(trainings)
    return
  }

  private async getXmlData(): Promise<Training[]> {
    const xmlPath = 'https://formations.ademe.fr/tmp/flux_formations_agir.xml'
    const xmlContent = await axios.get(xmlPath).then((res) => res.data)
    const parsed = await parseStringPromise(xmlContent, { mergeAttrs: true, explicitArray: false })

    return parsed.formations.module || []
  }

  private async updateDatabase(trainings: Training[]): Promise<void> {
    const trainingBaserow = new TrainingBaserow()
    await trainingBaserow.getAll()
    for (const training of trainings) {
      await trainingBaserow.patchOrCreate(training)
      await new Promise((res) => setTimeout(res, 200))
    }
  }
}
