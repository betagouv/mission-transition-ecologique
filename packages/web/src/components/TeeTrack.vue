<template>
  <!-- DEBUGGING -->
  <div
    class="vue-debug"
    v-if="debug">
    <h5>DEBUG - TeeTrack</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> step : <code>{{ step }} </code></h6>
        <h6 class="fr-mb-1v"> trackId : <code>{{ trackId }} </code></h6>
        <h6 class="fr-mb-1v"> isCompleted : <code>{{ isCompleted }} </code></h6>
        <!-- <h6 class="fr-mb-1v"> tracks.isTrackCompleted(trackId) : <code>{{ tracks.isTrackCompleted(trackId) }} </code></h6> -->
        <h6 class="fr-mb-1v"> needRemove : <code>{{ needRemove }} </code></h6>
      </div>
      <div class="fr-col-4">
        <h6 class="fr-mb-1v"> renderAs : <code>{{ renderAs }} </code></h6>
        <h6 class="fr-mb-1v"> allowMultiple : <code>{{ allowMultiple }} </code></h6>
        <h6 class="fr-mb-1v"> trackOperator : <code>{{ trackOperator }} </code></h6>
        <h6 class="fr-mb-1v"> colsWidth : <code>{{ colsWidth }} </code></h6>
        <h6 class="fr-mb-1v"> selectionValues : </h6>
        <code><pre>{{ selectionValues }}</pre> </code>
      </div>
      <!-- <div class="fr-col-3"> -->
        <!-- <h6 class="fr-mb-1v"> selection : </h6>
        <code>{{ selection }} </code> -->
        <!-- <h6 class="fr-mb-1v"> selectionTitles : </h6>
        <code>{{ selectionTitles }} </code> -->
      <!-- </div> -->
      <div class="fr-col-5">
        <!-- <h6 class="fr-mb-1v"> selectedOption : </h6>
        <code>{{ selectedOption }} </code> -->
        <h6 class="fr-mb-1v"> selectedOptions : </h6>
        <code><pre>{{ selectedOptions }}</pre></code>
      </div>

      <div
        v-if="false"
        class="fr-col-6">
        <h4>optionsArray (values) :</h4>
        <code><pre>{{ optionsArray.map(o => o.value) }}</pre></code>
      </div>
    </div>
  </div>

  <!-- selectedOptions.map (values) : <code>{{ selectedOptions.map(i => i.value) }}</code> -->
  <Transition
    appear
    :name="`${step > 1 ? 'slide-fade' : ''}`"
    mode="out-in">
    <div
      v-show="!isCompleted"
      :key="`track-${step}-${trackId}`"
      :id="trackId"
      class="fr-grid-row">
      <div
        :class="`fr-col${track.imageRight ? ' fr-col-md-7 fr-col-lg-7 tee-track-has-image-right' : ''}`">
        <!-- UNCOMPLETED QUESTIONNAIRE -->
        <div
          :class="`fr-grid-row fr-grid-row--gutters ${track.bgColor ? 'fr-p-5v fr-p-sm-8v fr-p-md-20v' : ''}`"
          >

          <!-- CALLOUT (TEXT + IMAGE) -->
          <div
            v-if="track.callout"
            :class="`fr-col-12 ${track.callout.bigTitle ? 'fr-mb-10v fr-mx-0 fr-px-2v' : ''}`"
            >
            <div
              :class="`${track.callout.bigTitle ? 'fr-px-2v' : 'fr-py-4v fr-px-4v'}`"
              :style="`background-color: ${track.callout.bgColor || 'transparent'}`">
              <div class="tee-track-callout fr-grid-row fr-grid-row--gutters">
                <!-- CALLOUT IMAGE LEFT -->
                <div
                  v-if="track.callout.imageLeft"
                  class="fr-col fr-col-5 fr-col-sm-hide tee-track-callout-img fr-pl-0 fr-py-0 fr-pr-0"
                  style="align-self: center;">
                  <img
                    class="fr-responsive-img"
                    :src="`${choices.publicPath}${track.callout.imageLeft}`"
                    :alt="`image / callout`"
                    />
                </div>
                <!-- CALLOUT TEXT -->
                <div
                  :class="`${track.callout.bigTitle ? 'fr-col' : 'fr-col fr-col-7 tee-track-callout-texts'}`">
                  <!-- CALLOUT HEADER -->
                  <h2
                    v-if="track.callout.header"
                    :style="`${track.callout.headerStyle || 'color: var(--text-default-info);'}`"
                    class="tee-track-callout-header">
                    {{ track.callout.header[choices.lang]}}
                  </h2>
                  <!-- CALLOUT TITLE / BIG TITLE -->
                  <h1
                    v-if="track.callout.bigTitle"
                    class="fr-mb-3 tee-track-callout-big-title"
                    :style="`${track.callout.titleStyle || ''}`">
                    {{ track.callout.title[choices.lang]}}
                  </h1>
                  <h3
                    v-else
                    class="fr-callout__title tee-track-callout-title"
                    :style="`${track.callout.titleStyle || ''}`">
                    {{ track.callout.title[choices.lang]}}
                  </h3>
                  <!-- CALLOUT DESCRIPTION -->
                  <p
                    v-if="track.callout.description"
                    class="fr-callout__text tee-track-callout-description"
                    :style="`${track.callout.descriptionStyle || ''}`">
                    {{ track.callout.description[choices.lang]}}
                  </p>
                  <!-- CALLOUT HINT -->
                  <p
                    v-if="track.callout.hint"
                    class="fr-mt-2v fr-mb-1v tee-track-callout-hint"
                    style="color: var(--text-active-blue-france);">
                    <i>
                      <span
                        v-if="track.callout.hintIcon"
                        :class="track.callout.hintIcon"
                        aria-hidden="true">
                      </span>
                      {{ track.callout.hint[choices.lang]}}
                    </i>
                  </p>
                </div>
                <!-- CALLOUT IMAGE RIGHT -->
                <div
                  v-if="track.callout.imageRight"
                  class="fr-col-3"
                  style="align-self: center;">
                  <img
                    class="fr-responsive-img"
                    :src="`${choices.publicPath}${track.callout.imageRight}`"
                    :alt="`image / callout`"
                    />
                </div>
              </div>
            </div>
          </div>

          <!-- TRACK LABEL -->
          <div
            v-if="step !== 1"
            :class="`${isTrackResults ? 'fr-col-10 fr-col-offset-md-1' : 'fr-col-12'}`">
            <h3
              :class="`${track.info ? 'fr-mb-0' : 'fr-mb-2v'}`"
              :style="`${isTrackResults ? 'color: #000091; font-size: 2.75rem;' : ''}`">
              {{ tracks.getTrackLabel(trackId, choices.lang) }}
            </h3>
          </div>

          <!-- TRACK INFOS -->
          <div
            v-if="step !== 1 && track.info"
            :class="`${isTrackResults ? 'fr-col-12 fr-col-offset-md-1' : 'fr-col-12'}`">
            <p class="fr-mb-2v">
              <span
                class="fr-icon-info-fill"
                aria-hidden="true"></span>
              {{ track.info[choices.lang] }}
            </p>
          </div>

          <!-- TRACK HINT -->
          <div
            v-if="step !== 1 && track.hint"
            :class="`${isTrackResults ? 'fr-col-10 fr-col-offset-md-1' : 'fr-col-12'}`">
            <p
              :class="`fr-mb-0`"
              :style="`${isTrackResults ? 'color: #000091;' : ''}`">
              {{ track.hint[choices.lang] }}
            </p>
          </div>

          <!-- TRACK RESUME -->
          <div
            v-if="step !== 1 && track.resume"
            :class="`${isTrackResults ? 'fr-col-10 fr-col-offset-md-1' : 'fr-col-12'}`">
            <p class="fr-mb-0">
              {{ track.resume[choices.lang] }}
            </p>
          </div>

          <!-- TRACK CHOICES {{ renderAs }} -->
          <div
            v-for="(option, idx) in optionsArray"
            :key="`track-${step}-${trackId}-option-${idx}`"
            :class="`${colsWidth} ${isTrackResults ? 'fr-col-offset-md-1' : ''} tee-track-choice`"
            >

            <!-- AS CARDS -->
            <div
              v-if="renderAs === 'cards'"
              style="height: 99%;"
              >
              <div
                class="fr-card fr-enlarge-link"
                @click="updateSelection(option, idx)">
                <div
                  v-if="option.imageTop"
                  class="fr-card__header">
                  <div class="fr-card__img">
                    <img
                      class="fr-responsive-img"
                      :src="`${choices.publicPath}${option.imageTop}`"
                      :alt="`image / ${option.label}`"
                      />
                  </div>
                </div>
                <div class="fr-card__body">
                  <div class="fr-card__content">
                    <p
                      v-if="option.hintImage"
                      class="fr-card__desc fr-mt-0 fr-mb-2v"
                      style="order: 2;">
                      <span
                        v-if="option.hintImageIcon"
                        :class="option.hintImageIcon"
                        aria-hidden="true">
                      </span>
                      {{ option.hintImage[choices.lang] }}
                    </p>
                    <h3 class="fr-card__title">
                      <!-- <a href="#"> -->
                        {{ option.label[choices.lang] }}
                      <!-- </a> -->
                    </h3>
                    <div
                      v-if="isActiveChoice(option.value)"
                      class="fr-card__start">
                      <p class="fr-badge fr-badge--info fr-badge--no-icon fr-mb-4v">
                        {{ choices.t('selection.selected') }}
                      </p>
                    </div>
                  </div>
                  <p
                    v-if="option.hint"
                    class="fr-card__desc">
                    <span
                      v-if="option.hintIcon"
                      :class="option.hintIcon"
                      aria-hidden="true">
                    </span>
                    {{ option.hint[choices.lang] }}
                  </p>
                  <p
                    v-if="option.resume"
                    class="fr-card__desc">
                    {{ option.resume[choices.lang] }}
                  </p>
                </div>
                <!-- <div class="fr-card__header">
                  <div class="fr-card__img">
                    <img
                      class="fr-responsive-img"
                      src="/img/placeholder.16x9.png"
                      alt="[À MODIFIER - vide ou texte alternatif de l’image]">
                  </div>
                </div> -->
              </div>
            </div>

            <!-- AS BUTTONS -->
            <div
              v-if="renderAs === 'buttons' && !option.hasInput"
              class="fr-div-fixed-height">
              <DsfrButton
                class="fr-btn-fullwidth fr-btn-fixed-height fr-btn-sm-align-left fr-btn-grey"
                :style="`outline-color: #929292; ${isActiveChoice(idx) ? 'background-color: #eeeeee' : ''}`"
                :label="option.label[choices.lang]"
                :icon="getButtonIcon(idx)"
                :secondary="!isActiveChoice(idx)"
                @click="updateSelection(option, idx)"
              />
            </div>

            <!-- AS BUTTON + BUTTON INPUT -->
            <div
              v-if="renderAs === 'buttons' && option.hasInput"
              class="fr-div-fixed-height">
              <TeeTrackButtonInput
                :track-id="trackId"
                :icon="getButtonIcon(idx)"
                :is-active="isActiveChoice(idx)"
                :option="option"
                :debug="debug"
                @update-selection="updateSelectionFromSignal($event, idx)"
                @update-value="updateSelectionValueFromSignal($event)"
                @go-to-next-track="saveSelectionFromSignal($event, idx)"
                />
            </div>

            <!-- AS SIMPLE BUTTONS -->
            <div
              v-if="renderAs === 'simpleButtons'">
              <DsfrButton
                class="fr-btn-fullwidth fr-btn-align-center"
                :label="option.label[choices.lang]"
                size="large"
                style="font-weight: 1000; min-height: 3.5rem; font-size: 1.5rem;"
                @click="updateSelection(option, idx); saveSelection()"
              />
            </div>

            <!-- AS INPUT -->
            <div
              v-if="renderAs === 'input'"
              style="height: 100%;">
              <TeeTrackInput
                :track-id="trackId"
                :option="option"
                :is-active="isActiveChoice(idx)"
                :debug="debug"
                @update-selection="updateSelectionFromSignal($event, idx)"
                @go-to-next-track="saveSelectionFromSignal($event, idx)"
                />
            </div>

            <!-- AS FORM -->
            <!-- <div
              v-show="renderAs === 'form'"
              >
              <TeeForm
                :form-options="option"
                :debug="debug"
                @saveData="updateSelectionFromForm"/>
            </div> -->

            <!-- AS RESULT -->
            <div
              v-if="isTrackResults"
              >
              <TeeResults
                :track-id="trackId"
                :track-config="track.config"
                :track-options="track.options"
                :track-form="track.form"
                :tracks-results="tracks.usedTracks"
                :track-element="trackElement"
                :disable-widget="disableWidget"
                :debug="debug || false"
              />
            </div>
          </div>

        </div>

        <!-- SEND / NEXT BUTTON -->
        <div
          v-if="!noNeedForNext.includes(renderAs) && !isCompleted && !isTrackResults"
          class="fr-grid-row fr-grid-row--gutters fr-pt-8v"
          style="justify-content: start;">
          <!-- BTN PREVIOUS -->
          <div
            v-if="step > 1"
            class="fr-col-6 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
            <DsfrButton
              class="fr-btn-fullwidth fr-btn-sm-fullwidth"
              :label="choices.t('previous')"
              icon="ri-arrow-left-line"
              secondary
              @click="backToPreviousTrack"
            />
          </div>
          <!-- BTN NEXT -->
          <div
            class="fr-col-6 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
            <DsfrButton
              class="fr-btn-fullwidth fr-btn-sm-fullwidth"
              :label="choices.t('next')"
              :disabled="!selectedOptions.length"
              icon="ri-arrow-right-line"
              icon-right
              @click="saveSelection"
              :loading='isLoadingNext'
            />
          </div>
        </div>
      </div>

      <!-- TRACK IMAGE RIGHT IF ANY -->
      <div
        v-if="track.imageRight"
        class="fr-col-12 fr-col-md-5 fr-col-lg-5 tee-track-image-right">
        <img
          class="fr-responsive-img"
          :src="`${choices.publicPath}${track.imageRight}`"
          :alt="`image / callout`"
          />
      </div>
    </div>
  </Transition>

</template>

<script setup lang="ts">

import { ref, computed, watch, toRaw } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
import { analyticsStore } from '../stores/analytics'
// import type { DsfrButton } from '@gouvminint/vue-dsfr/types'

// @ts-ignore
import type { Track, TrackOptions, NextTrackRule, ColsOptions } from '@/types/index'

import { remapItem, scrollToTop } from '../utils/helpers'
import { CheckNextTrackRules } from '../utils/conditions'

// @ts-ignore
import TeeTrackInput from './TeeTrackInput.vue'
// @ts-ignore
import TeeTrackButtonInput from './TeeTrackButtonInput.vue'
// // @ts-ignore
// import TeeForm from './TeeForm.vue'
// @ts-ignore
import TeeResults from './results/TeeResults.vue'
import DsfrButton from '@/components/button/DsfrButton.vue'

interface Props {
  step: number,
  trackId: string,
  isCompleted: boolean,
  trackElement: any,
  disableWidget?: boolean,
  debug?: boolean,
}
const props = defineProps<Props>()

const colsOptions: ColsOptions = {
  buttons: 12,
  simpleButtons: 10,
  input: 12,
  cards: 4,
  form: 8,
  modify: 2,
  results: 10,
}
const colsOptionsLarge: ColsOptions = {
  buttons: 12,
  simpleButtons: 8,
  input: 12,
  cards: 6,
  form: 8,
  modify: 2,
  results: 10,
}

const noNeedForNext = [
  'cards',
  'simpleButtons'
]

const tracks = tracksStore()
const choices = choicesStore()
const analytics = analyticsStore()

const selectedOptionsIndices = ref<number[]>([])
const selectedOptions = ref<any[]>([])
const needRemove = ref<boolean>(false)
const isLoadingNext = ref<boolean>(false)

const track: Track | any = tracks.getTrack(props.trackId)

// console.log('TeeTrack > track :', track)
const renderAs: string = track?.interface.component || 'buttons'
const customColWidth: number | string = track?.interface.columnWidth || 0
// console.log('TeeTrack > track :', track)

// @ts-ignore
const allowMultiple: boolean = !!track?.behavior?.multipleChoices

// @ts-ignore
const trackOperator: boolean = track?.behavior?.operator || false
const optionsArray: any[] = track?.options.filter( (o: TrackOptions) => !o.disabled) || []

// computed
const isTrackResults = computed(() => {
  return track?.interface.component === 'results'
})
const selectionValues = computed(() => {
  // console.log('TeeTrack > selectionValues > selectedOptions.value :', selectedOptions.value)
  const values = selectedOptions.value.length && selectedOptions.value.map(o => o?.value)
  // console.log('TeeTrack > selectionValues > values :', values)
  return values || []
})

const colsWidth = computed(() => {
  let divSize: string | number
  let divSizeLarge = colsOptionsLarge[renderAs]

  if (props.isCompleted) {
    // full width of 10 if completed track
    divSize = colsOptions[renderAs]
  } else if (customColWidth === 'auto') {
    // auto columns width
    const rawDiv = Math.round(12 / optionsArray.length)
    divSize = rawDiv < 2 ? 3 : rawDiv >= 12 ? colsOptions[renderAs] : rawDiv
  } else {
    if (customColWidth) {
      // if defined in track*.ts
      divSizeLarge = customColWidth
      divSize = customColWidth
    } else {
      // default values hard written
      divSize = colsOptions[renderAs]
    }
  }

  return `fr-col-xl-${divSizeLarge} fr-col-lg-${divSize} fr-col-md-${divSize} fr-col-sm-12 fr-col-xs-12`
})

// getters
const isActiveChoice = (index: number) => {
  // console.log()
  // console.log('TeeTrack > isActiveChoice > value :', value)
  // console.log('TeeTrack > isActiveChoice > index :', index)
  // console.log('TeeTrack > isActiveChoice > selectionValues :', selectionValues)
  const activeIndex = selectedOptionsIndices.value.includes(index)
  // const activeValue = selectionValues.value.includes(value)
  return activeIndex
}

const updateSelection = (option: any, index: number, forceRemove: boolean = false) => {
  // console.log()
  // console.log('TeeTrack > updateSelection > option :', option)
  // console.log('TeeTrack > updateSelection > index :', index)
  const isActive = isActiveChoice(index)
  // console.log('TeeTrack > updateSelection > isActive :', isActive)
  // console.log('TeeTrack > updateSelection > forceRemove :', forceRemove)
  let remove = false
  if (!isActive && !forceRemove) {
    if (allowMultiple) {
      selectedOptionsIndices.value.push(index)
      selectedOptions.value.push(option)
    } else {
      selectedOptionsIndices.value = [index]
      selectedOptions.value = [option]
    }

    // analytics / track event / only if positive choice
    // @ts-ignore
    for(const [key, val] of Object.entries(option.value)) {
      analytics.sendEvent(props.trackId, key, val)
    }
  } else {
    // remove from selection because is already active
    selectedOptionsIndices.value = selectedOptionsIndices.value.filter(i => i !== index)
    selectedOptions.value = selectedOptions.value.filter(i => i.value !== option.value)
    remove = !selectedOptions.value.length
  }
  needRemove.value = remove
  // selectedOptions.value = option

  // console.log('TeeTrack > updateSelection > selectedOptions.value :', selectedOptions.value)

  // Direct to next track
  const directToNext: string[] = ['cards']
  if (!allowMultiple && directToNext.includes(renderAs)  ) {
    saveSelection()
  }
}

const updateSelectionFromSignal = (ev: any, index: number) => {
  // console.log()
  // console.log('TeeTrack > updateSelectionFromSignal > ev :', ev)
  updateSelection(ev.option, index, ev.remove)
}

const updateSelectionValueFromSignal = (ev: any) => {
  // console.log()
  // console.log('TeeTrack > updateSelectionValueFromSignal > ev :', ev)
  // console.log('TeeTrack > updateSelectionValueFromSignal > index :', index)
  // console.log('TeeTrack > updateSelectionValueFromSignal > selectedOptions.value :', selectedOptions.value)
  const inputField = ev.option.inputField
  const temp = selectedOptions.value.map(i => {
    const obj = { ...i }
    const objValues = {...obj.value}
    // console.log('TeeTrack > updateSelectionValueFromSignal > objValues :', objValues)

    if (Object.keys(objValues).includes(inputField)) {
      objValues[inputField] = ev.option.value[inputField]
    }

    obj.value = objValues
    return obj
  })
  selectedOptions.value = temp

}

const saveSelectionFromSignal = (ev: any, index: number) => {
  console.log()
  // scrollToTop(props.trackElement, props.trackId)
  // console.log('TeeTrack > saveSelectionFromSignal > ev :', ev)
  updateSelection(ev.option, index)
  saveSelection()
}

const resetSelections = () => {
  selectedOptionsIndices.value = []
  selectedOptions.value = []
}

const getButtonIcon = (index: number) => {
  const isActive = isActiveChoice(index)
  // console.log('TeeTrack > getButtonIcon > isActive :', isActive)
  let icon = ''
  if (allowMultiple) {
    icon = isActive ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'
  } else {
    icon = isActive ? 'md-radiobuttonchecked' : 'md-radiobuttonunchecked'
  }
  return icon
}

// watchers
watch(() => props.isCompleted, ( next ) => {
  // console.log()
  // console.log('TeeTrack > watch > props.trackId :', props.trackId )
  // console.log('TeeTrack > watch > isCompleted :', next )
  if (!next) {
    // console.log('TeeTrack > watch > selectionValues :', selectionValues )
    // if (noNeedForNext.includes(renderAs)) {
    //   resetSelections()
    // }
    resetSelections()
    tracks.updateUsedTracks(props.trackId, props.step, next, selectedOptions.value)
  }
})

// functions

const saveSelection = async () => {
  try {
    // console.log()
    // console.log('TeeTrack > updateStore > selectedOptions.value :', selectedOptions.value)
    isLoadingNext.value = true
    const optionNext = selectedOptions.value[0].next
    const nextExceptions = optionNext?.exceptions
    const defaultNext = track?.next


    // @ts-ignore
    let next = !optionNext || allowMultiple ? defaultNext : optionNext

    // SWITCH NEXT TRACK DEPENDING ON CONDITIONS
    // NOTE : could be deplaced in store ?
    // console.log('TeeTrack > updateStore > optionNext :', optionNext)
    if (nextExceptions) {
      // console.log('TeeTrack > updateStore > nextExceptions :', nextExceptions)

      // get used tracks values
      const trackValues: any[] = tracks.getAllUsedTracksValues
      // console.log('TeeTrack > updateStore > trackValues :', trackValues)

      // get current selection
      // console.log('TeeTrack > updateStore > selectedOptions.value :', selectedOptions.value)
      const selectionVals = selectedOptions.value.map(item => {
        return toRaw(item.value)
      })
      // console.log('TeeTrack > updateStore > selectionVals :', selectionVals)

      nextExceptions.forEach((trackRule: NextTrackRule) => {
        const dataStructure = {}
        let item = remapItem(dataStructure, trackRule.rules, {}, trackValues, {}, {}, selectionVals, choices.lang)
        // console.log('TeeTrack > updateStore > item :', item)
        const bool = CheckNextTrackRules(item, trackRule.rules)
        // console.log('TeeTrack > updateStore > bool :', bool)
        next = bool ? trackRule.next : next
      })
    }

    // console.log('TeeTrack > updateStore > next :', next)

    await tracks.updateUsedTracks(props.trackId, props.step, next, selectedOptions.value)

    // console.log('TeeTrack > updateStore > needRemove.value :', needRemove.value)
    if (!needRemove.value) {
      // console.log('TeeTrack > updateStore > addToUsedTracks...')
      const canAddTrack = !tracks.trackExistsInUsed(next.default)
      canAddTrack && tracks.addToUsedTracks(props.trackId, next.default)
    } else {
      // console.log('TeeTrack > updateStore > removeFromUsedTracks...')
      await tracks.removeFurtherUsedTracks(props.trackId)
    }

    !props.disableWidget && scrollToTop(props.trackElement, props.trackId)
  } finally {
    isLoadingNext.value = false
  }
}

const backToPreviousTrack = async () => {
  // console.log()
  // console.log('TeeTrack > backToTrack > props.trackId :', props.trackId)
  const indexOfTrack = tracks.tracksStepsArray.indexOf(props.trackId)
  // console.log('TeeTrack > backToTrack > indexOfTrack :', indexOfTrack)
  const TrackToGoBackTo = tracks.tracksStepsArray[indexOfTrack - 1]
  // console.log('TeeTrack > backToTrack > TrackToGoBackTo :', TrackToGoBackTo)
  await tracks.setUsedTracksAsNotCompleted(TrackToGoBackTo)
  await tracks.removeFurtherUsedTracks(TrackToGoBackTo)

  !props.disableWidget && scrollToTop(props.trackElement, props.trackId)
}
</script>
