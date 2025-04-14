import { FilterItemKeys } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { FiltersType } from '@/types/filters/filtersTypes'

export const useFiltersStore = defineStore('filters', () => {
  const filters = ref<FiltersType>({
    [FilterItemKeys.typeAid]: [],
    [FilterItemKeys.themeType]: '',
    [FilterItemKeys.operatorAid]: []
  })

  const regions = ref<string[]>([])

  const companyDataSelected = ref<boolean>(true)

  function hasThemeTypeSelected() {
    return filters.value[FilterItemKeys.themeType] !== ''
  }

  function setThemeTypeSelected(themeType: string) {
    filters.value[FilterItemKeys.themeType] = themeType
  }

  function setRegionSelected(regionsSelected: string[]) {
    regions.value = regionsSelected
  }

  function getThemeTypeSelected() {
    return filters.value[FilterItemKeys.themeType]
  }

  function setCompanyDataSelected(value: boolean) {
    companyDataSelected.value = value
  }

  function getCompanyDataSelected() {
    return companyDataSelected
  }

  function resetFilters() {
    filters.value = {
      [FilterItemKeys.typeAid]: [],
      [FilterItemKeys.themeType]: '',
      [FilterItemKeys.operatorAid]: []
    }
    regions.value = []
    setCompanyDataSelected(true)
  }

  function resetFilter(filterKey: FilterItemKeys) {
    if (filterKey === FilterItemKeys.themeType) {
      filters.value[filterKey] = ''
      return
    }

    if (filterKey === FilterItemKeys.regionAid) {
      regions.value = []
      return
    }

    filters.value[filterKey] = []
  }

  return {
    filters,
    hasThemeTypeSelected,
    getThemeTypeSelected,
    setThemeTypeSelected,
    regions,
    setRegionSelected,
    companyDataSelected,
    setCompanyDataSelected,
    getCompanyDataSelected,
    resetFilters,
    resetFilter
  }
})
