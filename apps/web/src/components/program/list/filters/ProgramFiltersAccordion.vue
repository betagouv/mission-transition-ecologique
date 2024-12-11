<template>
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
        :title="`${filter.title} ${getFilterCountBadge(filter.id)}`"
      >
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
import CompanyDataStorage from '@/utils/storage/companyDataStorage'

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

const displayRegionFilter = computed(() => {
  return useNavigationStore().isCatalogPrograms() && !companySelected.value
})

const companyDataFilterVisibilityClass = (filterId: FilterItemKeys) => {
  if (filterId === FilterItemKeys.companyData) {
    return CompanyDataStorage.isDataFull().value ? '' : 'fr-hidden'
  }
}

const filters: FilterItem[] = [
  {
    title: 'Entreprise',
    id: FilterItemKeys.companyData,
    component: ProgramFilterByCompanyData,
    componentClass: 'fr-pl-2v',
    display: true
  },
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

const getFilterCountBadge = (filterId: FilterItemKeys) => {
  if (filterId !== FilterItemKeys.companyData) {
    return (programFilters[filterId] as string[]).length ? `(${(programFilters[filterId] as string[]).length})` : ''
  }

  return ''
}

watch(
  companySelected,
  (value) => {
    activeAccordion.value = value ? 0 : -1
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
:deep(#accordion-company-data) {
  padding: 0 0.25rem;
}
</style>
