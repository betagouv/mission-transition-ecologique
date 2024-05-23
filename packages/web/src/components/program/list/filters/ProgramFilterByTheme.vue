<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div
      v-if="programStore.hasObjectiveTypeFilter()"
      class="fr-col-12"
    >
      <TeeDsfrTags
        v-model="programFilters.objectiveTypeSelected"
        :tags="objectiveTypeTags"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ObjectiveType, type programFiltersType } from '@/types'
import Objective from '@/utils/objective'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'

const programStore = useProgramStore()

const programFilters: programFiltersType = programStore.programFilters

const objectiveTypeTags = computed<TeeDsfrTagProps[]>((): TeeDsfrTagProps[] => {
  const allTag: TeeDsfrTagProps = {
    label: 'Tous',
    tagName: 'button',
    value: '',
    ariaPressed: programFilters.objectiveTypeSelected === ''
  }

  const tags: TeeDsfrTagProps[] = []

  for (const objectiveTag of Objective.getTags()) {
    tags.push({
      label: objectiveTag.tagLabel,
      tagName: 'button',
      ariaPressed: isActive(objectiveTag),
      color: isActive(objectiveTag) && 'color' in objectiveTag ? objectiveTag.color : undefined,
      value: objectiveTag.value as string
    })
  }

  if (tags.length === 1) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    programStore.setObjectiveTypeSelected((tags.shift() as TeeDsfrTagProps).value as string)
  } else if (tags.length > 1) {
    tags.unshift(allTag)
  }

  return tags
})

function isActive(objectiveTag: ObjectiveType) {
  return Objective.getTags().length === 1 || programFilters.objectiveTypeSelected === (objectiveTag.value as string)
}
</script>
