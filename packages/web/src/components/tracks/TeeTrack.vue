<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug"
  >
    <h5>DEBUG - TeeTrack</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v">
          step : <code>{{ step }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          trackId : <code>{{ trackId }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          isCompleted : <code>{{ isCompleted }} </code>
        </h6>
        <!-- <h6 class="fr-mb-1v"> tracks.isTrackCompleted(trackId) : <code>{{ tracks.isTrackCompleted(trackId) }} </code></h6> -->
        <h6 class="fr-mb-1v">
          needRemove : <code>{{ needRemove }} </code>
        </h6>
      </div>
      <div class="fr-col-4">
        <h6 class="fr-mb-1v">
          renderAs : <code>{{ renderAs }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          allowMultiple : <code>{{ allowMultiple }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          colsWidth : <code>{{ colsWidth }} </code>
        </h6>
        <h6 class="fr-mb-1v">selectionValues :</h6>
        <code>
          <pre>{{ selectionValues }}</pre>
        </code>
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
        <h6 class="fr-mb-1v">selectedOptions :</h6>
        <code>
          <pre>{{ selectedOptions }}</pre>
        </code>
      </div>

      <div
        v-if="false"
        class="fr-col-6"
      >
        <h4>optionsArray (values) :</h4>
        <code>
          <pre>{{ optionsArray.map((o) => o.value) }}</pre>
        </code>
      </div>
    </div>
  </div>

  <div
    v-show="!isCompleted && track !== undefined"
    :id="trackId"
    :key="`track-${step}-${trackId}`"
    class="fr-grid-row"
  >
    <div :class="`fr-col${track?.imageRight ? ' fr-col-md-7 fr-col-lg-7 tee-track-has-image-right' : ''}`">
      <!-- UNCOMPLETED QUESTIONNAIRE -->
      <div :class="`fr-grid-row fr-grid-row--gutters ${track?.bgColor ? 'fr-p-5v fr-p-sm-8v fr-p-md-20v' : ''}`">
        <!-- CALLOUT (TEXT + IMAGE) -->
        <div
          v-if="track?.callout"
          :class="`fr-col-12 ${track.callout.bigTitle ? 'fr-mb-10v fr-mx-0 fr-px-2v' : ''}`"
        >
          <div
            :class="`${track.callout.bigTitle ? 'fr-px-2v' : 'fr-py-4v fr-px-4v'}`"
            :style="`background-color: ${track.callout.bgColor || 'transparent'}`"
          >
            <div class="tee-track-callout fr-grid-row fr-grid-row--gutters">
              <!-- CALLOUT IMAGE LEFT -->
              <div
                v-if="track.callout.imageLeft"
                class="fr-col-4 fr-col-sm-4 fr-col-md-5 tee-track-callout-img fr-pl-0 fr-p-2v fr-pr-0"
                style="align-self: center"
              >
                <img
                  class="fr-responsive-img"
                  :src="`${choices.publicPath}${track.callout.imageLeft}`"
                  :alt="`image / callout`"
                />
              </div>
              <!-- CALLOUT TEXT -->
              <div :class="`${track.callout.bigTitle ? 'fr-col-8 fr-col-sm-8 fr-col-md-7' : 'fr-col fr-col-md-7 tee-track-callout-texts'}`">
                <!-- CALLOUT HEADER -->
                <h2
                  v-if="track.callout.header"
                  :style="`${track.callout.headerStyle || 'color: var(--text-default-info);'}`"
                  class="tee-track-callout-header"
                >
                  {{ track.callout.header[choices.lang] }}
                </h2>
                <!-- CALLOUT TITLE / BIG TITLE -->
                <h1
                  v-if="track.callout.bigTitle"
                  class="fr-mb-3 tee-track-callout-big-title"
                  :style="`${track.callout.titleStyle || ''}`"
                >
                  {{ track.callout.title[choices.lang] }}
                </h1>
                <h3
                  v-else
                  class="fr-callout__title tee-track-callout-title"
                  :style="`${track.callout.titleStyle || ''}`"
                >
                  {{ track.callout.title[choices.lang] }}
                </h3>
                <!-- CALLOUT DESCRIPTION -->
                <p
                  v-if="track.callout.description"
                  class="fr-callout__text tee-track-callout-description fr-mb-2v"
                  :style="`${track.callout.descriptionStyle || ''}`"
                >
                  {{ track.callout.description[choices.lang] }}
                </p>
                <!-- CALLOUT HINT -->
                <p
                  v-if="track.callout.hint"
                  class="fr-mt-2v fr-mb-1v tee-track-callout-hint"
                  style="color: var(--text-active-blue-france)"
                >
                  <i>
                    <span
                      v-if="track.callout.hintIcon"
                      :class="track.callout.hintIcon"
                      aria-hidden="true"
                    >
                    </span>
                    {{ track.callout.hint[choices.lang] }}
                  </i>
                </p>
              </div>
              <!-- CALLOUT IMAGE RIGHT -->
              <div
                v-if="track.callout.imageRight"
                class="fr-col-3"
                style="align-self: center"
              >
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
          :class="`fr-mt-3v ${isTrackResults ? 'fr-col-10 fr-col-offset-md-1' : 'fr-col-12'}`"
        >
          <h3
            :class="`${track?.info ? 'fr-mb-0' : 'fr-mb-2v'}`"
            :style="`${isTrackResults ? 'color: #000091; font-size: 2.75rem;' : ''}`"
          >
            {{ tracks.getTrackLabel(trackId, choices.lang) }}
          </h3>
        </div>

        <!-- TRACK INFOS -->
        <div
          v-if="step !== 1 && track?.info"
          :class="`${isTrackResults ? 'fr-col-12 fr-col-offset-md-1' : 'fr-col-12'}`"
        >
          <p class="fr-mb-2v">
            <span
              class="fr-icon-info-fill"
              aria-hidden="true"
            ></span>
            {{ track.info[choices.lang] }}
          </p>
        </div>

        <!-- TRACK HINT -->
        <div
          v-if="step !== 1 && track?.hint"
          :class="`${isTrackResults ? 'fr-col-10 fr-col-offset-md-1' : 'fr-col-12'}`"
        >
          <p
            :class="`fr-mb-0`"
            :style="`${isTrackResults ? 'color: #000091;' : ''}`"
          >
            {{ track.hint[choices.lang] }}
          </p>
        </div>

        <!-- TRACK RESUME -->
        <div
          v-if="step !== 1 && track?.resume"
          :class="`${isTrackResults ? 'fr-col-10 fr-col-offset-md-1' : 'fr-col-12'}`"
        >
          <p class="fr-mb-0">
            {{ track.resume[choices.lang] }}
          </p>
        </div>

        <!-- TRACK CHOICES {{ renderAs }} / EXCEPT SELECT-->
        <div
          v-for="(option, idx) in optionsArray"
          :key="`track-${step}-${trackId}-option-${idx}`"
          :class="`${colsWidth} ${isTrackResults ? 'fr-col-offset-md-1' : ''} tee-track-choice`"
          :style="renderAs === trackComponents.Select ? 'display: none' : ''"
        >
          <!-- AS CARDS -->
          <div
            v-if="renderAs === trackComponents.Cards"
            style="height: 99%"
          >
            <div
              class="fr-card fr-enlarge-link"
              @click="updateSelection(option, idx)"
            >
              <div
                v-if="option.imageTop"
                class="fr-card__header"
              >
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
                    style="order: 2"
                  >
                    <span
                      v-if="option.hintImageIcon"
                      :class="option.hintImageIcon"
                      aria-hidden="true"
                    >
                    </span>
                    {{ option.hintImage[choices.lang] }}
                  </p>
                  <h3 class="fr-card__title">
                    <!-- <a href="#"> -->
                    {{ option.label?.[choices.lang] }}
                    <!-- </a> -->
                  </h3>
                  <div
                    v-if="isActiveChoice(option.value as number)"
                    class="fr-card__start"
                  >
                    <p class="fr-badge fr-badge--info fr-badge--no-icon fr-mb-4v">
                      {{ choices.t('selection.selected') }}
                    </p>
                  </div>
                </div>
                <p
                  v-if="option.hint"
                  class="fr-card__desc"
                >
                  <span
                    v-if="option.hintIcon"
                    :class="option.hintIcon"
                    aria-hidden="true"
                  >
                  </span>
                  {{ option.hint[choices.lang] }}
                </p>
                <p
                  v-if="option.resume"
                  class="fr-card__desc"
                >
                  {{ option.resume[choices.lang] }}
                </p>
              </div>
            </div>
          </div>

          <!-- AS BUTTONS -->
          <div
            v-if="renderAs === trackComponents.Buttons && !isTrackOptionsInput(option)"
            class="fr-div-fixed-height"
          >
            <DsfrButton
              class="fr-btn-fullwidth fr-btn-fixed-height fr-btn-sm-align-left fr-btn-grey"
              :style="`outline-color: #929292; ${isActiveChoice(idx) ? 'background-color: #eeeeee' : ''}`"
              :label="option.label?.[choices.lang]"
              :icon="getButtonIcon(idx)"
              :secondary="!isActiveChoice(idx)"
              @click="updateSelection(option, idx)"
            />
          </div>

          <!-- AS BUTTON + BUTTON INPUT -->
          <div
            v-if="renderAs === trackComponents.Buttons && isTrackOptionsInput(option)"
            class="fr-div-fixed-height"
          >
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
          <div v-if="renderAs === trackComponents.SimpleButtons">
            <DsfrButton
              class="fr-btn-fullwidth fr-btn-align-center"
              :label="option.label?.[choices.lang]"
              size="large"
              style="font-weight: 1000; min-height: 3.5rem; font-size: 1.5rem"
              @click="updateAndSave(option, idx)"
            />
          </div>

          <!-- AS INPUT -->
          <div
            v-if="renderAs === trackComponents.Input && isTrackOptionsInput(option)"
            style="height: 100%"
          >
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
          <div v-if="isTrackResults">
            <TeeResults
              :track-id="trackId"
              :track-config="track?.config"
              :track-options="track?.options"
              :track-form="track?.form"
              :tracks-results="tracks.usedTracks"
              :track-element="trackElement"
              :disable-widget="disableWidget"
              :debug="debug || false"
            />
          </div>
        </div>
      </div>

      <!-- AS SELECT -->
      <div v-if="track !== undefined && renderAs === trackComponents.Select">
        <TeeTrackSelect
          :track="track"
          @update-selection="updateSelectionValueFromSelectSignal($event)"
        />
      </div>

      <!-- SEND / NEXT BUTTON -->
      <div
        v-if="!noNeedForNext.includes(renderAs) && !isCompleted && !isTrackResults"
        class="fr-grid-row fr-grid-row--gutters fr-pt-8v"
        style="justify-content: start"
      >
        <!-- BTN PREVIOUS -->
        <div
          v-if="step > 1"
          class="fr-col-6 fr-col-md-5 fr-col-lg-4 fr-col-xl-3"
        >
          <DsfrButton
            class="fr-btn-fullwidth fr-btn-sm-fullwidth"
            :label="choices.t('previous')"
            icon="ri-arrow-left-line"
            secondary
            @click="backToPreviousTrack"
          />
        </div>
        <!-- BTN NEXT -->
        <div class="fr-col-6 fr-col-md-5 fr-col-lg-4 fr-col-xl-3">
          <DsfrButton
            class="fr-btn-fullwidth fr-btn-sm-fullwidth"
            :label="choices.t('next')"
            :disabled="!selectedOptions.length"
            icon="ri-arrow-right-line"
            icon-right
            @click="saveSelection"
          />
        </div>
      </div>
    </div>

    <!-- TRACK IMAGE RIGHT IF ANY -->
    <div
      v-if="track?.imageRight"
      class="fr-col-12 fr-col-md-5 fr-col-lg-5 tee-track-image-right"
    >
      <img
        class="fr-responsive-img"
        :src="`${choices.publicPath}${track.imageRight}`"
        :alt="`image / callout`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeTrack > FUNCTION_NAME > MSG_OR_VALUE :`)

import { computed, ref, toRaw, watch } from 'vue'

import { tracksStore } from '@/stores/tracks'
import { choicesStore } from '@/stores/choices'
import { analyticsStore } from '@/stores/analytics'
// import type { DsfrButton } from '@gouvminint/vue-dsfr/types'
import type { ColsOptions, NextTrackRuleSet, Track, TrackOptionsUnion } from '@/types'
import { isTrackOptionsInput, TrackComponents, TrackId } from '@/types'
import { remapItem, scrollToTop } from '@/utils/helpers'
import { CheckNextTrackRules } from '@/utils/conditions'
import TeeTrackInput from './TeeTrackInput.vue'
import TeeTrackSelect from './TeeTrackSelect.vue'
import TeeTrackButtonInput from './TeeTrackButtonInput.vue'
import TeeResults from '../results/TeeResults.vue'

interface Props {
  step: number
  trackId: TrackId
  isCompleted: boolean
  trackElement: Element
  disableWidget?: boolean
  debug?: boolean
}
const props = defineProps<Props>()

const colsOptions: ColsOptions = {
  buttons: 12,
  simpleButtons: 10,
  input: 12,
  select: 12,
  cards: 4,
  form: 8,
  modify: 2,
  results: 10
}
const colsOptionsLarge: ColsOptions = {
  buttons: 12,
  simpleButtons: 8,
  input: 12,
  cards: 6,
  form: 8,
  modify: 2,
  results: 10
}

const trackComponents = TrackComponents

const noNeedForNext = [TrackComponents.Cards, TrackComponents.SimpleButtons]

const tracks = tracksStore()
const choices = choicesStore()
const analytics = analyticsStore()

const selectedOptionsIndices = ref<number[]>([])
const selectedOptions = ref<TrackOptionsUnion[]>([])
const needRemove = ref<boolean>(false)

const track: Track | undefined = tracks.getTrack(props.trackId)

const renderAs: TrackComponents = track?.interface?.component ?? TrackComponents.Buttons
const customColWidth: number | string = track?.interface?.columnWidth ?? 0

const allowMultiple: boolean = !!track?.behavior?.multipleChoices

const optionsArray = track?.options?.filter((o): o is TrackOptionsUnion => !o.disabled) ?? []

// computed
const isTrackResults = computed(() => {
  return track?.interface?.component === TrackComponents.Results
})
const selectionValues = computed(() => {
  if (selectedOptions.value.length === 0) {
    return []
  }
  return selectedOptions.value.map((selectedOption) => selectedOption?.value)
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
  const activeIndex = selectedOptionsIndices.value.includes(index)
  return activeIndex
}

const updateSelection = (option: TrackOptionsUnion, index: number, forceRemove: boolean = false) => {
  const isActive = isActiveChoice(index)
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
    for (const [key, val] of Object.entries(option.value)) {
      analytics.sendEvent(props.trackId, key, val as string | number)
    }
  } else {
    // remove from selection because is already active
    selectedOptionsIndices.value = selectedOptionsIndices.value.filter((i) => i !== index)
    selectedOptions.value = selectedOptions.value.filter((i) => i.value !== option.value)
    remove = !selectedOptions.value.length
  }
  needRemove.value = remove

  // Direct to next track
  const directToNext: string[] = ['cards']
  if (!allowMultiple && directToNext.includes(renderAs)) {
    saveSelection()
  }
}

const updateSelectionFromSignal = (ev: any, index: number) => {
  // TODO (ev.target as HTMLSelectElement)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
  updateSelection(ev.option, index, ev.remove)
}

const updateSelectionValueFromSignal = (ev: any) => {
  // TODO (ev.target as HTMLSelectElement)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const inputField: string = ev.option.inputField as string
  const temp = selectedOptions.value.map((selectedOption) => {
    const obj = { ...selectedOption }
    const objValues = { ...(obj.value as object) } as Record<string, unknown>
    // console.log('TeeTrack > updateSelectionValueFromSignal > objValues :', objValues)

    if (Object.keys(objValues).includes(inputField)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      objValues[inputField] = ev.option.value[inputField] as string | number
    }

    obj.value = objValues
    return obj
  })
  selectedOptions.value = temp
}

const updateSelectionValueFromSelectSignal = (ev: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (ev.reset) {
    selectedOptionsIndices.value = []
    selectedOptions.value = []
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    updateSelection(ev.option, ev.index)
  }
}

const saveSelectionFromSignal = (ev: any, index: number) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  updateAndSave(ev.option as TrackOptionsUnion, index)
}

const updateAndSave = (option: TrackOptionsUnion, index: number) => {
  updateSelection(option, index)
  saveSelection()
}

const resetSelections = () => {
  selectedOptionsIndices.value = []
  selectedOptions.value = []
}

const getButtonIcon = (index: number) => {
  const isActive = isActiveChoice(index)
  let icon = ''
  if (allowMultiple) {
    icon = isActive ? 'ri-checkbox-line' : 'ri-checkbox-blank-line'
  } else {
    icon = isActive ? 'md-radiobuttonchecked' : 'md-radiobuttonunchecked'
  }
  return icon
}

// watchers
watch(
  () => props.isCompleted,
  (next) => {
    if (!next) {
      resetSelections()
      tracks.updateUsedTracks(props.trackId, props.step, next, selectedOptions.value)
    }
  }
)

// functions

const saveSelection = () => {
  const optionNext = selectedOptions.value[0].next
  const nextExceptions = optionNext?.exceptions
  const defaultNext = track?.next

  let next = !optionNext || allowMultiple ? defaultNext : optionNext

  // SWITCH NEXT TRACK DEPENDING ON CONDITIONS
  // NOTE : could be deplaced in store ?
  if (nextExceptions) {
    // get used tracks values
    const trackValues: any[] = tracks.getAllUsedTracksValues

    // get current selection
    const selectionVals = selectedOptions.value.map((item) => {
      return toRaw(item.value)
    })

    nextExceptions.forEach((trackRule: NextTrackRuleSet) => {
      const dataStructure = {}
      const item = remapItem(dataStructure, trackRule.rules, {}, trackValues, {}, {}, selectionVals, choices.lang)
      const bool = CheckNextTrackRules(item, trackRule.rules)
      next = bool ? trackRule.next : next
    })
  }

  tracks.updateUsedTracks(props.trackId, props.step, next, selectedOptions.value)

  if (!needRemove.value && next && next.default !== false) {
    const canAddTrack = !tracks.trackExistsInUsed(next.default)
    canAddTrack && tracks.addToUsedTracks(props.trackId, next.default)
  } else {
    tracks.removeFurtherUsedTracks(props.trackId)
  }

  scrollToTop(props.trackElement, props.disableWidget)
}

const backToPreviousTrack = () => {
  const indexOfTrack = tracks.tracksStepsArray.indexOf(props.trackId)
  const TrackToGoBackTo = tracks.tracksStepsArray[indexOfTrack - 1]
  tracks.setUsedTracksAsNotCompleted(TrackToGoBackTo)
  tracks.removeFurtherUsedTracks(TrackToGoBackTo)

  scrollToTop(props.trackElement, props.disableWidget)
}
</script>
