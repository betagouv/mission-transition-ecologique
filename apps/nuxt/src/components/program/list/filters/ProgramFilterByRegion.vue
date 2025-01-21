<template>
  <DsfrCheckboxSet
    v-model="programFilters[FilterItemKeys.regionAid]"
    small
    :options="programRegionsOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { Region, type ProgramFiltersType, FilterItemKeys } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr'

const programFilters: ProgramFiltersType = useProgramStore().programFilters
const programRegionsOptions: DsfrCheckboxSetProps['options'] = (Object.keys(Region) as (keyof typeof Region)[]).map((regionTypeKey) => ({
  label: Region[regionTypeKey],
  name: Region[regionTypeKey],
  id: Region[regionTypeKey],
  value: Region[regionTypeKey],
  modelValue: [Region[regionTypeKey]]
}))
</script>
