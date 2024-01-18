<template>
  <div class="fr-accordion fr-my-18v">
    <h3 class="fr-accordion__title">
      <button
        class="fr-accordion__btn"
        :aria-expanded="drawerOpen"
        :aria-controls="`accordion-${program.id}`"
        @click="drawerOpen = !drawerOpen"
      >
        {{ choices.t('program.programKnowMore') }}
      </button>
    </h3>
    <div
      :id="`accordion-${program.id}`"
      :class="`fr-collapse ${drawerOpen ? 'fr-collapse--expanded' : ''}`"
      :style="drawerOpen ? '-collapse: -165px; --collapse-max-height: none;' : '-collapse: -203px;'"
    >
      <div class="fr-pt-8v fr-pb-12v">
        <p
          v-for="(paragraph, idx) in descriptionParagraphs"
          :key="`long-description-paragraph-${idx}`"
          class="fr-mb-0"
        >
          {{ paragraph || '&nbsp;' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`ProgramLongdescription > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref, computed, onBeforeMount } from 'vue'
import { choicesStore } from '@/stores/choices'
import type { ProgramData } from '@/types'

interface Props {
  program: ProgramData
}
const props = defineProps<Props>()

const drawerOpen = ref<boolean>(false)

const choices = choicesStore()

const descriptionParagraphs = computed(() => {
  const textRaw = props.program['description longue']
  return textRaw?.split('\n')
})

onBeforeMount(() => {
  if (window.innerWidth > 767) {
    drawerOpen.value = true
  }
})
</script>
