<template>
  <div class="fr-sidemenu fr-sidemenu--sticky fr-sidemenu--sticky--top-15rem">
    <div class="fr-mb-6v">
      <ProgramFilterByAidType :legend="legend" />
    </div>
    <div class="fr-mb-6v">
      <ProgramFilterByRegion
        :legend="legend"
        :regions="regionsPrograms"
      />
    </div>
    <div class="fr-mb-6v">
      <ProgramFilterByOperator
        :operators="operatorsPrograms"
        :legend="legend"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { type ProgramData } from '@/types'
import { useProgramStore } from '@/stores/program'

interface Props {
  programs?: ProgramData[]
  legend?: string
}
const props = defineProps<Props>()

const operatorsPrograms = computed(() => {
  return props.programs ? useProgramStore().getProgramsOperators(props.programs) : []
})

const regionsPrograms = computed(() => {
  return props.programs ? useProgramStore().getProgramsRegions(props.programs) : []
})
console.log(operatorsPrograms)
</script>
