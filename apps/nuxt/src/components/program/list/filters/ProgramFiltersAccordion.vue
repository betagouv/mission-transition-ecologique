<template>
  <FiltersAccordion
    :accordion-class="props.accordionClass"
    :company-data-filter="companyDataFilter"
    :filters="filtersItem"
  />
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'
import ProgramFilterByOperator from './ProgramFilterByOperator.vue'
import ProgramFilterByRegion from './ProgramFilterByRegion.vue'
import FilterByCompanyData from '@/components/filters/FilterByCompanyData.vue'
import { FilterItemKeys } from '@/types'
import { FilterItem } from '@/components/filters/FiltersAccordion.vue'
import { useFiltersStore } from '@/stores/filters'
import { CompanyData } from '@/tools/companyData'

interface Props {
  accordionClass?: string
}

const props = defineProps<Props>()

const { companyDataSelected } = storeToRefs(useFiltersStore())

const navigation = new Navigation()

const displayRegionFilter = computed(() => {
  return navigation.isCatalogPrograms() && !isCompanyDataSelected.value
})

const companyDataFilter: FilterItem = {
  title: 'Entreprise',
  id: FilterItemKeys.companyData,
  component: FilterByCompanyData,
  componentClass: 'fr-pl-2v',
  display: CompanyData.isDataFull().value
}

const filtersItem: FilterItem[] = [
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
</script>
