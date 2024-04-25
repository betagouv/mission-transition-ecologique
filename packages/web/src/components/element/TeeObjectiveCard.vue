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
}
const props = defineProps<Props>()

function isPublicodeObjective(objective: PublicodeObjective | ''): objective is PublicodeObjective {
  return objective !== ''
}

const classes = computed(() => {
  if (!isPublicodeObjective(props.objective)) {
    return []
  }
  return ['fr-card--' + Objective.getColorByObjective(props.objective), 'fr-card--horizontal-tier', 'fr-card--no-border']
})
</script>
