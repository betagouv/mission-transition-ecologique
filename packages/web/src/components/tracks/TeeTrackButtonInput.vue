<template>
  <div
    class="fr-div-fixed- height"
    @click="selectItem">
    <!-- DEBUGGING -->
    <div
      v-if="debug"
      class="debug">
      - option : <code>{{ option }}</code
      ><br />
      - icon: <code>{{ icon }}</code
      ><br />
      - inputValue: <code>{{ inputValue }}</code
      ><br />
      - isActive : <code>{{ isActive }}</code>
    </div>

    <!-- INPUT CANVAS -->
    <div
      class="fr-btn-fullwidth fr-btn-fixed-height fr-btn-sm-align-left fr-btn-grey tee-btn-input"
      :style="`outline-color: #929292; font-weight: 500; ${isActive ? 'background-color: #eeeeee' : ''}`">
      <v-icon :name="icon"> </v-icon>
      <span
        v-if="isTextInput"
        class="fr-pr-3v"
        style="width: auto; white-space: nowrap">
        {{ option.label?.[choices.lang] }}
      </span>
      <input
        :id="`track-input-${option.hasInput}`"
        v-model="inputValue"
        class="fr-input"
        :type="option.hasInput"
        :name="`track-input-${option.hasInput}`"
        :min="(!isTextInput && option.inputMin) || undefined"
        :max="(!isTextInput && option.inputMax) || undefined"
        :style="`${isTextInput ? 'width: 100%;' : ''}`"
        @input="sendValueUpdate" />
      <span
        v-if="isNumberInput"
        class="fr-ml-3v">
        {{ option.label?.[choices.lang] }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeTrackButtonInput > FUNCTION_NAME > MSG_OR_VALUE :`)

import { onBeforeMount, ref, computed } from 'vue'
import { choicesStore } from '@/stores/choices'
import type { TrackOptionsInput } from '@/types'
import { HasInputOptions } from '@/types'

interface Props {
  trackId: string
  icon: string
  isActive: boolean
  option: TrackOptionsInput
  debug?: boolean
}
const props = defineProps<Props>()

const choices = choicesStore()

const inputValue = ref<string | number>()

const emit = defineEmits(['updateSelection', 'updateValue', 'goToNextTrack'])

onBeforeMount(() => {
  if (props.option.hasInput === HasInputOptions.Number) {
    inputValue.value = 0
  }
  if (props.option.defaultInput) {
    inputValue.value = props.option.defaultInput
  }
})

const isTextInput = computed(() => {
  return props.option.hasInput === HasInputOptions.Text
})

const isNumberInput = computed(() => {
  return props.option.hasInput === HasInputOptions.Number
})

// computed
const dataObj = computed(() => {
  const inputObject = props.option.value as Record<string, unknown>
  if (props.option.inputField) {
    const val = inputValue.value
    inputObject[props.option.inputField] = val
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
  emit('updateValue', dataObj.value)
}

const selectItem = () => {
  if (!props.isActive) {
    emit('updateSelection', dataObj.value)
  }
}
</script>
