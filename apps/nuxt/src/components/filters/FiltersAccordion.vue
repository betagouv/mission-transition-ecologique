<template>
  <DsfrAccordionsGroup
    v-if="companyDataFilter?.display"
    :model-value="0"
  >
    <DsfrAccordion
      :id="`accordion-${companyDataFilter.id}`"
      :class="[props.accordionClass]"
      :title="companyDataFilter.title"
    >
      <component
        :is="companyDataFilter.component"
        :class="companyDataFilter.componentClass"
        legend=""
      />
    </DsfrAccordion>
  </DsfrAccordionsGroup>
  <DsfrAccordionsGroup v-model="activeAccordion">
    <template
      v-for="(filter, key) in filters"
      :key="filter.id"
    >
      <DsfrAccordion
        v-if="canDisplayFilter(filter)"
        :id="`accordion-${filter.id}`"
        :key="key"
        :class="[props.accordionClass, filter.accordionClass]"
        :title="`${filter.title} ${getFilterCount(filter.id)}`"
      >
        <template #title>
          <div class="fr-grid-row fr-grid-row--middle">
            <span>{{ filter.title }}</span>
            <span
              v-if="getFilterCount(filter.id)"
              class="fr-filter-count-badge fr-ml-1v"
            >
              {{ getFilterCount(filter.id) }}
            </span>
          </div>
        </template>
        <component
          :is="filter.component"
          :class="filter.componentClass"
          legend=""
        />
      </DsfrAccordion>
    </template>
  </DsfrAccordionsGroup>
</template>
<script setup lang="ts">
import { FilterItemKeys, FiltersType } from '@/types'
import { ComputedRef } from 'vue'

export interface FiltersAccordionProps {
  accordionClass?: string
  companyDataFilter?: FilterItem
  filters?: FilterItem[]
}

export interface FilterItem {
  title: string
  id: FilterItemKeys
  accordionClass?: string
  component: unknown
  componentClass?: string
  display?: boolean | ComputedRef<boolean>
}

const props = defineProps<FiltersAccordionProps>()

const activeAccordion = ref<number>()

const selectedFilters: FiltersType = useFiltersStore().filters

const getFilterCount = (filterId: FilterItemKeys) => {
  return (selectedFilters[filterId] as string[]).length ? `${(selectedFilters[filterId] as string[]).length}` : ''
}

const canDisplayFilter = (filter: FilterItem) => {
  return typeof filter.display === 'boolean' ? filter.display : filter.display?.value
}
</script>
<style scoped lang="scss">
@use '@/assets/scss/setting';

:deep(#accordion-company-data) {
  padding: 0 0.25rem;
}

.fr-filter-count-badge {
  background-color: setting.$blue-france;
  color: white;
  border-radius: 1rem;
  padding: 0 0.35rem;
  line-height: 1rem;
  font-size: 0.6rem;
}
</style>
