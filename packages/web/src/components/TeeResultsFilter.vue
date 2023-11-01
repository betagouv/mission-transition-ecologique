<template>
  <!-- DEBUGGING -->
  <div 
    v-if="debug"
    class="vue-debug">
    <p>
      activeValues: <code>{{ activeValues }}</code>
    </p>
  </div>

  <!-- SELECTOR -->
  <div
    class="fr-select-group">
    <select
      class="fr-select"
      :id="filter.field"
      :name="filter.field"
      @change="updateLocalFilters">
      <option
        value=""
        selected >
        {{ choices.t('results.filterSelect', { fieldLabel: filter.label }) }}
      </option>
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

import { ref } from 'vue'
import { choicesStore } from '../stores/choices'

// @ts-ignore
import type { TrackFilter } from '@/types/index'

const choices = choicesStore()

const activeValues = ref<any>()

const emit = defineEmits(['updateFilter'])

interface Props {
  filter: TrackFilter,
  debug: boolean
}
const props = defineProps<Props>()

const updateLocalFilters = (event: any) => {
  // console.log('\nTeeResults > updateLocalFilters > event :', event )
  const val = event.target.value
  // console.log('TeeResults > updateLocalFilters > val :', val )
  // console.log('TeeResults > updateLocalFilters > props.filter :', props.filter )
  
  activeValues.value = val

  // send signal to parent
  const fIn = {
    field: props.filter.field,
    value: val
  }
  // console.log('TeeResults > updateLocalFilters > fIn :', fIn )
  emit('updateFilter', fIn)
}

</script>