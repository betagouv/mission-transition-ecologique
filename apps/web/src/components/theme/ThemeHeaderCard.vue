<template>
  <DsfrCard
    v-if="Theme.isTheme(theme) || !isResultPage"
    horizontal
    title="Thématique"
    :description="Theme.getTitleById(theme as ThemeId)"
    :img-src="Theme.getImageById(theme as ThemeId)"
    :class="classes"
    size="sm"
    no-arrow
  />
</template>

<script setup lang="ts">
import { Theme } from '@/utils/theme'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { ThemeId } from '@/types'
import { useNavigationStore } from '@/stores/navigation'
import { RouteName } from '@/types/routeType'

interface Props {
  theme: ThemeId
  radiusCorner?: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'r' | 'b' | 'l' | 'a'
  radiusSize?: '0' | '1v' | '2v' | '2-5v'
}
const props = defineProps<Props>()
const navigationStore = useNavigationStore()
const isResultPage = navigationStore.isByRouteName(RouteName.QuestionnaireResult)

function getRadiusClass() {
  const { radiusCorner, radiusSize } = props
  if (!radiusCorner) {
    return null
  }
  if (radiusSize) {
    return `fr-radius-md-${radiusCorner}--${radiusSize}`
  }

  return `fr-radius-md-${radiusCorner}`
}

const classes = computed(() => {
  if (!Theme.isTheme(props.theme)) {
    return []
  }

  return [
    'fr-card-banner',
    'fr-card--' + Theme.getColorById(props.theme),
    'fr-card--horizontal-tier',
    'fr-card--no-border',
    'fr-col-content--middle',
    getRadiusClass()
  ]
})
</script>
