<template>
  <DsfrCheckboxSet
    v-model="filters[FilterItemKeys.operatorAid]"
    small
    :options="programOperatorOptions"
  />
</template>

<script setup lang="ts">
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr'
import { FilterItemKeys, FiltersType, OperatorFilter } from '@/types'

import { enrichedOperators } from '@tee/data/static'
import { useFiltersStore } from '@/stores/filters'

const filters: FiltersType = useFiltersStore().filters

const operatorsOptions = [...new Set(enrichedOperators.flatMap((enrichedOperators) => enrichedOperators.filterCategories))]
const programOperatorOptions: DsfrCheckboxSetProps['options'] = operatorsOptions
  .map((programOperator) => getItem(programOperator))
  .sort((a, b) => a.label.localeCompare(b.label))

function getItem(programOperator: OperatorFilter) {
  return { label: programOperator, name: programOperator, id: programOperator, value: programOperator, modelValue: [programOperator] }
}
</script>
