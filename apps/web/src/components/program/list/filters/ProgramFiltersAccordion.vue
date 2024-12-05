<template>
  <DsfrAccordionsGroup v-model="activeAccordion">
    <template
      v-for="filter in filters"
      :key="filter.id"
    >
      <DsfrAccordion
        v-if="shouldDisplayFilter(filter)"
        :id="filter.id"
        :class="[props.accordionClass, filter.accordionClass]"
        :title="filter.title"
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
import type { programFiltersType } from '@/types'
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

enum FilterItemKeys {
  companyData = 'company-data',
  typeAid = 'type-aid',
  operatorAid = 'operator-aid',
  regionAid = 'region-aid'
}

const programFilters: programFiltersType = useProgramStore().programFilters

const companySelected = computed(() => programFilters.companySelected)

const activeAccordion = ref<number>()

const displayRegionFilter = computed(() => {
  return useNavigationStore().isCatalogPrograms() && CompanyDataStorage.hasData().value === false
})

const filters: FilterItem[] = [
  {
    title: 'Entreprise',
    id: FilterItemKeys.companyData,
    component: ProgramFilterByCompanyData,
    componentClass: 'fr-pl-2v',
    display: CompanyDataStorage.hasData()
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

const shouldDisplayFilter = (filter: FilterItem) => {
  return typeof filter.display === 'boolean' ? filter.display : filter.display?.value
}

watch(
  companySelected,
  (value) => {
    activeAccordion.value = value ? 0 : undefined
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
:deep(#accordion-company-data) {
  padding: 0 0.25rem;
}
</style>
