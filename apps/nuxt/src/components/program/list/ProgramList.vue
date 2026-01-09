<template>
  <LayoutList>
    <template #counter>
      <TeeCounterResult :to-count="allPrograms" />
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
    <template v-if="!isDataFull && externalPrograms && externalPrograms.length > 0">
      <li
        v-for="externalProgram in externalPrograms"
        :id="externalProgram.id"
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
import { useExternalProgramStore } from '@/stores/externalProgram'
import { ExternalProgramManager } from '@/tools/externalProgram/externalProgramManager'
import { useCompanyDataStore } from '@/stores/companyData'
import { storeToRefs } from 'pinia'

interface Props {
  filteredPrograms?: ProgramTypeForFront[]
}
const props = defineProps<Props>()

const { isDataFull } = storeToRefs(useCompanyDataStore())
const { externalPrograms } = storeToRefs(useExternalProgramStore())

const allPrograms = computed(() => {
  const programs = [...(props.filteredPrograms || [])]
  if (!isDataFull.value && externalPrograms.value && Array.isArray(externalPrograms.value)) {
    programs.push(...(externalPrograms.value as ProgramTypeForFront[]))
  }
  return programs
})

// Load external programs if not connected
onMounted(async () => {
  if (!isDataFull.value) {
    await new ExternalProgramManager().get()
  }
})
</script>
