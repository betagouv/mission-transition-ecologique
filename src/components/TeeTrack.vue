<template>
  <div 
    v-if="debug">
    <h5>DEBUG - TeeTrack</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-4">
        <h6 class="fr-mb-1v"> step : <code>{{ step }} </code></h6>
        <h6 class="fr-mb-1v"> trackId : <code>{{ trackId }} </code></h6>
        <h6 class="fr-mb-1v"> isCompleted : <code>{{ isCompleted }} </code></h6>
      </div>
      <div class="fr-col-4">
        <h6 class="fr-mb-1v"> renderAs : <code>{{ renderAs }} </code></h6>
        <h6 class="fr-mb-1v"> allowMultiple : <code>{{ allowMultiple }} </code></h6>
      </div>
      <div class="fr-col-4">
        <h6 class="fr-mb-1v"> selection : </h6>
        <code>{{ selection }} </code>
      </div>

      <div
        v-if="false" 
        class="fr-col-4">
        <h4>
          optionsArray :
        </h4>
        <code><pre>{{ optionsArray }}</pre></code>
      </div>
    </div>
  </div>

  <!-- TRACK CHOICES -->
  <div
    v-for="option in optionsArray"
    :key="option.value"
    class="fr-mb-2v"
    >
    <div 
      v-show="isCompleted ? isActiveChoice(option.value) : true"
      class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-9">
        <DsfrButton
          style="width: -moz-available !important;"
          :label="option.label[choices.lang]" 
          :icon="`${isActiveChoice(option.value) ? 'md-radiobuttonchecked' : 'md-radiobuttonunchecked'}`"
          :secondary="isActiveChoice(option.value)"
          @click="updateSelection(option)"
        />
      </div>
      <div
        v-if="isActiveChoice(option.value)"
        class="fr-col-3"
        style="display: flex; align-items: center">
        <p class="fr-mb-0">
          <span class="fr-icon-arrow-left-line" aria-hidden="true"></span>
          {{ dict[choices.lang].modify }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'

interface Props {
  step: number,
  trackId: string,
  debug?: boolean,
}
const props = defineProps<Props>()

const dictInternational: any = {
  fr: {
    modify: 'modifier'
  }
}
const dict = ref(dictInternational)

const tracks = tracksStore()
const choices = choicesStore()

const selection = ref([])

const track = tracks.getTrack(props.trackId)
const renderAs: string = track?.config.interface.component || 'buttons'
// console.log('RadioChoices > track :', track)
// @ts-ignore
const allowMultiple: boolean = !!track?.config.behavior?.multipleChoices
const optionsArray: any[] | undefined = track?.config.options

const isCompleted = computed(() => !!selection.value.length)

const isActiveChoice = (value: string | number) => {
  // @ts-ignore
  return selection.value.includes(value)
}

const updateSelection = (option: any) => {
  const val: string | number = option.value
  const isActive = isActiveChoice(val)
  let needRemove = false
  if (!isActive) {
    if (allowMultiple) {
      // @ts-ignore
      selection.value.push(val)
    } else {
      // @ts-ignore
      selection.value = [val]
    }
  } else {
    const newArray = selection.value.filter(i => i !== val)
    selection.value = newArray
    needRemove = !newArray.length
  }

  tracks.updateUsedTracks(props.trackId, props.step, option, selection.value)
  
  // console.log('RadioChoices > updateSelection > needRemove :', needRemove)
  if (!needRemove) {
    // console.log('RadioChoices > updateSelection > addToUsedTracks...')
    const canAddTrack = !tracks.trackExistsInUsed(option.next.default)
    canAddTrack && tracks.addToUsedTracks(props.trackId, option.next.default)
  } else {
    // console.log('RadioChoices > updateSelection > removeFromUsedTracks...')
    // tracks.removeFromUsedTracks(props.trackId, option.next.default)
    tracks.removeFurtherUsedTracks(props.trackId)
  }
}
</script>