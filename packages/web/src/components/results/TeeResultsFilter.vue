<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug">
    <p>
      activeValue: <code>{{ activeValue }}</code>
    </p>
  </div>

  <!-- SELECTOR -->
  <div
    class="fr-select-group">
    <select
      class="fr-select"
      :id="filter.label"
      :name="filter.label"
      @change="updateLocalFilters">
      <!-- DEFAULT OPTION -->
      <option
        value=""
        selected >
        {{ choices.t('results.filterSelect', { fieldLabel: filter.label }) }}
      </option>

      <!-- FILTER OPTIONS -->
      <option
        v-for="filterVal in filter.values"
        :key="filterVal.value"
        :value="filterVal.value">
        {{ filterVal.label }}
      </option>

      <!-- DEBUGGING -->
      <!-- <option
        value="">
        {{ choices.t('results.resetSelect') }}
      </option> -->
    </select>
  </div>
</template>

<script setup lang="ts">

// CONSOLE LOG TEMPLATE
// console.log(`TeeResultsFilter > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref } from 'vue'
import { choicesStore } from '../../stores/choices'

// @ts-ignore
import type { TrackFilter, FilterEvent } from '@/types/index'

const choices = choicesStore()

const activeValue = ref<any>()

const emit = defineEmits(['updateFilter'])

interface Props {
  filter: TrackFilter,
  debug?: boolean
}
const props = defineProps<Props>()

const updateLocalFilters = (event: FilterEvent) => {
  const val = event.target.value

  // set local ref
  activeValue.value = val

  // send signal to parent
  const fIn = {
    label: props.filter.label,
    value: val
  }
  emit('updateFilter', fIn)
}

</script>
