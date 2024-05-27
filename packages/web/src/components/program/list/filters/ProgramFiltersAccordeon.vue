<template>
  <DsfrAccordionsGroup>
    <template
      v-for="filter in filters"
      :key="filter.id"
    >
      <li v-if="filter.if === undefined || filter.if">
        <DsfrAccordion
          :class="props.class"
          :title="filter.title"
          :expanded-id="expandedId"
          @expand="expandFilter"
        >
          <component
            :is="filter.component"
            :class="filter.class"
            legend=""
          />
        </DsfrAccordion>
      </li>
    </template>
  </DsfrAccordionsGroup>
</template>
<script setup lang="ts">
import TeeEligibilityCriteriaAccordeon from '@/components/program/eligibilityCriteria/TeeEligibilityCriteriaAccordeon.vue'
import { useNavigationStore } from '@/stores/navigation'
import { ref } from 'vue'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'

const expandedId = ref<string | undefined>()

const expandFilter = (id: string | undefined) => {
  expandedId.value = id
}
interface Props {
  class?: string
}
const props = defineProps<Props>()

interface FilterItem {
  title: string
  id: string
  component: unknown
  class?: string
  if?: boolean
}

const filters: FilterItem[] = [
  {
    title: "Critères d'éligibilité",
    id: 'eligibility-criteria',
    component: TeeEligibilityCriteriaAccordeon,
    if: !useNavigationStore().isCatalog()
  },
  {
    title: "Types d'aides",
    id: 'type-aid',
    component: ProgramFilterByAidType,
    class: 'fr-pl-2v'
  }
]
</script>
