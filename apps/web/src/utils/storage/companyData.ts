import { TrackId } from '@/types'
import { CompanyDataId } from '@/types/companyDataType'
import { useCompanyDataStore } from '@/stores/companyData'

export default class CompanyData {
  static isPersisted(trackId: TrackId) {
    return Object.values(CompanyDataId).includes(trackId as unknown as CompanyDataId)
  }

  static hasData() {
    const data = useCompanyDataStore().data
    return data ? Object.entries(data).some((datum) => datum !== null) : false
  }
}
