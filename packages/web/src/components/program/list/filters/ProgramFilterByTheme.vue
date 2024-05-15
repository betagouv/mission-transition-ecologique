<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-4v">
    <div
      v-if="programStore.hasObjectiveTypeFilter()"
      class="fr-col-12 fr-col-sm-6"
    >
      <DsfrSelect
        v-model="programFilters.objectifTypeSelected"
        :options="objectifTypeOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { PublicodeObjective, type programFiltersType } from '@/types'
import { DsfrSelect } from '@gouvminint/vue-dsfr'
import type { DsfrSelectProps } from '@gouvminint/vue-dsfr/types/components/DsfrSelect/DsfrSelect.types'

const programFilters: programFiltersType = useProgramStore().programFilters

const programStore = useProgramStore()

const objectifTypeOptions: DsfrSelectProps['options'] = [
  {
    text: 'Filtrer par objectif',
    value: ''
  },
  {
    text: '🌱 Stratégie environnementale',
    value: PublicodeObjective.EnvironmentalImpact
  },
  {
    text: '⚡️ Énergie',
    value: PublicodeObjective.EnergyPerformance
  },
  {
    text: '💧 Eau',
    value: PublicodeObjective.WaterConsumption
  },
  {
    text: '🏢 Bâtiment',
    value: PublicodeObjective.BuildingRenovation
  },
  {
    text: '🚲 Mobilité',
    value: PublicodeObjective.SustainableMobility
  },
  {
    text: '🗑 Déchets',
    value: PublicodeObjective.WasteManagement
  },
  {
    text: '🏭 Production',
    value: PublicodeObjective.EcoDesign
  },
  {
    text: '🧑‍🎓 RH',
    value: PublicodeObjective.TrainOrRecruit
  }
]
</script>
