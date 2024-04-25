<template>
  <DsfrCard
    v-if="isPublicodeObjective(objective)"
    horizontal
    title="Thématique"
    :description="Objective.getTitleByObjective(objective)"
    :img-src="Objective.getImageByObjective(objective)"
    :class="classes"
    no-arrow
  />
</template>

<script setup lang="ts">
import Objective from '@/utils/Objective'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { PublicodeObjective } from '@tee/common/src/questionnaire/types'

interface Props {
  objective: PublicodeObjective | ''
  radiusCorner?: 'tl' | 'tr' | 'bl' | 'br'
  radiusSize?: 'sm' | 'md' | 'lg' | '0'
}
const props = defineProps<Props>()

function isPublicodeObjective(objective: PublicodeObjective | ''): objective is PublicodeObjective {
  return objective !== ''
}

function getRadiusClass() {
  const { radiusCorner, radiusSize } = props
  console.log(`TeeObjectiveCard > getRadiusClass > radiusCorner:`, radiusCorner)
  console.log(`TeeObjectiveCard > getRadiusClass > radiusSize:`, radiusSize)
  if (!radiusCorner) {
    return null
  }
  if (radiusSize) {
    return `fr-radius-${radiusCorner}-${radiusSize}`
  }

  return `fr-radius-${radiusCorner}`
}

const classes = computed(() => {
  if (!isPublicodeObjective(props.objective)) {
    return []
  }
  return ['fr-card--' + Objective.getColorByObjective(props.objective), 'fr-card--horizontal-tier', 'fr-card--no-border', getRadiusClass()]
})
// radiusCorner
// radiusSize
</script>
