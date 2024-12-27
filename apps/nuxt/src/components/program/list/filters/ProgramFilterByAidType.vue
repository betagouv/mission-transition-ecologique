<template>
  <DsfrCheckboxSet
    v-model="filters[FilterItemKeys.typeAid]"
    small
    :options="programAidTypeOptions"
  />
</template>

<script setup lang="ts">
import { FilterItemKeys, FiltersType, ProgramAidType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr'

const filters: FiltersType = useFiltersStore().filters
const programAidTypeOptions: DsfrCheckboxSetProps['options'] = [
  {
    label: 'Étude',
    id: ProgramAidType.study,
    name: ProgramAidType.study,
    value: ProgramAidType.study,
    modelValue: [ProgramAidType.study]
  },
  {
    label: 'Financement',
    name: ProgramAidType.fund,
    id: ProgramAidType.fund,
    value: ProgramAidType.fund,
    modelValue: [ProgramAidType.fund]
  },
  {
    label: 'Prêt',
    name: ProgramAidType.loan,
    id: ProgramAidType.loan,
    value: ProgramAidType.loan,
    modelValue: [ProgramAidType.loan]
  },
  {
    label: 'Avantage fiscal',
    name: ProgramAidType.tax,
    id: ProgramAidType.tax,
    value: ProgramAidType.tax,
    modelValue: [ProgramAidType.tax]
  },
  {
    label: 'Formation',
    id: ProgramAidType.train,
    name: ProgramAidType.train,
    value: ProgramAidType.train,
    modelValue: [ProgramAidType.train]
  }
]
</script>
