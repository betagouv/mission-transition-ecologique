<template>
  <DsfrCard
    v-if="Theme.isPublicodeObjective(objective)"
    horizontal
    title="Thématique"
    :description="Theme.getTitleByValue(objective)"
    :img-src="Theme.getImageByValue(objective)"
    :class="classes"
    size="sm"
    no-arrow
  />
</template>

<script setup lang="ts">
import Theme from '@/utils/theme'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { PublicodeObjective } from '@/types'

interface Props {
  objective: PublicodeObjective | ''
  radiusCorner?: 'tl' | 'tr' | 'bl' | 'br' | 't' | 'r' | 'b' | 'l' | 'a'
  radiusSize?: '0' | '0-5v' | '1v' | '2v' | '2-5v'
}
const props = defineProps<Props>()

function getRadiusClass() {
  const { radiusCorner, radiusSize } = props
  if (!radiusCorner) {
    return null
  }
  if (radiusSize) {
    return `fr-radius-${radiusCorner}--${radiusSize}`
  }

  return `fr-radius-${radiusCorner}`
}

const classes = computed(() => {
  if (!Theme.isPublicodeObjective(props.objective)) {
    return []
  }

  return [
    'fr-card-banner',
    'fr-card--' + Theme.getColorByValue(props.objective),
    'fr-card--horizontal-tier',
    'fr-card--no-border',
    getRadiusClass()
  ]
})
</script>
