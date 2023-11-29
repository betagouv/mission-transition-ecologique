<template>
  <!-- SELECTOR -->
  <div class="fr-select-group">
    <select
      class="fr-select"
      :id="`${track.id}-select`"
      :name="`${track.id}-select`"
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
        :key="`${track.id}-select-option-${idx}`"
        :value="idx">
        {{ optionVal?.label[choices.lang]  }}
      </option>
    </select>
  </div>

</template>

<script setup lang="ts">

import type { Track, TrackOptionsSelect } from '@/types'

import { ref } from 'vue'
import { choicesStore } from '../../stores/choices'

interface Props {
  track: Track
}
const props = defineProps<Props>()

const choices = choicesStore()

const activeOption = ref<any>()

const emit = defineEmits(['updateSelection'])

const options: TrackOptionsSelect[] = props.track.options?.filter((o): o is TrackOptionsSelect => !!o.label) || []

const updateLocalSelection = (event: any) => {
  // console.log()
  // console.log('TeeTrackSelect > updateLocalSelection > event :', event)
  const index = event.target.value
  // console.log('TeeTrackSelect > updateLocalSelection > index :', index)

  const isReset = event.target.value === ''
  // set local ref
  activeOption.value = isReset ? undefined : options[index]

  // send signal to parent
  const data = {
    index: event,
    option: activeOption.value,
    reset: isReset
  }
  emit('updateSelection', data)
}

</script>