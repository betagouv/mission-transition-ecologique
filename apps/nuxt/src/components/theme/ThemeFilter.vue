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
import { ThemeType, ThemeId, FilterItemKeys, FiltersType } from '@/types'
import { Theme } from '@/tools/theme'
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'
import { computed } from 'vue'

interface Props {
  theme?: ThemeId
}
const props = defineProps<Props>()

const filtersStore = useFiltersStore()

const filters: FiltersType = filtersStore.filters

if (props.theme) {
  filters.themeTypeSelected = props.theme
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
  } else if (tags.length > 1) {
    tags.unshift(allTag)
  }

  return tags
})

function isActive(tag: ThemeType) {
  return Theme.getTags().length === 1 || filters[FilterItemKeys.themeType] === (tag.id as string)
}

const updateThemeTypeSelected = async (value: string | number) => {
  filtersStore.setThemeTypeSelected(value as string)
}
</script>
