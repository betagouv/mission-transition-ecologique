<template>
  <LayoutList>
    <template #counter>
      <TeeCounterResult :in-count="programNumber" />
    </template>
    <template #modalFilter>
      <ProgramModalFilter />
    </template>
    <li
      v-for="program in filteredPrograms"
      :id="program.id"
      :key="program.id"
      class="fr-col-12 fr-col-sm-6 fr-col-md-12"
    >
      <ProgramCard
        :program="program"
        class="fr-enlarge-link fr-card--horizontal-tier"
      />
    </li>
    <template v-if="!isDataFull && extPrograms && extPrograms.length > 0">
      <li
        v-for="externalProgram in extPrograms"
        :id="externalProgram.id + 'etr'"
        :key="`external-${externalProgram.id}`"
        class="fr-col-12 fr-col-sm-6 fr-col-md-12"
      >
        <ExternalProgramCard
          :program="externalProgram"
          class="fr-enlarge-link fr-card--horizontal-tier"
        />
      </li>
    </template>
  </LayoutList>
</template>

<script setup lang="ts">
import ProgramCard from '@/components/program/list/ProgramCard.vue'
import ExternalProgramCard from '@/components/program/externalProgram/ExternalProgramCard.vue'
import { ProgramTypeForFront } from '@/types'
import { useCompanyDataStore } from '@/stores/companyData'
import { storeToRefs } from 'pinia'
import { ProgramManager } from '@/tools/program/programManager'

interface Props {
  filteredPrograms?: ProgramTypeForFront[]
}
const props = defineProps<Props>()
const { isDataFull } = storeToRefs(useCompanyDataStore())
const { extPrograms } = storeToRefs(useProgramStore())
const programNumber = computed(() => {
  return (props.filteredPrograms?.length || 0) + (extPrograms.value?.length || 0)
})

onMounted(async () => {
  if (!extPrograms.value || !extPrograms.value.length) {
    await new ProgramManager().getExternals()
  }
})
</script>
