<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-4v">
    <div class="fr-col-12 fr-col-sm-6">
      <DsfrSelect
        v-model="programFilters.programAidTypeSelected"
        :options="programAidTypeOptions"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-6">
      <DsfrSelect
        v-model="programFilters.objectifTypeSelected"
        :options="objectifTypeOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { Objective, ProgramAidType, type programFiltersType } from '@/types'
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

const objectifTypeOptions: DsfrSelectProps['options'] = [
  {
    text: 'Filtrer par objectif',
    value: ''
  },
  {
    text: '🌱 Stratégie environnementale',
    value: Objective.EnvironmentalImpact
  },
  {
    text: '⚡️ Énergie',
    value: Objective.EnergyPerformance
  },
  {
    text: '💧 Eau',
    value: Objective.WaterConsumption
  },
  {
    text: '🏢 Bâtiment',
    value: Objective.BuildingRenovation
  },
  {
    text: '🚲 Mobilité',
    value: Objective.SustainableMobility
  },
  {
    text: '🗑 Déchets',
    value: Objective.WasteManagement
  },
  {
    text: '🏭 Production',
    value: Objective.EcoDesign
  },
  {
    text: '🧑‍🎓 RH',
    value: Objective.TrainOrRecruit
  }
]
</script>
