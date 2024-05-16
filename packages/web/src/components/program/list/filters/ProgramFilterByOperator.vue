<template>
  <DsfrCheckboxSet
    v-model="programFilters.operatorAidSelected"
    :legend="legend"
    :options="programOperatorOptions"
  />
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { type programFiltersType } from '@/types'
import { DsfrCheckboxSetProps } from '@gouvminint/vue-dsfr/types/components/DsfrCheckbox/DsfrCheckbox.types'

interface Props {
  legend?: string
  operators: string[]
}
const props = withDefaults(defineProps<Props>(), {
  legend: "Porteur de l'aide"
})

const programFilters: programFiltersType = useProgramStore().programFilters

const programOperatorOptions: DsfrCheckboxSetProps['options'] = props.operators.map((operator: string) => ({
  label: operator,
  id: operator,
  name: operator
}))
</script>
