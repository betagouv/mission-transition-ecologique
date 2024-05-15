<template>
  <DsfrCheckboxSet
    v-model="programFilters.programAidTypesSelected"
    :legend="legend"
    :options="programAidTypeOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramAidType, type programFiltersType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'

interface Props {
  legend?: string
}
withDefaults(defineProps<Props>(), {
  legend: "Filtrer par nature de l'aide"
})

const programFilters: programFiltersType = useProgramStore().programFilters
const programAidTypeOptions: DsfrCheckboxSetProps['options'] = [
  {
    label: 'Accompagnement',
    id: ProgramAidType.acc,
    name: ProgramAidType.acc
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
