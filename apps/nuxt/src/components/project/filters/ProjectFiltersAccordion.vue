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
  />
</template>
<script setup lang="ts">
import FilterByCompanyData from '@/components/filters/FilterByCompanyData.vue'
import { FilterItemKeys } from '@/types'
import { FilterItem } from '@/components/filters/FiltersAccordion.vue'

interface Props {
  accordionClass?: string
  withTitle?: boolean
}

const props = defineProps<Props>()
const { isDataFull } = storeToRefs(useCompanyDataStore())

const companyDataFilter: FilterItem = {
  title: 'Entreprise',
  id: FilterItemKeys.companyData,
  component: FilterByCompanyData,
  componentClass: 'fr-pl-2v',
  display: isDataFull
}
</script>
