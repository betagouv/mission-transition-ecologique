<template>
  <FiltersAccordion
    :accordion-class="props.accordionClass"
    :company-data-filter="companyDataFilter"
  />
</template>
<script setup lang="ts">
import ProgramFilterByCompanyData from '@/components/program/list/filters/ProgramFilterByCompanyData.vue'
import { FilterItemKeys } from '@/types'
import { FilterItem } from '@/components/filters/FiltersAccordion.vue'

interface Props {
  accordionClass?: string
}

const props = defineProps<Props>()

const companyDataFilter: FilterItem = {
  title: 'Entreprise',
  id: FilterItemKeys.companyData,
  component: ProgramFilterByCompanyData,
  componentClass: 'fr-pl-2v',
  display: true
}
</script>
