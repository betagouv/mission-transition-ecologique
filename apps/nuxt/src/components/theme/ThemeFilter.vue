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
import { ThemeType, ThemeId, FilterItemKeys, FiltersType, TrackId } from '@/types'
import { Theme } from '@/tools/theme'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'
import Navigation from '@/tools/navigation'

interface Props {
  theme?: ThemeId
}
const props = defineProps<Props>()

const filtersStore = useFiltersStore()
const route = useRoute()
const filters: FiltersType = filtersStore.filters
if (route.query.theme) {
  filters[FilterItemKeys.themeType] = route.query.theme as ThemeId
}

if (props.theme) {
  filters[FilterItemKeys.themeType] = props.theme
}

const themeTypeTags = computed<TeeDsfrTagProps[]>((): TeeDsfrTagProps[] => {
  const allTag: TeeDsfrTagProps = {
    label: 'Tous',
    tagName: 'button',
    value: '',
    selectable: true,
    selected: filters[FilterItemKeys.themeType] === ''
  }

  const tags: TeeDsfrTagProps[] = []

  for (const tag of Theme.getTags()) {
    tags.push({
      label: tag.tagLabel,
      selected: isActive(tag),
      selectable: true,
      color: isActive(tag) && 'color' in tag ? tag.color : undefined,
      value: tag.id
    })
  }

  if (tags.length === 1) {
    filtersStore.setThemeTypeSelected((tags.shift() as TeeDsfrTagProps).value as string)
  } else if (tags.length > 1) {
    tags.unshift(allTag)
  }

  return tags
})

function isActive(tag: ThemeType) {
  return Theme.getTags().length === 1 || filters[FilterItemKeys.themeType] === (tag.id as string)
}

const updateThemeTypeSelected = (value: string | number | undefined) => {
  filtersStore.setThemeTypeSelected(value as string)

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
