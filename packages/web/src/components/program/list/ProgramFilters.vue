<template>
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-4v">
    <div class="fr-col-12 fr-col-sm-6">
      <DsfrSelect
        v-model="programFilters.programAidTypeSelected"
        :options="programAidTypeOptions"
      />
    </div>
    <div class="fr-col-12 fr-col-sm-6">
      <TeeDsfrTags
        v-model="programFilters.objectifTypeSelected"
        :tags="objectiveTypeTags"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TeeDsfrTag } from '@/components/element/tag/TeeDsfrTags.vue'
import { useProgramStore } from '@/stores/program'
import { Objectives, ProgramAidType, type programFiltersType } from '@/types'
import { DsfrSelect, DsfrSelectProps } from '@gouvminint/vue-dsfr'

const programFilters: programFiltersType = useProgramStore().programFilters

const objectiveTypeTags = computed<TeeDsfrTag[]>((): TeeDsfrTag[] => {
  const tags: TeeDsfrTag[] = []
  for (const objectiveType of objectiveTypes) {
    tags.push({
      label: objectiveType.label,
      tagName: 'button',
      small: true,
      'aria-pressed': programFilters.objectifTypeSelected === objectiveType.value,
      class:
        programFilters.objectifTypeSelected === objectiveType.value && objectiveType.color ? `fr-tag--${objectiveType.color}` : undefined,
      value: objectiveType.value
    })
  }

  return tags
})

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

const objectiveTypes = [
  {
    label: 'Tous',
    value: ''
  },
  {
    label: '🌱 Stratégie environnementale',
    value: Objectives.EnvironmentalImpact,
    color: 'blue'
  },
  {
    label: '⚡️ Énergie',
    value: Objectives.EnergyPerformance,
    class: 'yellow'
  },
  {
    label: '💧 Eau',
    value: Objectives.WaterConsumption,
    class: 'blue'
  },
  {
    label: '🏢 Bâtiment',
    value: Objectives.BuildingRenovation,
    class: 'red'
  },
  {
    label: '🚲 Mobilité',
    value: Objectives.SustainableMobility,
    class: 'green'
  },
  {
    label: '🗑 Déchets',
    value: Objectives.WasteManagement,
    class: 'red'
  },
  {
    label: '🏭 Production',
    value: Objectives.EcoDesign,
    class: 'green'
  },
  {
    label: '🧑‍🎓 RH',
    value: Objectives.TrainOrRecruit,
    class: 'yellow'
  }
]
</script>
