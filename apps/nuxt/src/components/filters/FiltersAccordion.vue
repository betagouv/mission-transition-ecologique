<template>
  <DsfrAccordionsGroup
    v-if="companyDataFilter?.display"
    v-model="companyDataAccordion"
  >
    <DsfrAccordion
      :id="`accordion-${companyDataFilter.id}`"
      :class="[props.accordionClass, companyDataFilterVisibilityClass(companyDataFilter.id)]"
      :title="`${companyDataFilter.title} ${getFilterCount(companyDataFilter.id)}`"
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
        <template
          v-if="filter.id !== FilterItemKeys.companyData"
          #title
        >
          <span>{{ filter.title }}</span>
          <span
            v-if="getFilterCount(filter.id)"
            class="fr-filter-count-badge fr-ml-2v"
          >
            {{ getFilterCount(filter.id) }}
          </span>
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
import { FilterItemKeys } from '@/types'
import { CompanyData } from '@/tools/companyData'

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
  display?: boolean
}

const props = defineProps<FiltersAccordionProps>()

const activeAccordion = ref<number>()
const companyDataAccordion = 0

const getFilterCount = (filterId: FilterItemKeys) => {
  if (filterId !== FilterItemKeys.companyData) {
    // return (programFilters[filterId] as string[]).length ? `${(programFilters[filterId] as string[]).length}` : ''
  }

  return ''
}

const canDisplayFilter = (filter: FilterItem) => {
  return typeof filter.display === 'boolean' ? filter.display : filter.display?.value
}

const companyDataFilterVisibilityClass = (filterId: FilterItemKeys) => {
  if (filterId === FilterItemKeys.companyData) {
    return CompanyData.isDataFull().value ? '' : 'fr-hidden'
  }
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
