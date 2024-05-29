<template>
  <DsfrCheckboxSet
    v-model="programFilters.operatorAidSelected"
    small
    :options="programOperatorOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'
import { ProgramOperatorType, type programFiltersType } from '@/types'

const programFilters: programFiltersType = useProgramStore().programFilters
const programOperatorOptions: DsfrCheckboxSetProps['options'] = Object.values(ProgramOperatorType)
  .map((programOperator) => getItem(programOperator))
  .sort((a, b) => a.label.localeCompare(b.label))

function getItem(programOperator: ProgramOperatorType) {
  if (programOperator === ProgramOperatorType.MTES) {
    return { label: 'MTES', name: programOperator, id: programOperator }
  }

  return { label: programOperator, name: programOperator, id: programOperator }
}
</script>
