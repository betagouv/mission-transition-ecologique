import { FilterItemKeys } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { FiltersType } from '@/types/filters/filtersTypes'

export const useFiltersStore = defineStore('filters', () => {
  const filters = ref<FiltersType>({
    [FilterItemKeys.typeAid]: [],
    [FilterItemKeys.themeType]: '',
    [FilterItemKeys.regionAid]: [],
    [FilterItemKeys.operatorAid]: [],
    [FilterItemKeys.companyData]: false
  })

  function hasThemeTypeSelected() {
    return filters.value[FilterItemKeys.themeType] !== ''
  }

  function setThemeTypeSelected(themeType: string) {
    filters.value[FilterItemKeys.themeType] = themeType
  }

  function getThemeTypeSelected() {
    return filters.value[FilterItemKeys.themeType]
  }

  function resetFilters() {
    filters.value = {
      [FilterItemKeys.typeAid]: [],
      [FilterItemKeys.themeType]: '',
      [FilterItemKeys.regionAid]: [],
      [FilterItemKeys.operatorAid]: [],
      [FilterItemKeys.companyData]: false
    }
  }

  function resetFilter(filterKey: FilterItemKeys) {
    if (filterKey === FilterItemKeys.themeType) {
      filters.value[filterKey] = ''
      return
    } else if (filterKey === FilterItemKeys.companyData) {
      filters.value[filterKey] = false
      return
    }
    filters.value[filterKey] = []
  }

  return {
    filters,
    hasThemeTypeSelected,
    getThemeTypeSelected,
    setThemeTypeSelected,
    resetFilters,
    resetFilter
  }
})
