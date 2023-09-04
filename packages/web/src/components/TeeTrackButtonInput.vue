<template>
  <div
    class="fr-div-fixed- height"
    @click="selectItem">
    <!-- DEBUGGING -->
    <div
      v-if="debug"
      class="debug">
      - option : <code>{{ option }}</code><br>
      - icon: <code>{{ icon }}</code><br>
      - inputValue: <code>{{ inputValue }}</code><br>
      -isActive : <code>{{ isActive }}</code>
    </div>

    <!-- INPUT CANVAS -->
    <div
      class="fr-btn-fullwidth fr-btn-fixed-height fr-btn-sm-align-left fr-btn-grey tee-btn-input"
      :style="`outline-color: #929292; font-weight: 500; ${isActive ? 'background-color: #eeeeee' : ''}`">
      <v-icon
        :name="icon">
      </v-icon>
      <span
        v-if="option.hasInput === 'text'"
        class="fr-pr-3v"
        style="width: auto; white-space: nowrap">
        {{ option.label[choices.lang] }}
      </span>
      <input 
        class="fr-input" 
        :type="option.hasInput" 
        id="text-input-text" 
        name="text-input-text"
        :style="`${option.hasInput === 'text' ? 'width: 100%;' : ''}`"
        v-model="inputValue"
        @input="sendValueUpdate">
      <span
        v-if="option.hasInput === 'number'"
        class="fr-ml-3v">
        {{ option.label[choices.lang] }}
      </span>
    </div>
  </div>

</template>

<script setup lang="ts">

import { onBeforeMount, ref, computed } from 'vue'

import { choicesStore } from '../stores/choices'

// @ts-ignore
import type { TrackOptionsInput } from '@/types/index'

interface Props {
  trackId: string,
  icon: string;
  isActive: boolean,
  option: TrackOptionsInput,
  debug?: boolean,
}
const props = defineProps<Props>()

const choices = choicesStore()

const inputValue = ref<string | number>()
// const hasSelection = ref<boolean>(false)

const emit = defineEmits(['updateSelection', 'updateValue', 'goToNextTrack'])

onBeforeMount(() => {
  if (props.option.hasInput === 'number') {
    inputValue.value = 0
  }
  if (props.option.defaultInput) {
    inputValue.value = props.option.defaultInput
  }
})

// computed
const dataObj = computed(() => {
  const inputObject: any = {}
  if (props.option.inputField) {
    inputObject[props.option.inputField] = inputValue.value
  }
  const data = {
    option: {
      ...props.option,
      value: inputObject
    },
    remove: false
  }
  return data
})

const sendValueUpdate = () => {
  console.log('TeeTrackButtonInput > sendValueUpdate > dataObj.value :', dataObj.value )
  emit('updateValue', dataObj.value)
}

const selectItem = () => {
  if (!props.isActive) {
    // const inputObject = {}
    // inputObject[props.option.inputField] = inputValue.value
  
    // // hasSelection.value = !hasSelection.value
  
    // const data = {
    //   option: {
    //     ...props.option,
    //     value: inputObject
    //   },
    //   remove: false
    // }
    console.log('TeeTrackButtonInput > selectItem > dataObj.value :', dataObj.value)
    emit('updateSelection', dataObj.value)
  }
}

</script>