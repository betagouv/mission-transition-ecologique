import { ConvertedCommune } from '@tee/common'

export interface GeoSearch {
  searchByName(searchValue: string): ConvertedCommune[]
  searchByCityCode(searchValue: string): ConvertedCommune[]
}
