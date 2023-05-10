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
        <h6 class="fr-mb-1v"> colsWidth : <code>{{ colsWidth }} </code></h6>
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
    class="fr-grid-row fr-grid-row--gutters">

    <!-- v-if="renderAs !== 'cards' || isCompleted" -->
    <!-- <div 
      class="fr-col-1"
      >
    </div> -->

    <div
      v-for="option in optionsArrayDynamic"
      :key="option.value"
      :class="`fr-col-${colsWidth}`"
      >

      <!-- AS CARDS -->
      <div
        v-if="!isCompleted && renderAs === 'cards'"
        >
        <DsfrCard
          :detail="''"
          :title="option.label[choices.lang]"
          :description="option.hint[choices.lang]"
          :horizontal="true"
          @click="updateSelection(option)"
        />
      </div>
      
      <!-- AS BUTTONS -->
      <div 
        v-if="!isCompleted && renderAs === 'buttons'"
        >
        <DsfrButton
          style="width: -moz-available !important;"
          :label="option.label[choices.lang]" 
          :icon="`${isActiveChoice(option.value) ? 'md-radiobuttonchecked' : 'md-radiobuttonunchecked'}`"
          :secondary="isActiveChoice(option.value)"
          @click="updateSelection(option)"
        />
      </div>

      <!-- AS FORM -->
      <div 
        v-if="!isCompleted && renderAs === 'form'"
        class="fr-center fr-pt-5v"
        >
        <TeeForm
          :form-options="option"
          :debug="debug"/>
      </div>

      <!-- SELECTION && COMPLETED-->
      <div 
        v-if="isCompleted && isActiveChoice(option.value)"
        class="fr-grid-row fr-grid-row--gutters fr-mb-0"
        >
        <div
          :class="`fr-col-${colsOptions.buttons}`"
          >
          <DsfrButton
            style="width: -moz-available !important;"
            :label="option.label[choices.lang]" 
            :icon="`${isActiveChoice(option.value) ? 'md-radiobuttonchecked' : 'md-radiobuttonunchecked'}`"
            :secondary="isActiveChoice(option.value)"
            @click="updateSelection(option)"
          />
        </div>
        <div
          :class="`fr-col-${colsOptions.modify}`"
          style="display: flex; align-items: center">
          <DsfrButton
            :label="dict[choices.lang].modify"
            icon="ri-arrow-left-line"
            tertiary
            no-outline
            @click="updateSelection(option)"
          />
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">

import { ref, computed } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
// import type { DsfrButton } from '@gouvminint/vue-dsfr/types'

// @ts-ignore
import TeeForm from './TeeForm.vue'

interface Props {
  step: number,
  trackId: string,
  debug?: boolean,
}
const props = defineProps<Props>()

// internationalization
const dict: any = {
  fr: {
    modify: 'modifier'
  }
}
// const dict = ref(dictInternational)

interface ColsOptions {
  [name: string]: number
}
const colsOptions: ColsOptions = {
  buttons: 8,
  cards: 4,
  form: 8,
  modify: 2,
}

const tracks = tracksStore()
const choices = choicesStore()

const selection = ref([])

const track = tracks.getTrack(props.trackId)
const renderAs: string = track?.config.interface.component || 'buttons'
// console.log('TeeTrack > track :', track)
// @ts-ignore
const allowMultiple: boolean = !!track?.config.behavior?.multipleChoices

interface TrackOptions {
  value: string,
  [name: string]: any
}
const optionsArray: any[] = track?.config.options || []
const optionsArrayDynamic = computed(() => {
  // @ts-ignore
  return isCompleted.value ? optionsArray.filter((v: TrackOptions) => selection.value.includes(v.value)) : optionsArray
})

const isCompleted = computed(() => !!selection.value.length)

// Getters

const colsWidth = computed(() => {
  if (isCompleted.value) {
    return 12
  } else {
    return colsOptions[renderAs]
  }
})

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