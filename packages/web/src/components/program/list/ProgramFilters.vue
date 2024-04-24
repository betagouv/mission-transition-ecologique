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
import { PublicodeObjective, ProgramAidType, type programFiltersType } from '@/types'
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
    value: PublicodeObjective.EnvironmentalImpact,
    color: 'blue'
  },
  {
    label: '⚡️ Énergie',
    value: PublicodeObjective.EnergyPerformance,
    class: 'yellow'
  },
  {
    label: '💧 Eau',
    value: PublicodeObjective.WaterConsumption,
    class: 'blue'
  },
  {
    label: '🏢 Bâtiment',
    value: PublicodeObjective.BuildingRenovation,
    class: 'red'
  },
  {
    label: '🚲 Mobilité',
    value: PublicodeObjective.SustainableMobility,
    class: 'green'
  },
  {
    label: '🗑 Déchets',
    value: PublicodeObjective.WasteManagement,
    class: 'red'
  },
  {
    label: '🏭 Production',
    value: PublicodeObjective.EcoDesign,
    class: 'green'
  },
  {
    label: '🧑‍🎓 RH',
    value: PublicodeObjective.TrainOrRecruit,
    class: 'yellow'
  }
]
</script>
