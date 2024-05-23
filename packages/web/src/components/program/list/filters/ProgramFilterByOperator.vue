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

const programOperatorOptions: DsfrCheckboxSetProps['options'] = (
  Object.keys(ProgramOperatorType) as (keyof typeof ProgramOperatorType)[]
).map((operatorTypeKey) => ({
  label: ProgramOperatorType[operatorTypeKey],
  name: ProgramOperatorType[operatorTypeKey],
  id: ProgramOperatorType[operatorTypeKey]
}))
</script>
