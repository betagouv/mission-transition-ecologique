import { EstablishmentNotFoundError, SearchResult } from '../../../domain/types'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { Result } from 'true-myth'
import { EstablishmentRepository } from '../../../domain/spi'
import { ensureError } from '../../../../common/domain/error/errors'
import { RechercheEntrepriseEstablishment, RechercheEntrepriseSearch } from './type'
import Monitor from '../../../../common/domain/monitoring/monitor'

export class RechercheEntreprise {
  public searchEstablishment: EstablishmentRepository['search'] = async (query: string, resultCount: number) => {
    const api_url = `https://recherche-entreprises.api.gouv.fr/search?q=${query}&per_page=${resultCount}&etat_administratif=A`

    try {
      const response: AxiosResponse<RechercheEntrepriseSearch> = await axios.get(api_url)

      const establishmentList = this._convertToSearchResult(response.data)
      return Result.ok(establishmentList)
    } catch (err: unknown) {
      let error = ensureError(err)
      Monitor.exception(error, { query })

      if (error instanceof AxiosError) {
        if (error.response && error.response.status == 404) {
          error = new EstablishmentNotFoundError()
        }
      }

      return Result.err(error)
    }
  }

  private _convertToSearchResult(rechercheEntrepriseSearch: RechercheEntrepriseSearch): SearchResult {
    if (!rechercheEntrepriseSearch.results) {
      return {
        establishments: [],
        resultCount: 0
      }
    }
    const establishmentList = rechercheEntrepriseSearch.results
      .filter((result: RechercheEntrepriseEstablishment) => result.siege?.siret)
      .map((result: RechercheEntrepriseEstablishment) => ({
        siret: result.siege.siret,
        siren: result.siege.siret.substring(0, 9),
        nic: result.siege.siret.substring(9),
        creationDate: result.date_creation,
        denomination: result.nom_raison_sociale || result.nom_complet,
        nafCode: result.activite_principale,
        legalCategory: result.nature_juridique,
        address: {
          streetNumber: result.siege.numero_voie,
          streetType: result.siege.type_voie,
          streetLabel: result.siege.libelle_voie,
          zipCode: result.siege.code_postal,
          cityLabel: result.siege.libelle_commune,
          cityCode: result.siege.commune
        },
        workforceRange: result.tranche_effectif_salarie
      }))
    return {
      establishments: establishmentList,
      resultCount: establishmentList.length ? rechercheEntrepriseSearch.total_results : 0
    }
  }
}
