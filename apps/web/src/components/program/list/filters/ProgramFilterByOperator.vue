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
import { OperatorFilter, type programFiltersType } from '@/types'

import { enrichedOperators } from '@tee/data/static'

const programFilters: programFiltersType = useProgramStore().programFilters

const operatorsOptions = [...new Set(enrichedOperators.flatMap((enrichedOperators) => enrichedOperators.filterCategories))]
const programOperatorOptions: DsfrCheckboxSetProps['options'] = operatorsOptions
  .map((programOperator) => getItem(programOperator))
  .sort((a, b) => a.label.localeCompare(b.label))

function getItem(programOperator: OperatorFilter) {
  return { label: programOperator, name: programOperator, id: programOperator }
}
</script>
