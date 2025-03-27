<template>
  <div>
    <div
      class="fr-container--fluid fr-container--fluid--no-overflow fr-mt-0 fr-mb-12v"
      style="min-height: 800px"
    >
      <CatalogPrograms />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import { RouteName } from '@/types'
import { useFiltersStore } from '@/stores/filters'
import { useCompanyDataStore } from '#imports'

definePageMeta({
  name: RouteName.CatalogPrograms,
  middleware: [MiddlewareName.resetUsedTrackStore, MiddlewareName.resetQueries, MiddlewareName.resetFilters]
})

const { isDataFull } = storeToRefs(useCompanyDataStore())

watch(isDataFull, (value) => {
  useFiltersStore().setCompanyDataSelected(value)
})
</script>
