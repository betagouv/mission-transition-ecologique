<template>
  <DsfrCheckboxSet
    v-model="programFilters.regionAidSelected"
    :options="programRegionsOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { Regions, type programFiltersType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'

const programFilters: programFiltersType = useProgramStore().programFilters
const programRegionsOptions: DsfrCheckboxSetProps['options'] = (Object.keys(Regions) as (keyof typeof Regions)[]).map((regionTypeKey) => ({
  label: Regions[regionTypeKey],
  name: Regions[regionTypeKey],
  id: Regions[regionTypeKey]
}))
</script>
