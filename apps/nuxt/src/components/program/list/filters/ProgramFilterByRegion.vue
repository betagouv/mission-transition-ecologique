<template>
  <DsfrCheckboxSet
    v-model="useFiltersStore().filters[FilterItemKeys.regionAid]"
    small
    :options="programRegionsOptions"
  />
</template>

<script setup lang="ts">
import { FilterItemKeys, Region } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr'
import { useFiltersStore } from '@/stores/filters'

const programRegionsOptions: DsfrCheckboxSetProps['options'] = (Object.keys(Region) as (keyof typeof Region)[]).map((regionTypeKey) => ({
  label: Region[regionTypeKey],
  name: Region[regionTypeKey],
  id: Region[regionTypeKey],
  value: Region[regionTypeKey],
  modelValue: [Region[regionTypeKey]]
}))
</script>
