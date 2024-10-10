<template>
  <DsfrCheckboxSet
    v-model="programFilters.programAidTypesSelected"
    small
    :options="programAidTypeOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramAidType, type programFiltersType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr'

const programFilters: programFiltersType = useProgramStore().programFilters
const programAidTypeOptions: DsfrCheckboxSetProps['options'] = [
  {
    label: 'Étude',
    id: ProgramAidType.study,
    name: ProgramAidType.study
  },
  {
    label: 'Financement',
    name: ProgramAidType.fund,
    id: ProgramAidType.fund
  },
  {
    label: 'Prêt',
    name: ProgramAidType.loan,
    id: ProgramAidType.loan
  },
  {
    label: 'Avantage fiscal',
    name: ProgramAidType.tax,
    id: ProgramAidType.tax
  },
  {
    label: 'Formation',
    id: ProgramAidType.train,
    name: ProgramAidType.train
  }
]
</script>
