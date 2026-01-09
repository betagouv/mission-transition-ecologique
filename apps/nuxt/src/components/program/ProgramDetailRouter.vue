<template>
  <ExternalProgramDetail v-if="isExternalProgram" />
  <ProgramDetail v-else />
</template>

<script setup lang="ts">
import ProgramDetail from '@/components/program/detail/ProgramDetail.vue'
import ExternalProgramDetail from '@/components/program/externalProgram/detail/ExternalProgramDetail.vue'
import { useProgramStore } from '@/stores/program'
import { useExternalProgramStore } from '@/stores/externalProgram'
import { storeToRefs } from 'pinia'

const { currentProgram } = storeToRefs(useProgramStore())
const { currentExternalProgram } = storeToRefs(useExternalProgramStore())

const isExternalProgram = computed(() => !currentProgram.value && !!currentExternalProgram.value)
</script>
