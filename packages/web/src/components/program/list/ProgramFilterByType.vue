<template>
  <div class="fr-mb-6v">
    <DsfrCheckboxSet
      v-model="programFilters.programAidTypesSelected"
      legend="Filtrer par nature de l'aide"
      :options="programAidTypeOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramAidType, type programFiltersType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'
import { DsfrCheckboxSet } from '@gouvminint/vue-dsfr'

const programFilters: programFiltersType = useProgramStore().programFilters

const programAidTypeOptions: DsfrCheckboxSetProps['options'] = [
  {
    label: 'Accompagnement',
    id: ProgramAidType.acc,
    name: 'accompagnement'
  },
  {
    label: 'Financement',
    name: 'financement',
    id: ProgramAidType.fund
  },
  {
    label: 'Prêt',
    name: 'pret',
    id: ProgramAidType.loan
  },
  {
    label: 'Avantage fiscal',
    name: 'avantage-fiscal',
    id: ProgramAidType.tax
  },
  {
    label: 'Formation',
    id: ProgramAidType.train,
    name: 'formation'
  }
]
</script>
