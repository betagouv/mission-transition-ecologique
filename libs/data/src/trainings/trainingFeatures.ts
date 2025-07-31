import { parseStringPromise } from 'xml2js'
import axios from 'axios'
import { Training } from './types'
import { BaserowTraining } from '../common/baserow/types'
import { TrainingBaserow } from '../common/baserow/trainingBaserow'

export class TrainingFeatures {
  async loadTrainings(): Promise<Training[]> {
    const xmlPath = 'https://formations.ademe.fr/tmp/flux_formations_agir.xml'
    const xmlContent = await axios.get(xmlPath).then((res) => res.data)
    const parsed = await parseStringPromise(xmlContent, { mergeAttrs: true, explicitArray: false })
    const formations: Training[] = parsed.formations.module || []

    const trainingBaserow = new TrainingBaserow()
    const existingTrainings: BaserowTraining[] = await trainingBaserow.getAll()
    for (const formation of formations) {
      await trainingBaserow.patchOrCreate(formation, existingTrainings)
      await new Promise((res) => setTimeout(res, 200))
    }

    return []
  }
}
