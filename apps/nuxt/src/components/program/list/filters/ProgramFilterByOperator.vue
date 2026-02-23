<template>
  <DsfrCheckboxSet
    v-model="filters[FilterItemKeys.operatorAid]"
    small
    :options="programOperatorOptions"
  />
</template>

<script setup lang="ts">
import { Operator } from '@/tools/operator'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr'
import { FilterItemKeys, FiltersType } from '@/types'
import { useFiltersStore } from '@/stores/filters'

const filters: FiltersType = useFiltersStore().filters

const programOperatorOptions: DsfrCheckboxSetProps['options'] = new Operator().getFilterItems()
</script>
