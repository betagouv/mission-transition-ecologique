<template>
  <DsfrAccordionsGroup v-model="activeAccordion">
    <template
      v-for="filter in filters"
      :key="filter.id"
    >
      <DsfrAccordion
        v-if="filter.if === undefined || filter.if"
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

const activeAccordion = ref<number>()

const filters: FilterItem[] = [
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
