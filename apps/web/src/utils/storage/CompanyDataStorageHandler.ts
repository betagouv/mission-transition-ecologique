import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import { useNavigationStore } from '@/stores/navigation'
import { EstablishmentFront, StructureSize, TrackId } from '@/types'
import { CompanyDataType } from '@/types/companyDataType'

export class CompanyDataStorageHandler {
  static populateFromStorage(questionnaireData: { [k: string]: any }) {
    if (CompanyDataStorage.hasData()) {
      const companyData: CompanyDataType = CompanyDataStorage.getData().value
      Object.entries(companyData).forEach(([key, value]) => {
        if (value !== null) {
          if (Object.values(StructureSize).includes(value as StructureSize) && questionnaireData[key] !== value) {
            questionnaireData[key] = value
          } else if (typeof value === 'object' && !Array.isArray(value)) {
            Object.entries(value).forEach(([k, v]) => {
              if (questionnaireData[k] !== v) {
                questionnaireData[k] = v
              }
            })
          }
        }
      })
    }
  }

  static updateSearchParamFromStorage() {
    if (CompanyDataStorage.hasCompanyData()) {
      useNavigationStore().updateSearchParam({
        name: TrackId.Siret,
        value: (CompanyDataStorage.getCompanyData() as EstablishmentFront)?.siret
      })
    }

    if (CompanyDataStorage.hasSize()) {
      useNavigationStore().updateSearchParam({
        name: TrackId.StructureWorkforce,
        value: CompanyDataStorage.getSize()
      })
    }
  }
}
