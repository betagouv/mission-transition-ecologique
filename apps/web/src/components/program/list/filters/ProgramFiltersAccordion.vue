<template>
  <DsfrAccordionsGroup>
    <template
      v-for="filter in filters"
      :key="filter.id"
    >
      <li v-if="filter.if === undefined || filter.if">
        <DsfrAccordion
          :class="[props.accordionClass, filter.accordionClass]"
          :title="filter.title"
          :expanded-id="expandedId"
          @expand="expandFilter"
        >
          <component
            :is="filter.component"
            :class="filter.componentClass"
            legend=""
          />
        </DsfrAccordion>
      </li>
    </template>
  </DsfrAccordionsGroup>
</template>
<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import TeeEligibilityCriteriaAccordion from '@/components/program/eligibility/TeeEligibilityCriteriaAccordion.vue'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'
import ProgramFilterByOperator from './ProgramFilterByOperator.vue'
import ProgramFilterByRegion from './ProgramFilterByRegion.vue'
import { ref } from 'vue'

const expandedId = ref<string | undefined>()

const expandFilter = (id: string | undefined) => {
  expandedId.value = id
}
interface Props {
  accordionClass?: string
}
const props = defineProps<Props>()

interface FilterItem {
  title: string
  id: string
  accordionClass?: string
  component: unknown
  componentClass?: string
  if?: boolean
}

const filters: FilterItem[] = [
  {
    title: "Critères d'éligibilité",
    id: 'eligibility-criteria',
    component: TeeEligibilityCriteriaAccordion,
    if: !useNavigationStore().isCatalogPrograms(),
    accordionClass: 'fr-hidden-md'
  },
  {
    title: "Types d'aides",
    id: 'type-aid',
    component: ProgramFilterByAidType,
    componentClass: 'fr-pl-2v'
  },
  {
    title: 'Opérateurs',
    id: 'operator-aid',
    component: ProgramFilterByOperator,
    componentClass: 'fr-pl-2v',
    if: useNavigationStore().isCatalogPrograms()
  },
  {
    title: 'Régions',
    id: 'region-aid',
    component: ProgramFilterByRegion,
    componentClass: 'fr-pl-2v',
    if: useNavigationStore().isCatalogPrograms()
  }
]
</script>
