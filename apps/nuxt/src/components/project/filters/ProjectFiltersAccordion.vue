<template>
  <FiltersAccordion
    :accordion-class="props.accordionClass"
    :company-data-filter="companyDataFilter"
  />
</template>
<script setup lang="ts">
import FilterByCompanyData from '@/components/filters/FilterByCompanyData.vue'
import { FilterItemKeys } from '@/types'
import { FilterItem } from '@/components/filters/FiltersAccordion.vue'
import { CompanyData } from '@/tools/companyData'

interface Props {
  accordionClass?: string
}

const props = defineProps<Props>()

const companyDataFilter: FilterItem = {
  title: 'Entreprise',
  id: FilterItemKeys.companyData,
  component: FilterByCompanyData,
  componentClass: 'fr-pl-2v',
  display: CompanyData.isDataFull().value
}
</script>
