<template>
  <DsfrCheckboxSet
    v-model="programFilters.regionAidSelected"
    :options="programRegionsOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { Region, type programFiltersType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'

const programFilters: programFiltersType = useProgramStore().programFilters
const programRegionsOptions: DsfrCheckboxSetProps['options'] = (Object.keys(Region) as (keyof typeof Region)[]).map((regionTypeKey) => ({
  label: Region[regionTypeKey],
  name: Region[regionTypeKey],
  id: Region[regionTypeKey]
}))
</script>
