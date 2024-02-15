<template>
  <div class="fr-accordion tee-accordion fr-my-0">
    <div class="fr-accordion__title">
      <button
        class="fr-accordion__btn tee-accordion-btn"
        :aria-expanded="drawerOpen"
        :aria-controls="`accordion-${accordionId}`"
        @click="drawerOpen = !drawerOpen"
      >
        {{ title }}
      </button>
    </div>
    <div
      :id="`accordion-${accordionId}`"
      :class="`fr-collapse ${drawerOpen ? 'fr-collapse--expanded' : ''} fr-pt-0`"
      :style="drawerOpen ? '-collapse: -165px; --collapse-max-height: none;' : '-collapse: -203px;'"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'

interface Props {
  accordionId: string
  title: string
}
defineProps<Props>()

const drawerOpen = ref<boolean>(false)

onBeforeMount(() => {
  if (window.innerWidth > 767) {
    drawerOpen.value = true
  }
})
</script>
