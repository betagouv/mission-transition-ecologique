<template>
  <div
    class="fr-grid-row fr-grid-row--center fr-text-center fr-grid-row--middle fr-my-auto fr-py-md-1w"
    :class="bgClass"
  >
    <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-2 fr-col-hidden-xs fr-col-unhidden-md">
      <div class="fr-col-12">
        <TeeButtonLink
          :to="previousRoute"
          icon="fr-icon-arrow-left-line"
        >
          Retour
        </TeeButtonLink>
      </div>
    </div>
    <div class="fr-px-md-2v fr-my-auto fr-col-hidden-xs fr-col-unhidden-md fr-col-md-8 fr-col-lg-9 fr-col-xl-8 fr-text--sm fr-px-0">
      <div class="fr-container">
        <TeeGroupBar
          :infos="criteria"
          bg-color="blue--light"
          radius-size="2v"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Format from '@/utils/format'
import TrackStructure from '@/utils/track/trackStructure'
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  bgColor: string
  bgLight?: boolean
  previousRoute: RouteLocationRaw
}

const props = defineProps<Props>()

const criteria = [
  {
    icon: 'fr-icon-check-line',
    text: Format.truncate(TrackStructure.getSizeTitle(), 30)
  },
  {
    icon: 'fr-icon-check-line',
    text: Format.capitalize(Format.truncate(TrackStructure.getSector(), 30))
  },
  {
    icon: 'fr-icon-check-line',
    text: Format.truncate(TrackStructure.getLocalisation(), 30)
  }
]

if (TrackStructure.hasSiret()) {
  criteria.unshift({
    icon: 'fr-icon-check-line',
    text: Format.truncate('SIRET ' + TrackStructure.getSiret(), 30)
  })
}

const bgClass = computed(() => {
  if (props.bgColor) {
    return [`fr-bg--${props.bgColor}${props.bgLight ? '--light' : ''}`]
  }

  return []
})
</script>
