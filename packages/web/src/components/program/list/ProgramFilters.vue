<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-4v">
    <div class="fr-col">
      <DsfrSelect
        v-model="programAidTypeSelected"
        :options="programAidTypeOptions"
      />
    </div>
    <div class="fr-col">
      <DsfrSelect
        v-model="objectifTypeSelected"
        :options="objectifTypeOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Objectives, ProgramAidType } from '@/types'
import { DsfrSelect } from '@gouvminint/vue-dsfr'
import { ref } from 'vue'

const programAidTypeSelected = ref<null | ProgramAidType>(null)
const objectifTypeSelected = ref<null | Objectives>(null)

const programAidTypeOptions = [
  {
    text: "Filtrer par nature de l'aide",
    value: null
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

const objectifTypeOptions = [
  {
    text: 'Filtrer par objectif',
    value: null
  },
  {
    text: '🌱 Stratégie environnementale',
    value: Objectives.EnvironmentalImpact
  },
  {
    text: '⚡️ Énergie',
    value: Objectives.EnergyPerformance
  },
  {
    text: '💧 Eau',
    value: Objectives.WaterConsumption
  },
  {
    text: '🏢 Bâtiment',
    value: Objectives.BuildingRenovation
  },
  {
    text: '🚲 Mobilité',
    value: Objectives.SustainableMobility
  },
  {
    text: '🗑 Déchets',
    value: Objectives.WasteManagement
  },
  {
    text: '🏭 Production',
    value: Objectives.EcoDesign
  },
  {
    text: '🧑‍🎓 RH',
    value: Objectives.TrainOrRecruit
  }
]
</script>
