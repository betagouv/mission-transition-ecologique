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
        v-if="programStore.hasObjectiveTypeFilter()"
        v-model="programFilters.objectiveTypeSelected"
        :tags="objectiveTypeTags"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TeeDsfrTag } from '@/components/element/tag/TeeDsfrTags.vue'
import { useProgramStore } from '@/stores/program'
import { ProgramAidType, type programFiltersType } from '@/types'
import Objective from '@/utils/Objective'
import { DsfrSelect, DsfrSelectProps } from '@gouvminint/vue-dsfr'

const programStore = useProgramStore()

const programFilters: programFiltersType = programStore.programFilters

const objectiveTypeTags = computed<TeeDsfrTag[]>((): TeeDsfrTag[] => {
  const tags: TeeDsfrTag[] = []
  for (const objectiveTag of Objective.getTags()) {
    tags.push({
      label: objectiveTag.tagLabel,
      tagName: 'button',
      small: true,
      'aria-pressed': programFilters.objectiveTypeSelected === objectiveTag.value,
      class:
        programFilters.objectiveTypeSelected === objectiveTag.value && 'color' in objectiveTag
          ? `fr-tag--${objectiveTag.color}`
          : undefined,
      value: objectiveTag.value
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
</script>
