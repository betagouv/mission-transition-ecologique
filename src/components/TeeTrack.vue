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
        <h6 class="fr-mb-1v"> trackOperator : <code>{{ trackOperator }} </code></h6>
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
        v-if="renderAs === 'buttons' && !allowMultiple"
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
        v-if="renderAs === 'buttons' && allowMultiple"
        >
        <DsfrButton
          style="width: -moz-available !important;"
          :label="option.label[choices.lang]" 
          :icon="`${isActiveChoice(option.value) ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'}`"
          :secondary="isActiveChoice(option.value)"
          @click="updateMultipleSelection(option)"
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
        v-if="trackId === 'track_results'"
        >
        <TeeResults
          :tracks-results="tracks.tracksResults"
          :debug="debug"
        />
      </div>
    </div>

  </div>
  
  <!-- SEND / NEXT BUTTON -->
  <div 
    v-if="!isCompleted && allowMultiple"
    class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-pt-3v">
    <div class="fr-col-2">
      <DsfrButton
        :label="choices.dict[choices.lang].next"
        :disabled="!selection.length"
        icon="ri-arrow-right-line"
        @click="saveMultipleSelection"
      />
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
          :icon="allowMultiple ? 'ri-checkbox-line' : 'md-radiobuttonchecked'"
          :secondary="true"
          @click="updateSelection(option)"
        />
      </div>

      <!-- MODIFY BUTTTON -->
      <div
        v-if="isActiveChoice(option.value)"
        :class="`fr-col-${colsOptions.modify}`">
        <DsfrButton
          :label="choices.dict[choices.lang].modify"
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
import type { ColsOptions,TrackOpt, FormDataResp } from '@/types/index'

// @ts-ignore
import TeeForm from './TeeForm.vue'
// @ts-ignore
import TeeResults from './TeeResults.vue'

interface Props {
  step: number,
  trackId: string,
  debug?: boolean,
}
const props = defineProps<Props>()

const colsOptions: ColsOptions = {
  buttons: 8,
  cards: 4,
  form: 8,
  modify: 2,
  results: 8,
}

const tracks = tracksStore()
const choices = choicesStore()

const selection = ref([])
const selectionData = ref({})

const track = tracks.getTrack(props.trackId)
const renderAs: string = track?.interface.component || 'buttons'
// console.log('TeeTrack > track :', track)
// @ts-ignore
const allowMultiple: boolean = !!track?.behavior?.multipleChoices

// @ts-ignore
const trackOperator: boolean = track?.behavior?.operator || false
const optionsArray: any[] = track?.options || []
const optionsArrayDynamic = computed(() => {
  // @ts-ignore
  return isCompleted.value ? optionsArray.filter((v: TrackOpt) => selection.value.includes(v.value)) : optionsArray
})

// const isCompleted = computed(() => !!selection.value.length)
const isCompleted = ref(false)

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

const updateSelectionFromForm = (form: FormDataResp) => {
  // console.log('TeeTrack > updateSelectionFromForm > form :', form)
  selectionData.value = form.data
  updateSelection(form)
}

const updateSelectionAndCompleted = (option: any) => {
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
  return needRemove
}

const updateSelection = (option: any) => {
  // console.log()
  // console.log('TeeTrack > updateSelection > option :', option)

  const needRemove = updateSelectionAndCompleted(option)
  isCompleted.value = !!selection.value.length

  // update the pinia store
  updateStore(option, needRemove)
}

const updateMultipleSelection = (option: any) => {
  // console.log()
  // console.log('TeeTrack > updateMultipleSelection > option :', option)

  updateSelectionAndCompleted(option)
  // console.log('TeeTrack > updateMultipleSelection > selection.value :', selection.value)
  // console.log('TeeTrack > updateMultipleSelection > needRemove :', needRemove)
}

const saveMultipleSelection = () => {
  // console.log()
  // console.log('TeeTrack > saveMultipleSelection > ')
  isCompleted.value = true

  // update the pinia store
  updateStore({}, false)
}


const updateStore = (option: any, needRemove: boolean) => {
  // console.log()
  // console.log('TeeTrack > updateStore > option :', option)

  // @ts-ignore
  const next = allowMultiple ? track?.next : option.next

  tracks.updateUsedTracks(props.trackId, props.step, option, selection.value, option.data)
  
  // console.log('TeeTrack > updateStore > needRemove :', needRemove)
  if (!needRemove) {
    // console.log('TeeTrack > updateStore > addToUsedTracks...')
    const canAddTrack = !tracks.trackExistsInUsed(next.default)
    canAddTrack && tracks.addToUsedTracks(props.trackId, next.default)
  } else {
    // console.log('TeeTrack > updateStore > removeFromUsedTracks...')
    // tracks.removeFromUsedTracks(props.trackId, next.default)
    tracks.removeFurtherUsedTracks(props.trackId)
  }
}
</script>