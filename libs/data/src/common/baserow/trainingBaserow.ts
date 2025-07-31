import { AbstractBaserow } from './abstractBaserow'
import { BaserowTraining } from './types'
import { Training } from '../../trainings/types'

export class TrainingBaserow extends AbstractBaserow {
  private readonly _tableId = 620771

  async getAll(): Promise<BaserowTraining[]> {
    return this._getTableData<BaserowTraining>(this._tableId)
  }

  async patchOrCreate(training: Training, existingTrainings: BaserowTraining[]): Promise<void> {
    const match = existingTrainings.find((baserowTraining) => baserowTraining['Id Ademe'] === training.id)

    const payload: Partial<BaserowTraining> = {
      'Id Ademe': training.id,
      'Futures Sessions': training.session ? JSON.stringify(Array.isArray(training.session) ? training.session : [training.session]) : '',
      Titre: training.Libellé_de_la_formation,
      Promesse: training.Chapeau_pour_site_web,
      'Url ADEME': training.Lien_URL_vers_la_fiche_programme,
      Objectifs: training.Objectifs_de_la_formation
    }

    if (match && match.id) {
      await this._patchRow(this._tableId, match.id, payload)
    } else {
      await this._createRow(this._tableId, payload)
    }
  }
}
