import { establishmentsTests } from '@tee/data/static'
import { Result } from 'true-myth'
import { EstablishmentRepository } from '../../../domain/spi'
import { RechercheEntreprise } from './recherche-entreprise'
import { RechercheEntrepriseEstablishment } from './type'

/**
 * Serves recorded "recherche-entreprises" results instead of calling the real API,
 * so that tests running on test data do not depend on a third-party service.
 * An unknown query behaves like a search without result.
 */
export class RechercheEntrepriseTest extends RechercheEntreprise {
  public override searchEstablishment: EstablishmentRepository['search'] = async (query: string) => {
    const establishment = (establishmentsTests as Record<string, RechercheEntrepriseEstablishment>)[query.replace(/\s/g, '')]
    const results = establishment ? [establishment] : []

    return Promise.resolve(
      Result.ok(
        this._convertToSearchResult({
          results: results,
          total_results: results.length,
          page: 1,
          per_page: results.length,
          total_pages: 1
        })
      )
    )
  }
}
