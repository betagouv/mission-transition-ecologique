<template>
  <!-- DEBUGGING -->
  <div
    v-if="debugStore.is"
    class="vue-debug"
  >
    <h5>DEBUG - TeeTrack</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v">
          step : <code>{{ usedTrack.step }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          trackId : <code>{{ usedTrack.id }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          isCompleted : <code>{{ usedTrack.completed }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          needRemove : <code>{{ needRemove }} </code>
        </h6>
      </div>
      <div class="fr-col-4">
        <h6 class="fr-mb-1v">
          renderAs : <code>{{ trackStore.currentComponent }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          allowMultiple : <code>{{ allowMultiple }} </code>
        </h6>
        <h6 class="fr-mb-1v">
          colsWidth : <code>{{ currentColumnWidth() }} </code>
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
          <pre>{{ trackStore.currentOptions.map((o) => o.value) }}</pre>
        </code>
      </div>
    </div>
  </div>

  <div
    :id="usedTrack.id"
    :key="`track-${usedTrack.step}-${usedTrack.id}`"
    class="fr-grid-row"
  >
    <TrackCallout :track="track" />

    <div class="fr-col">
      <div :class="`fr-px-4v fr-px-md-0v fr-grid-row fr-grid-row--gutters ${track?.bgColor ? 'fr-p-5v fr-p-sm-8v fr-p-md-20v' : ''}`">
        <TrackLabel :track="track" />
        <TrackInfo :track="track" />
        <TrackHint :track="track" />
        <TrackResume :track="track" />

        <!-- TRACK Translation {{ renderAs }} / EXCEPT SELECT-->
        <template v-if="usedTrack.component !== TrackComponent.Select">
          <div
            v-for="(option, idx) in trackStore.currentOptions"
            :key="`track-${usedTrack.step}-${usedTrack.id}-option-${idx}`"
            :class="`${currentColumnWidth()} tee-track-choice`"
          >
            <TrackCard
              v-if="usedTrack.component === TrackComponent.Cards"
              :option="option"
              :is-active="isActiveChoice(idx)"
              @click="updateSelection(option, idx)"
            />

            <TrackButton
              v-if="usedTrack.component === TrackComponent.Buttons && !isTrackOptionsInput(option)"
              :option="option"
              :is-active="isActiveChoice(idx)"
              :is-checkbox="allowMultiple"
              @click="updateSelection(option, idx)"
            />

            <TrackButtonInput
              v-if="usedTrack.component === TrackComponent.Buttons && isTrackOptionsInput(option)"
              :is-active="isActiveChoice(idx)"
              :is-checkbox="allowMultiple"
              :option="option"
              @update-selection="updateSelection($event.option, idx, $event.remove)"
              @update-value="updateSelectionValueFromButtonInput($event)"
            />

            <TrackSimpleButton
              v-if="usedTrack.component === TrackComponent.SimpleButtons"
              :option="option"
              @click="updateAndSave(option, idx)"
            />

            <TrackInput
              v-if="usedTrack.component === TrackComponent.Input && isTrackOptionsInput(option)"
              :track-id="usedTrack.id"
              :option="option"
              @update-selection="updateSelection($event.option, idx, $event.remove)"
              @go-to-next-track="updateAndSave($event, idx)"
            />
          </div>
        </template>
      </div>

      <div
        v-if="track && usedTrack.component === TrackComponent.Select"
        class="fr-px-4v fr-px-md-0v fr-grid-row fr-grid-row--gutters"
      >
        <TrackSelect
          :track="track"
          class="fr-px-2v fr-px-md-3v fr-mt-6v fr-col-12"
          @update-selection="updateSelectionValueFromSelect($event)"
        />
      </div>

      <div
        v-if="hasSubmitButton"
        class="fr-grid-row fr-grid-row--gutters fr-pt-8v fr-px-4v fr-px-md-0v"
        style="justify-content: start"
      >
        <!-- BTN PREVIOUS -->
        <TrackSubmitButton
          :selected-options="selectedOptions"
          @previous="backToPreviousTrack"
          @next="saveSelection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeTrack > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useDebugStore } from '@/stores/debug'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import {
  isTrackOptionsInput,
  type NextTrackRuleSet,
  type Track,
  TrackComponent,
  TrackId,
  type TrackOptionsUnion,
  type UsedTrack
} from '@/types'
import { RouteName } from '@/types/routeType'
import { CheckNextTrackRules } from '@/utils/conditions'
import { remapItem, scrollToTop } from '@/utils/helpers'
import Matomo from '@/utils/matomo'
import Navigation from '@/utils/navigation'
import TrackColOption from '@/utils/track/TrackColOption'
import Translation from '@/utils/translation'
import { computed, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import TrackButtonInput from './form/TrackButtonInput.vue'
import TrackInput from './form/TrackInput.vue'
import TrackSelect from './form/TrackSelect.vue'

interface Props {
  trackElement: Element
}
const props = defineProps<Props>()

const router = useRouter()
const trackStore = useTrackStore()
const debugStore = useDebugStore()
const usedTrackStore = useUsedTrackStore()

const selectedOptionsIndices = ref<number[]>([])
const selectedOptions = ref<TrackOptionsUnion[]>([])
const needRemove = ref<boolean>(false)

const usedTrack = usedTrackStore.current as UsedTrack
const track: Track | undefined = trackStore.getTrack(usedTrack.id)
trackStore.setCurrentTrack(track)

const allowMultiple: boolean = !!track?.behavior?.multipleChoices

const selectionValues = computed(() => {
  if (selectedOptions.value.length === 0) {
    return []
  }
  return selectedOptions.value.map((selectedOption) => selectedOption?.value)
})

const hasSubmitButton = computed(() => {
  return !usedTrackStore.currentIsFirst
})

const currentColumnWidth = () => {
  let divSize: string | number = TrackColOption.default[trackStore.currentComponent]
  let divSizeLarge: string | number = TrackColOption.large[trackStore.currentComponent]
  const columnWidthValue = trackStore.currentColumnWidth
  if (columnWidthValue === 'auto') {
    const rawDiv = Math.round(12 / trackStore.currentOptions.length)
    divSize = rawDiv < 2 ? 3 : rawDiv >= 12 ? divSize : rawDiv
  } else if (columnWidthValue !== 0) {
    divSizeLarge = divSize = columnWidthValue
  }

  return `fr-col-xl-${divSizeLarge} fr-col-lg-${divSize} fr-col-md-${divSize} fr-col-sm-12 fr-col-xs-12`
}

// getters
const isActiveChoice = (index: number) => {
  return selectedOptionsIndices.value.includes(index)
}

const updateSelection = async (option: TrackOptionsUnion, index: number, forceRemove: boolean = false) => {
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
      Matomo.sendEvent(usedTrack.id, key, val as string | number)
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
  if (!allowMultiple && directToNext.includes(trackStore.currentComponent)) {
    await saveSelection()
  }
}

const updateSelectionValueFromButtonInput = (ev: any) => {
  // TODO (ev.target as HTMLSelectElement)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const inputField: string = ev.option.inputField as string
  selectedOptions.value = selectedOptions.value.map((selectedOption) => {
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
}

const updateSelectionValueFromSelect = async (ev: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (ev.reset) {
    selectedOptionsIndices.value = []
    selectedOptions.value = []
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument
    await updateSelection(ev.option, ev.index)
  }
}

const updateAndSave = async (option: TrackOptionsUnion, index: number) => {
  await updateSelection(option, index)
  await saveSelection()
}

const saveSelection = async () => {
  const optionNext = selectedOptions.value[0].next
  const nextTrackRulesSet = optionNext?.ruleSet
  const defaultNext = track?.next

  let next = !optionNext || allowMultiple ? defaultNext : optionNext

  // SWITCH NEXT TRACK DEPENDING ON CONDITIONS
  // NOTE : could be deplaced in store ?
  if (nextTrackRulesSet) {
    // get used tracks values
    const trackValues = usedTrackStore.completedUsedTracksValues

    // get current selection
    const selectionVals = selectedOptions.value.map((item) => {
      return toRaw(item.value)
    })

    nextTrackRulesSet.forEach((trackRule: NextTrackRuleSet) => {
      const dataStructure = {}
      const item = remapItem(dataStructure, trackRule.rules, {}, trackValues, {}, {}, selectionVals, Translation.lang)
      const bool = CheckNextTrackRules(item, trackRule.rules)
      next = bool ? trackRule.next : next
    })
  }

  usedTrackStore.updateCurrent(selectedOptions.value, next)

  if (!needRemove.value && next && next.default !== false) {
    if (next.default === TrackId.Results) {
      return await router.push({ name: RouteName.QuestionnaireResult, hash: Navigation.hashByRouteName(RouteName.QuestionnaireResult) })
    }
    const canAddTrack = !usedTrackStore.hasUsedTrack(next.default)
    canAddTrack && usedTrackStore.add(usedTrack.id, next.default)
    return await router.push({
      name: RouteName.Questionnaire,
      hash: Navigation.hashByRouteName(RouteName.Questionnaire),
      params: { trackId: next.default }
    })
  } else {
    usedTrackStore.removeFurtherUsedTracks(usedTrack.id)
  }

  scrollToTop(props.trackElement)
}

const backToPreviousTrack = async () => {
  const indexOfTrack = usedTrackStore.usedTracksIds.indexOf(usedTrack.id)
  const trackId = usedTrackStore.usedTracksIds[indexOfTrack - 1]
  usedTrackStore.setCurrentToUncompleted()
  usedTrackStore.removeFurtherUsedTracks(trackId)

  return await router.push({
    name: RouteName.Questionnaire,
    hash: Navigation.hashByRouteName(RouteName.Questionnaire),
    params: { trackId: trackId }
  })
}
</script>
