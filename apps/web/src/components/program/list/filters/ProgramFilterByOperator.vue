<template>
  <DsfrCheckboxSet
    v-model="programFilters.operatorAidSelected"
    small
    :options="programOperatorOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr'
import { type programFiltersType } from '@/types'

import { enrichedOperators } from '@tee/data/static'

const programFilters: programFiltersType = useProgramStore().programFilters

const allOperatorsOptionsArray = enrichedOperators.map((enrichedOperators) => enrichedOperators.filterCategories).flat()
const operatorsOptionsSet = new Set(allOperatorsOptionsArray)
const operatorsOptionsArray = Array.from(operatorsOptionsSet)
const programOperatorOptions: DsfrCheckboxSetProps['options'] = operatorsOptionsArray
  .map((programOperator) => getItem(programOperator))
  .sort((a, b) => a.label.localeCompare(b.label))

function getItem(programOperator: string) {
  return { label: programOperator, name: programOperator, id: programOperator }
}
</script>
