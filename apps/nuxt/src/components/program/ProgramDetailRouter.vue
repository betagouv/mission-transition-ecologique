<template>
  <ExternalProgramDetail v-if="isExternalProgram" />
  <ProgramDetail v-else />
</template>

<script setup lang="ts">
import ProgramDetail from '@/components/program/detail/ProgramDetail.vue'
import ExternalProgramDetail from '@/components/program/externalProgram/detail/ExternalProgramDetail.vue'
import { useProgramStore } from '@/stores/program'
import { storeToRefs } from 'pinia'

const { currentProgram, currentExtProgram } = storeToRefs(useProgramStore())

const isExternalProgram = computed(() => !currentProgram.value && !!currentExtProgram.value)
</script>
