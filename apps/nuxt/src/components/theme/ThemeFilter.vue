<template>
  <div class="fr-container fr-grid-row fr-px-md-0">
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
import { useUsedTrackStore } from '@/stores/usedTrack'
import { ThemeType, TrackId, ThemeId, FilterItemKeys, FiltersType } from '@/types'
import { Theme } from '@/tools/theme'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'
import Navigation from '@/tools/navigation'

interface Props {
  theme?: ThemeId
}
const props = defineProps<Props>()

const filtersStore = useFiltersStore()
const usedTrackStore = useUsedTrackStore()
const route = useRoute()
const filters: FiltersType = filtersStore.filters
if (route.query.theme) {
  filters[FilterItemKeys.themeType] = route.query.theme as ThemeId
}
let hasAllTag = true

if (props.theme) {
  filters[FilterItemKeys.themeType] = props.theme
}

if (UsedTrack.isSpecificGoal()) {
  hasAllTag = false
}

const themeTypeTags = computed<TeeDsfrTagProps[]>((): TeeDsfrTagProps[] => {
  const allTag: TeeDsfrTagProps = {
    label: 'Tous',
    tagName: 'button',
    value: '',
    'aria--pressed': filters[FilterItemKeys.themeType] === ''
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
    filtersStore.setThemeTypeSelected((tags.shift() as TeeDsfrTagProps).value as string)
  } else if (tags.length > 1 && hasAllTag) {
    tags.unshift(allTag)
  }

  return tags
})

function isActive(tag: ThemeType) {
  return Theme.getTags().length === 1 || filters[FilterItemKeys.themeType] === (tag.id as string)
}

const updateThemeTypeSelected = async (value: string | number) => {
  filtersStore.setThemeTypeSelected(value as string)
  if (UsedTrack.isSpecificGoal() && UsedTrack.hasPriorityTheme()) {
    await usedTrackStore.updateByTrackIdAndValue(TrackId.Goals, value as string)
    useNavigationStore().replaceBrowserHistory()
  }

  const navigation = new Navigation()
  if (navigation.isCatalog()) {
    useNavigationStore().updateSearchParam({
      name: 'theme' as TrackId,
      value: value as string
    })
    useNavigationStore().replaceBrowserHistory()
  }
}
</script>
