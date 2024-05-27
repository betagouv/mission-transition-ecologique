<template>
  <DsfrCheckboxSet
    v-model="programFilters.operatorAidSelected"
    small
    :options="programOperatorOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'
import { ProgramOperatorType, type programFiltersType } from '@/types'

const programFilters: programFiltersType = useProgramStore().programFilters

const programOperatorOptions: DsfrCheckboxSetProps['options'] = [
  {
    label: ProgramOperatorType.bpi,
    name: ProgramOperatorType.bpi,
    id: ProgramOperatorType.bpi
  },
  {
    label: ProgramOperatorType.ademe,
    name: ProgramOperatorType.ademe,
    id: ProgramOperatorType.ademe
  },
  {
    label: ProgramOperatorType.cci,
    name: ProgramOperatorType.cci,
    id: ProgramOperatorType.cci
  },
  {
    label: ProgramOperatorType.laposte,
    name: ProgramOperatorType.laposte,
    id: ProgramOperatorType.laposte
  },
  {
    label: ProgramOperatorType.asp,
    name: ProgramOperatorType.asp,
    id: ProgramOperatorType.asp
  },
  {
    label: 'MTES',
    name: ProgramOperatorType.ministere_eco,
    id: ProgramOperatorType.ministere_eco
  },
  {
    label: ProgramOperatorType.ddfip,
    name: ProgramOperatorType.ddfip,
    id: ProgramOperatorType.ddfip
  },
  {
    label: ProgramOperatorType.cma,
    name: ProgramOperatorType.cma,
    id: ProgramOperatorType.cma
  },
  {
    label: ProgramOperatorType.orace,
    name: ProgramOperatorType.orace,
    id: ProgramOperatorType.orace
  }
].sort((a, b) => a.label.localeCompare(b.label))
</script>
