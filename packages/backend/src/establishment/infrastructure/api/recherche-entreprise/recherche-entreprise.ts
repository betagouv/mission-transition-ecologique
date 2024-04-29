import { EstablishmentNotFoundError } from '../../../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Result } from 'true-myth'
import { EstablishmentRepository } from '../../../domain/spi'
import { ensureError } from '../../../../common/domain/error/errors'
import { RechercheEntrepriseEstablishement, RechercheEntrepriseSearch } from './type'
import { EstablishementDisplay } from '@tee/common/src/establishement/types'

export class RechercheEntreprise {
  public searchEstablishment: EstablishmentRepository['search'] = async (query) => {
    const api_url = `https://recherche-entreprises.api.gouv.fr/search?q="${query}"&per_page=5`

    try {
      const response: AxiosResponse<RechercheEntrepriseSearch> = await axios.get(api_url)

      const establishmentList = this._convertToEsblishmentDisplay(response.data)

      return Result.ok(establishmentList)
    } catch (err: unknown) {
      let error = ensureError(err)

      if (error instanceof AxiosError) {
        if (error.response && error.response.status == 404) {
          error = new EstablishmentNotFoundError()
        }
      }

      return Result.err(error)
    }
  }

  private _convertToEsblishmentDisplay(rechercheEntrepriseSearch: RechercheEntrepriseSearch): EstablishementDisplay[] {
    if (!rechercheEntrepriseSearch.results) {
      return []
    }

    return rechercheEntrepriseSearch.results.map((result: RechercheEntrepriseEstablishement) => ({
      siret: result.siege.siret,
      creationDate: result.date_creation,
      address: `${result.siege.numero_voie} ${result.siege.type_voie} ${result.siege.libelle_voie}, ${result.siege.code_postal} ${result.siege.libelle_commune}`,
      sector: result.activite_principale, //TODO map from nafCode TO naflabel
      name: result.nom_raison_sociale,
      region: result.siege.commune //TODO map from codepostal TO region
      // create another intermediary type from infra to domain.
      // then do the conversions inside the domain.
    }))
  }
}
