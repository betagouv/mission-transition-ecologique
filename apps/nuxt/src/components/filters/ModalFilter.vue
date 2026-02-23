<template>
  <DsfrButton
    tertiary
    no-outline
    size="sm"
    @click="open()"
  >
    <div class="fr-grid-row fr-grid-row--middle">
      <span>Filtres</span>
      <span
        v-if="getFiltersCount"
        class="fr-filter-count-badge fr-ml-2v"
      >
        {{ getFiltersCount }}
      </span>
    </div>
  </DsfrButton>
  <DsfrModal
    ref="modal"
    :opened="opened"
    title=""
    size="xl"
    @close="close()"
  >
    <div class="fr-h5 fr-text--blue-900 fr-text-center">Filtres</div>
    <slot name="filters-accordion"></slot>
  </DsfrModal>
</template>
<script setup lang="ts">
import { DsfrModal } from '@gouvminint/vue-dsfr'
import { ref } from 'vue'
import { FiltersType } from '@/types'

const close = () => {
  opened.value = false
}

const opened = ref<boolean>(false)

const open = () => {
  opened.value = true
}

const filters: FiltersType = useFiltersStore().filters

const getFiltersCount = computed(() => {
  return Object.values(filters).reduce((acc, filter) => {
    if (Array.isArray(filter)) {
      acc += filter.length
    }
    return acc
  }, 0)
})
</script>
<style lang="scss" scoped>
.fr-modal::after {
  content: none !important;
}

:deep(.fr-container-md) {
  padding: 0 !important;
}
</style>
