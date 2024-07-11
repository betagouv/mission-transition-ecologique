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
import { ThemeType, type programFiltersType, PublicodeObjective } from '@/types'
import Theme from '@/utils/theme'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'
import { computed, onBeforeMount } from 'vue'

interface Props {
  objective?: PublicodeObjective | ''
}

const props = defineProps<Props>()

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

  for (const tag of Theme.getTags()) {
    tags.push({
      label: tag.tagLabel,
      tagName: 'button',
      ariaPressed: isActive(tag),
      color: isActive(tag) && 'color' in tag ? tag.color : undefined,
      value: tag.value as string
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

function isActive(tag: ThemeType) {
  return Theme.getTags().length === 1 || programFilters.objectiveTypeSelected === (tag.value as string)
}

onBeforeMount(() => {
  if (props.objective) {
    programFilters.objectiveTypeSelected = props.objective
  }
})
</script>
