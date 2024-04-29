<template>
  <DsfrCard
    v-if="Objective.isPublicodeObjective(objective)"
    horizontal
    title="Thématique"
    :description="Objective.getTitleByObjective(objective)"
    :img-src="Objective.getImageByObjective(objective)"
    :class="classes"
    size="sm"
    no-arrow
  />
</template>

<script setup lang="ts">
import Objective from '@/utils/objective'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { PublicodeObjective } from '@tee/common/src/questionnaire/types'

interface Props {
  objective: PublicodeObjective | ''
  radiusCorner?: 'tl' | 'tr' | 'bl' | 'br'
  radiusSize?: 'sm' | 'md' | 'lg' | '0'
}
const props = defineProps<Props>()

function getRadiusClass() {
  const { radiusCorner, radiusSize } = props
  if (!radiusCorner) {
    return null
  }
  if (radiusSize) {
    return `fr-radius-${radiusCorner}-${radiusSize}`
  }

  return `fr-radius-${radiusCorner}`
}

const classes = computed(() => {
  if (!Objective.isPublicodeObjective(props.objective)) {
    return []
  }
  return ['fr-card--' + Objective.getColorByObjective(props.objective), 'fr-card--horizontal-tier', 'fr-card--no-border', getRadiusClass()]
})
</script>
