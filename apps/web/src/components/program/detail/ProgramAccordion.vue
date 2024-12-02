<template>
  <DsfrAccordionsGroup v-model="activeAccordion">
    <DsfrAccordion
      :id="`accordion-${accordionId}`"
      :title="title"
    >
      <template #title>
        <h4 class="fr-my-2v">{{ title }}</h4>
      </template>
      <slot />
    </DsfrAccordion>
  </DsfrAccordionsGroup>
</template>

<script setup lang="ts">
import { BreakpointNameType } from '@/types'
import Breakpoint from '@/utils/breakpoints'
import { DsfrAccordion } from '@gouvminint/vue-dsfr'
import { onBeforeMount, ref } from 'vue'

interface Props {
  accordionId: string
  title: string
}
defineProps<Props>()

const activeAccordion = ref<number>()

onBeforeMount(() => {
  if (Breakpoint.isLargerOrEqual(BreakpointNameType.md)) {
    activeAccordion.value = 0
  }
})
</script>
