<template>
  <div
    ref="eligibilityCriteria"
    class="fr-grid-row fr-grid-row--center fr-text-center fr-grid-row--middle fr-my-auto fr-py-md-1w"
    :class="bgClass"
  >
    <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-2 fr-col-hidden fr-col-unhidden-md">
      <div class="fr-col-12">
        <TeeButtonLink
          :to="previousRoute"
          icon="fr-icon-arrow-left-line"
          size="lg"
        >
          Retour
        </TeeButtonLink>
      </div>
    </div>
    <div class="fr-px-md-2v fr-my-auto fr-col-hidden fr-col-unhidden-md fr-col-md-8 fr-col-lg-9 fr-col-xl-8 fr-px-0 fr-text-left">
      <div class="fr-container">
        <div
          v-if="message"
          class="fr-mb-1v fr-ml-2v fr-text--blue-france fr-text--bold"
        >
          <span
            v-if="messageIcon"
            class="fr-mr-1-5v"
            :class="messageIcon"
            aria-hidden="true"
          />
          {{ message }}
        </div>
        <TeeGroupBar
          :infos="criteria"
          :bg-color="bgBarColor"
          radius-size="2v"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Color } from '@/types'
import StickyWithOffset from '@/utils/stickyWithOffset'
import TrackStructure from '@/utils/track/trackStructure'
import type { RouteLocationRaw } from 'vue-router'

interface Props {
  bgColor?: Color
  bgBarColor?: Color
  previousRoute: RouteLocationRaw
  message?: string
  messageIcon?: string
}

const props = defineProps<Props>()
const eligibilityCriteria = ref<HTMLElement>()
const stickyWithOffset = ref<StickyWithOffset | null>(null)
const criteria = TrackStructure.getEligibilityCriteria()

onMounted(async () => {
  await nextTick()
  stickyWithOffset.value = new StickyWithOffset(eligibilityCriteria.value, document.getElementById('tee-header'))
  stickyWithOffset.value.addEventListenerOnScroll()
})

onUnmounted(() => {
  stickyWithOffset.value?.removeEventListenerOnScroll()
})

const bgClass = computed(() => {
  if (props.bgColor) {
    return [`fr-bg--${props.bgColor}`]
  }

  return []
})
</script>
