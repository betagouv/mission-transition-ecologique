<template>
  <DsfrAccordionsGroup
    v-if="companyDataFilter.display"
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
        :title="filter.title"
      >
        <template
          v-if="filter.id !== FilterItemKeys.companyData"
          #title
        >
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
import Navigation from '@/tools/navigation'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'
import ProgramFilterByOperator from './ProgramFilterByOperator.vue'
import ProgramFilterByRegion from './ProgramFilterByRegion.vue'
import ProgramFilterByCompanyData from '@/components/program/list/filters/ProgramFilterByCompanyData.vue'
import { FilterItemKeys, ProgramFiltersType } from '@/types'
import { useProgramStore } from '@/stores/program'
import { CompanyData } from '@/tools/companyData'

interface Props {
  accordionClass?: string
}

const props = defineProps<Props>()

interface FilterItem {
  title: string
  id: FilterItemKeys
  accordionClass?: string
  component: unknown
  componentClass?: string
  display?: boolean | ComputedRef<boolean>
}

const programFilters: ProgramFiltersType = useProgramStore().programFilters

const companySelected = computed(() => programFilters[FilterItemKeys.companyData])

const activeAccordion = ref<number>()
const navigation = new Navigation()

const displayRegionFilter = computed(() => {
  return navigation.isCatalogPrograms() && !companySelected.value
})

const companyDataFilter: FilterItem = {
  title: 'Entreprise',
  id: FilterItemKeys.companyData,
  component: ProgramFilterByCompanyData,
  componentClass: 'fr-pl-2v',
  display: CompanyData.isDataFull().value
}

const filters: FilterItem[] = [
  {
    title: "Types d'aides",
    id: FilterItemKeys.typeAid,
    component: ProgramFilterByAidType,
    componentClass: 'fr-pl-2v',
    display: true
  },
  {
    title: 'Opérateurs',
    id: FilterItemKeys.operatorAid,
    component: ProgramFilterByOperator,
    componentClass: 'fr-pl-2v',
    display: navigation.isCatalogPrograms()
  },
  {
    title: 'Régions',
    id: FilterItemKeys.regionAid,
    component: ProgramFilterByRegion,
    componentClass: 'fr-pl-2v',
    display: displayRegionFilter
  }
]

const canDisplayFilter = (filter: FilterItem) => {
  return typeof filter.display === 'boolean' ? filter.display : filter.display?.value
}

const getFilterCount = (filterId: FilterItemKeys) => {
  if (filterId !== FilterItemKeys.companyData) {
    return (programFilters[filterId] as string[]).length ? `${(programFilters[filterId] as string[]).length}` : ''
  }

  return ''
}
</script>
<style lang="scss" scoped>
:deep(#accordion-company-data) {
  padding: 0 0.25rem;
}
</style>
