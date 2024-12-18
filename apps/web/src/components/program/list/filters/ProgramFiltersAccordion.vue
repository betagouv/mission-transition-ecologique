<template>
  <DsfrAccordionsGroup
    v-if="companyDataFilter.display"
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
        :class="[props.accordionClass, filter.accordionClass, companyDataFilterVisibilityClass(filter.id)]"
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
import { useNavigationStore } from '@/stores/navigation'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'
import ProgramFilterByOperator from './ProgramFilterByOperator.vue'
import ProgramFilterByRegion from './ProgramFilterByRegion.vue'
import ProgramFilterByCompanyData from '@/components/program/list/filters/ProgramFilterByCompanyData.vue'
import { FilterItemKeys, programFiltersType } from '@/types'
import { useProgramStore } from '@/stores/program'
import { CompanyData } from '@/utils/companyData'

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

const programFilters: programFiltersType = useProgramStore().programFilters

const companySelected = computed(() => programFilters[FilterItemKeys.companyData])

const activeAccordion = ref<number>()
const companyDataAccordion = 0

const displayRegionFilter = computed(() => {
  return useNavigationStore().isCatalogPrograms() && !companySelected.value
})

const companyDataFilterVisibilityClass = (filterId: FilterItemKeys) => {
  if (filterId === FilterItemKeys.companyData) {
    return CompanyData.isDataFull().value ? '' : 'fr-hidden'
  }
}

const companyDataFilter: FilterItem = {
  title: 'Entreprise',
  id: FilterItemKeys.companyData,
  component: ProgramFilterByCompanyData,
  componentClass: 'fr-pl-2v',
  display: true
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
    display: useNavigationStore().isCatalogPrograms()
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
