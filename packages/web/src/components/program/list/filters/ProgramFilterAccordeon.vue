<template>
  <DsfrAccordionsGroup v-if="!hasSpinner">
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
          :operators="operators"
        />
      </DsfrAccordion>
    </li>
  </DsfrAccordionsGroup>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'
import ProgramFilterByOperator from './ProgramFilterByOperator.vue'
import ProgramFilterByRegion from './ProgramFilterByRegion.vue'
import { type ProgramData } from '@/types'
import { useProgramStore } from '@/stores/program'
import { useUsedTrackStore } from '@/stores/usedTrack'

const expandedId = ref<string | undefined>()
const programStore = useProgramStore()
const programs = ref<ProgramData[]>()
const operators = ref<string[]>()
const regions = ref<string[]>()
const hasSpinner = computed(() => {
  return programs.value === undefined
})

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

onBeforeMount(async () => {
  const result = useUsedTrackStore().hasUsedTracks() ? await programStore.programsByUsedTracks : await programStore.programs
  if (result.isOk) {
    programs.value = result.value
    operators.value = programStore.getProgramsOperators(programs.value)
    regions.value = programStore.getProgramsRegions(programs.value)
  }
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
  },
  {
    title: 'Régions',
    id: 'region-aid',
    component: ProgramFilterByRegion
  }
]
</script>
