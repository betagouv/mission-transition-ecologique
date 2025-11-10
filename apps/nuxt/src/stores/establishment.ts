import EstablishmentApi from '@/tools/api/establishmentApi'
import { CompanyActivityType, normalizeString } from '@tee/common'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEstablishmentStore = defineStore('establishment', () => {
  const activities = ref<CompanyActivityType[]>([])

  async function searchActivities(searchTerm: string) {
    if (activities.value.length === 0) {
      const results = await new EstablishmentApi().searchActivities()
      if (results.isOk()) {
        activities.value = results.data
      }
      return activities.value
    }

    const normalizedSearchTerm = normalizeString(searchTerm)
    if (normalizedSearchTerm === '') {
      return activities.value
    }

    const isSearchByNAfCode = /^\d{1,2}(\.?(\d{1,2}[A-Z]?)?)?$/.test(searchTerm)
    if (isSearchByNAfCode) {
      return activities.value.filter((activity) => normalizeString(activity.codeNAF).startsWith(normalizedSearchTerm))
    }

    if (searchTerm.length === 1) {
      return activities.value.filter((activity) => normalizeString(activity.codeNAF1) === normalizedSearchTerm)
    }

    return activities.value.filter((activity) => normalizeString(activity.secteur).includes(normalizedSearchTerm))
  }

  return {
    activities,
    searchActivities
  }
})
