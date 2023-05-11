<template>
  <div
    class="vue-debug"
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

        <h6 class="fr-mb-1v"> selectionData : </h6>
        <code>{{ selectionData }} </code>
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

  <!-- UNCOMPLETED QUESTIONNAIRE -->
  <div
  v-if="!isCompleted"
  class="fr-grid-row fr-grid-row--gutters"
  >
  
    <!-- TRACK CHOICES -->
    <div
      v-for="option in optionsArrayDynamic"
      :key="option.value"
      :class="`fr-col-${colsWidth} ${renderAs !== 'cards' ? 'fr-col-offset-2' : ''}`"
      >
      
      <!-- AS CARDS -->
      <div
        v-if="renderAs === 'cards'"
        style="height: 100%;"
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
        v-if="renderAs === 'buttons'"
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
        v-show="renderAs === 'form'"
        >
        <TeeForm
          :form-options="option"
          :debug="debug"
          @saveData="updateSelectionFromForm"/>
      </div>

      <!-- AS RESULT -->
      <div 
        v-if="trackId === 'results'"
        >
        <h4>
          {{ dict[choices.lang].results }}
        </h4>
        <p 
          v-if="true"
          class="vue-debug">
          <h6>tracks.tracksResults</h6>
          <code><pre>{{ tracks.tracksResults }}</pre></code>
        </p>
      </div>

    </div>
  </div>


  <!-- COMPLETED QUESTIONNAIRE -->
  <div
    v-if="isCompleted"
    >
    
    <!-- TRACK CHOICES -->
    <div
      v-for="option in optionsArrayDynamic"
      :key="option.value"
      class="fr-grid-row fr-grid-row--gutters fr-mb-2v"
      >

      <!-- ACTIVE CHOICE(S) -->
      <div
        v-if="isActiveChoice(option.value)"
        :class="`fr-col-${colsOptions.buttons} fr-col-offset-2`"
        >
        <DsfrButton
          style="width: -moz-available !important;"
          :label="option.label[choices.lang]" 
          :icon="`md-radiobuttonchecked`"
          :secondary="true"
          @click="updateSelection(option)"
        />
      </div>

      <!-- MODIFY BUTTTON -->
      <div
        v-if="isActiveChoice(option.value)"
        :class="`fr-col-${colsOptions.modify}`">
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
    modify: 'modifier',
    results: 'Vos résultats'
  }
}
// const dict = ref(dictInternational)

interface ColsOptions {
  [name: string]: number | string
}
const colsOptions: ColsOptions = {
  buttons: 8,
  cards: 4,
  form: 8,
  modify: 2,
  results: 10,
}

const tracks = tracksStore()
const choices = choicesStore()

const selection = ref([])
const selectionData = ref({})

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
    return 10
  } else {
    return colsOptions[renderAs]
  }
})

const isActiveChoice = (value: string | number) => {
  // @ts-ignore
  return selection.value.includes(value)
}

interface FormDataResp {
  value: string,
  next: string,
  data: any
}
const updateSelectionFromForm = (form: FormDataResp) => {
  // console.log('TeeTrack > updateSelectionFromForm > form :', form)
  selectionData.value = form.data
  updateSelection(form)
}

const updateSelection = (option: any) => {
  // console.log()
  // console.log('TeeTrack > updateSelection > option :', option)
  // console.log('TeeTrack > updateSelection > dataAsVal :', dataAsVal)

  const val: string | number = option.value
  const isActive = isActiveChoice(option.value)
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

  tracks.updateUsedTracks(props.trackId, props.step, option, selection.value, option.data)
  
  // console.log('TeeTrack > updateSelection > needRemove :', needRemove)
  if (!needRemove) {
    // console.log('TeeTrack > updateSelection > addToUsedTracks...')
    const canAddTrack = !tracks.trackExistsInUsed(option.next.default)
    canAddTrack && tracks.addToUsedTracks(props.trackId, option.next.default)
  } else {
    // console.log('TeeTrack > updateSelection > removeFromUsedTracks...')
    // tracks.removeFromUsedTracks(props.trackId, option.next.default)
    tracks.removeFurtherUsedTracks(props.trackId)
  }
}
</script>