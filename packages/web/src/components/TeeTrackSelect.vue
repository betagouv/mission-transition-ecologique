<template>
  <!-- SELECTOR -->
  <div class="fr-select-group">
    <!-- <label
      class="fr-label"
      :for="`${trackId}-select`">
      Choisir
    </label> -->
    <select
      class="fr-select"
      :id="`${trackId}-select`"
      :name="`${trackId}-select`"
      @change="updateLocalSelection">
      <!-- DEFAULT OPTION -->
      <option
        value=""
        selected>
        {{ choices.t('select.selectOption') }}
      </option>

      <!-- VALUES -->
      <option
        v-for="(optionVal, idx) in options"
        :key="`${trackId}-select-option-${idx}`"
        :value="idx">
        {{ optionVal?.label[choices.lang]  }}
      </option>
    </select>
  </div>

  <!-- DEBUGGING -->
  <p>
    activeOption.value: <pre><code>{{ activeOption?.value }}</code></pre>
  </p>
  <!-- <p>
    options : 
    <pre><code>{{ options }}</code></pre>
  </p> -->

</template>

<script setup lang="ts">

import type { TrackOptionsSelect } from '@/types'

import { ref } from 'vue'
import { choicesStore } from '../stores/choices'

interface Props {
  trackId: string,
  options: TrackOptionsSelect[],
  debug?: boolean
}
const props = defineProps<Props>()

const choices = choicesStore()

const activeOption = ref<any>()

const emit = defineEmits(['updateSelection'])

const updateLocalSelection = (event: any) => {
  console.log()
  const val = event.target.value

  // set local ref
  activeOption.value = props.options[val]

  // send signal to parent
  // const fIn = {
  //   label: props.filter.label,
  //   value: val
  // }
  // emit('updateSelection', fIn)
}

</script>