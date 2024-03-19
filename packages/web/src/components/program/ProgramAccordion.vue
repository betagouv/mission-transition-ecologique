<template>
  <DsfrAccordion
    :id="`accordion-${accordionId}`"
    class="fr-my-0"
    :title="title"
    :expanded-id="expandedId"
    @expand="expandedId = $event"
  >
    <template #title>
      <h3>{{ title }}</h3>
    </template>
    <slot />
  </DsfrAccordion>
</template>

<script setup lang="ts">
import { DsfrAccordion } from '@gouvminint/vue-dsfr'
import { ref, onBeforeMount } from 'vue'
interface Props {
  accordionId: string
  title: string
}
const props = defineProps<Props>()

const expandedId = ref<string>()

onBeforeMount(() => {
  if (window.innerWidth > 767) {
    expandedId.value = `accordion-${props.accordionId}`
  }
})
</script>

<style>
.fr-accordion__btn h3 {
  line-height: 3.75rem !important;
}
</style>
