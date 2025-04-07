<template>
  <div
    v-if="withTitle"
    class="fr-text--bold fr-text-left fr-mb-3v fr-mt-6w"
  >
    Filtres
  </div>
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

interface Props {
  accordionClass?: string
  withTitle?: boolean
}
const props = defineProps<Props>()

const { companyDataSelected } = storeToRefs(useFiltersStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())

const navigation = new Navigation()

const displayRegionFilter = computed(() => {
  return navigation.isCatalogPrograms() && !companyDataSelected.value
})

const companyDataFilter: FilterItem = {
  title: 'Entreprise',
  id: FilterItemKeys.companyData,
  component: FilterByCompanyData,
  componentClass: 'fr-pl-2v',
  display: isDataFull
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
