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
        <component
          :is="filter.component"
          legend=""
          :operators="operatorsPrograms"
        />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'
import ProgramFilterByOperator from './ProgramFilterByOperator.vue'
import { type ProgramData } from '@/types'
import { useProgramStore } from '@/stores/program'

const expandedId = ref<string | undefined>()
const programStore = useProgramStore()

const expandFilter = (id: string | undefined) => {
  expandedId.value = id
}
interface Props {
  class?: string
  programs?: ProgramData[]
}
const props = defineProps<Props>()

interface FilterItem {
  title: string
  id: string
  component: unknown
}

const operatorsPrograms: ComputedRef<string[]> = computed(() => {
  return props.programs ? programStore.getProgramsOperators(props.programs) : []
})

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
  }
]
</script>
