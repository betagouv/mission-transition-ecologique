<template>
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12">
      <TeeDsfrTags
        :tags="themeTypeTags"
        @update:model-value="updateThemeTypeSelected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { ThemeType, type ProgramFiltersType, TrackId, ThemeId, FilterItemKeys } from '@/types'
import { Theme } from '@/tools/theme'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import { computed } from 'vue'

interface Props {
  theme?: ThemeId
}
const props = defineProps<Props>()

const programStore = useProgramStore()
const usedTrackStore = useUsedTrackStore()

const programFilters: ProgramFiltersType = programStore.programFilters
let hasAllTag = true

if (props.theme) {
  programFilters.themeTypeSelected = props.theme
}

if (UsedTrack.isSpecificGoal()) {
  hasAllTag = false
}

const themeTypeTags = computed<TeeDsfrTagProps[]>((): TeeDsfrTagProps[] => {
  const allTag: TeeDsfrTagProps = {
    label: 'Tous',
    tagName: 'button',
    value: '',
    'aria--pressed': programFilters[FilterItemKeys.themeType] === ''
  }

  const tags: TeeDsfrTagProps[] = []

  for (const tag of Theme.getTags()) {
    tags.push({
      label: tag.tagLabel,
      tagName: 'button',
      'aria--pressed': isActive(tag),
      color: isActive(tag) && 'color' in tag ? tag.color : undefined,
      value: tag.id
    })
  }

  if (tags.length === 1) {
    programStore.setThemeTypeSelected((tags.shift() as TeeDsfrTagProps).value as string)
  } else if (tags.length > 1 && hasAllTag) {
    tags.unshift(allTag)
  }

  return tags
})

function isActive(tag: ThemeType) {
  return Theme.getTags().length === 1 || programFilters[FilterItemKeys.themeType] === (tag.id as string)
}

const updateThemeTypeSelected = async (value: string | number) => {
  programStore.setThemeTypeSelected(value as string)
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme()) {
    await usedTrackStore.updateByTrackIdAndValue(TrackId.Goals, value as string)
    useNavigationStore().replaceBrowserHistory()
  }
}
</script>
