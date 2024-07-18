<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <TeeDsfrTags
        :tags="objectiveTypeTags"
        @update:model-value="updateObjectiveTypeSelected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { ThemeType, type programFiltersType, Objective, TrackId } from '@/types'
import { Theme } from '@/utils/theme'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'
import UsedTrack from '@/utils/track/usedTrack'
import { computed, onBeforeMount } from 'vue'

interface Props {
  objective?: Objective | ''
}
const props = defineProps<Props>()

const programStore = useProgramStore()
const usedTrackStore = useUsedTrackStore()

const programFilters: programFiltersType = programStore.programFilters

const hasAllTag = ref(true)

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
    programStore.setObjectiveTypeSelected((tags.shift() as TeeDsfrTagProps).value as string)
  } else if (tags.length > 1 && hasAllTag.value) {
    tags.unshift(allTag)
  }

  return tags
})

function isActive(tag: ThemeType) {
  return Theme.getTags().length === 1 || programFilters.objectiveTypeSelected === (tag.value as string)
}

const updateObjectiveTypeSelected = async (value: string) => {
  programStore.setObjectiveTypeSelected(value)
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityObjective()) {
    await usedTrackStore.updateByTrackIdAndValue(TrackId.Goals, value)
    useNavigationStore().replaceBrowserHistory()
  }
}

onBeforeMount(() => {
  if (props.objective) {
    programFilters.objectiveTypeSelected = props.objective
  }

  if (UsedTrack.isSpecificGoal()) {
    hasAllTag.value = false
  }
})
</script>
