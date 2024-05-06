<template>
  <div class="fr-col-12 fr-col-sm-6">
    <DsfrSelect
      v-model="programFilters.programAidTypeSelected"
      :options="programAidTypeOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramAidType, type programFiltersType } from '@/types'
import { DsfrSelect } from '@gouvminint/vue-dsfr'
import type { DsfrSelectProps } from '@gouvminint/vue-dsfr/types/components/DsfrSelect/DsfrSelect.types'

const programFilters: programFiltersType = useProgramStore().programFilters

const programAidTypeOptions: DsfrSelectProps['options'] = [
  {
    text: "Filtrer par nature de l'aide",
    value: ''
  },
  {
    text: 'Accompagnement',
    value: ProgramAidType.acc
  },
  {
    text: 'Financement',
    value: ProgramAidType.fund
  },
  {
    text: 'Prêt',
    value: ProgramAidType.loan
  },
  {
    text: 'Avantage fiscal',
    value: ProgramAidType.tax
  },
  {
    text: 'Formation',
    value: ProgramAidType.train
  }
]
</script>
