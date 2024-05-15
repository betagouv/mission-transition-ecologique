<template>
  <div
    class="fr-grid-row fr-grid-row--center fr-text-center fr-grid-row--middle fr-my-auto"
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
    <div class="fr-px-md-2v fr-my-auto fr-col-hidden-xs fr-col-unhidden-md fr-col-md-8 fr-col-lg-9 fr-col-xl-8 fr-text--sm">
      <div class="fr-container fr-px-md-4w fr-px-0">
        <div class="fr-grid-row">
          <div class="fr-col-3 fr-bg--blue--light fr-radius-l-2v fr-px-2v fr-col-content--middle fr-col-justify--center">
            <span
              class="fr-icon-check-line fr-icon--sm fr-mr-1-5v"
              aria-hidden="true"
            />
            {{ siretValue }}
          </div>
          <div class="fr-col-2 fr-bg--blue--light fr-col-content--middle fr-col-justify--center">
            <span
              class="fr-icon-check-line fr-icon--sm fr-mr-1-5v"
              aria-hidden="true"
            />
            {{ size }}
          </div>
          <div class="fr-col-2 fr-bg--blue--light fr-col-content--middle fr-col-justify--center">
            <span
              class="fr-icon-check-line fr-icon--sm fr-mr-1-5v"
              aria-hidden="true"
            />
            {{ sector }}
          </div>
          <div class="fr-col-2 fr-bg--blue--light fr-col-content--middle fr-col-justify--center">
            <span
              class="fr-icon-check-line fr-icon--sm fr-mr-1-5v"
              aria-hidden="true"
            />
            {{ localisation }}
          </div>
          <div class="fr-col-1 fr-bg--blue--light fr-radius-r-2v fr-col-content--middle fr-col-justify--center">
            <span
              class="fr-icon-pencil-fill fr-icon--sm fr-mr-1-5v fr-text--blue-france"
              aria-hidden="true"
            />
          </div>
        </div>
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

const siretValue = Format.truncate('SIRET ' + TrackStructure.getSiret(), 30)
const size = Format.truncate(TrackStructure.getSizeTitle(), 30)
const sector = Format.truncate(TrackStructure.getSector(), 30)
const localisation = Format.truncate(TrackStructure.getLocalisation(), 30)

const bgClass = computed(() => {
  if (props.bgColor) {
    return [`fr-bg--${props.bgColor}${props.bgLight ? '--light' : ''}`]
  }

  return []
})
</script>

<style scoped>
.centered-text {
  display: flex;
  align-items: center;
}
</style>
