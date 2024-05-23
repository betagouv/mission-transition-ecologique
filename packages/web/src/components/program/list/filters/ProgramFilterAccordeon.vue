<template>
  <DsfrAccordionsGroup>
    <li
      v-for="filter in filters"
      :key="filter.id"
    >
      <DsfrAccordion
        :class="props.class"
        :title="filter.title"
        :expanded-id="expandedId"
        @expand="expandFilter"
      >
        <component :is="filter.component" />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'
import ProgramFilterByOperator from './ProgramFilterByOperator.vue'
import ProgramFilterByRegion from './ProgramFilterByRegion.vue'

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
}

const filters: FilterItem[] = [
  {
    title: "Types d'aides",
    id: 'type-aid',
    component: ProgramFilterByAidType
  },
  {
    title: 'Opérateurs',
    id: 'operator-aid',
    component: ProgramFilterByOperator
  },
  {
    title: 'Régions',
    id: 'region-aid',
    component: ProgramFilterByRegion
  }
]
</script>
