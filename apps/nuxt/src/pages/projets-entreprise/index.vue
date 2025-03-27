<template>
  <div>
    <div
      class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
      style="min-height: 800px"
    >
      <CatalogProjects />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types'
import { useCompanyDataStore } from '@/stores/companyData'
import { useFiltersStore } from '@/stores/filters'

definePageMeta({
  name: RouteName.CatalogProjects,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const { isDataFull } = storeToRefs(useCompanyDataStore())

watch(isDataFull, (value) => {
  useFiltersStore().setCompanyDataSelected(value)
})
</script>
