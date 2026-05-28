import { administrationNaturesJuridiques, administrationWhitelist, administrationBlacklist } from '@tee/data/static'
import { AdministrationClassifierType } from '../../domain/spi'

export class AdministrationClassifier implements AdministrationClassifierType {
  // Mirrors the annuaire-entreprises rule ordering (search-infra is_administration):
  // missing legal nature, blacklist and closed unit short-circuit to false;
  // whitelist forces true; otherwise the legal nature code must belong to the administration list.
  // Cf: https://github.com/annuaire-entreprises-data-gouv-fr/search-infra/blob/main/workflows/data_pipelines/elasticsearch/data_enrichment.py#L173
  public isAdministration(legalCategory: string, siren: string, etatAdministratif?: string): boolean {
    if (!legalCategory) {
      return false
    }
    if (siren in administrationBlacklist) {
      return false
    }
    if (etatAdministratif === 'C') {
      return false
    }
    if (siren in administrationWhitelist) {
      return true
    }
    return legalCategory in administrationNaturesJuridiques
  }
}
