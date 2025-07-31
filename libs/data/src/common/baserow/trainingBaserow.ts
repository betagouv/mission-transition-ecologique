import { AbstractBaserow } from './abstractBaserow'
import { BaserowTraining } from './types'
import { Training } from '../../trainings/types'

export class TrainingBaserow extends AbstractBaserow {
  private readonly _tableId = 620771
  private _trainings: BaserowTraining[] = []

  async getAll(): Promise<BaserowTraining[]> {
    return (this._trainings = await this._getTableData<BaserowTraining>(this._tableId))
  }

  async patchOrCreate(training: Training): Promise<void> {
    if (!this._trainings.length) {
      throw new Error('TrainingBaserow: No trainings loaded. Call getAll() first.')
    }

    const match = this._trainings.find((baserowTraining) => baserowTraining['Id Ademe'] === training.id)

    const payload: Partial<BaserowTraining> = {
      'Id Ademe': training.id,
      'Futures Sessions': training.session ? JSON.stringify(Array.isArray(training.session) ? training.session : [training.session]) : '',
      Titre: training.Libellé_de_la_formation,
      Promesse: training.Chapeau_pour_site_web,
      'Url ADEME': training.Lien_URL_vers_la_fiche_programme,
      Objectifs: training.Objectifs_de_la_formation,
      Thématique: training.Thème._,
      Modalité: training.Modalité_de_dispense._ + '  |  ' + training.Modalités_et_moyens_pédagogiques,
      'Codes Sections': Array.isArray(training.Id_section_code) ? training.Id_section_code.map((item) => item.id).join(', ') : '',
      Cible: training.Public_cible,
      Programme: training.Programme,
      Prérequis: training.Prérequis,
      Tarif: training.Tarif_net_de_taxes,
      Durée: training.Durée_totale_en_heures,
      'Nombre de jours': training.Nombre_de_jours_de_formation,
      'Nombre de sessions à venir': Array.isArray(training.session) ? training.session.length : training.session ? 1 : 0,
      'Nombre de participants par session':
        'De ' + training.Nombre_de_participants_minimum + ' à ' + training.Nombre_de_participants_maximum
    }

    if (match && match.id) {
      await this._patchRow(this._tableId, match.id, payload)
    } else {
      await this._createRow(this._tableId, payload)
    }
  }
}
