<template>
  <div
    v-if="track"
    :id="usedTrack.id"
    :key="`track-${usedTrack.step}-${usedTrack.id}`"
    class="fr-grid-row"
  >
    <TrackCallout :track="track" />
    <div
      v-if="track.theme"
      class="fr-col-12 fr-px-0v"
    >
      <ThemeHeaderCard :theme="track.theme" />
    </div>

    <div class="fr-col">
      <div class="fr-grid-row">
        <TrackLabel
          v-if="track.label"
          :track="track"
        />
        <TrackInfo :track="track" />
        <TrackHint :track="track" />
        <TrackResume :track="track" />

        <!-- TRACK Translation {{ renderAs }} / EXCEPT SELECT-->
        <template v-if="!TrackComponent.isSelect(usedTrack) && !TrackComponent.isThemeInterface(usedTrack)">
          <div
            v-for="(option, idx) in trackStore.currentOptions"
            :key="`track-${usedTrack.step}-${usedTrack.id}-option-${idx}`"
            :class="`${currentColumnWidth()} tee-track-choice`"
          >
            <TrackRadioButtonRich
              v-if="TrackComponent.isButtons(usedTrack)"
              :is-active="isActiveChoice(idx)"
              :index="idx"
              :option="option as TrackOptionsInput"
              @update-selection="updateSelection(option, idx)"
            />

            <TrackCard
              v-if="TrackComponent.isCards(usedTrack)"
              :option="option"
              :is-active="isActiveChoice(idx)"
              @click="updateSelection(option, idx)"
            />

            <TrackSimpleButton
              v-if="TrackComponent.isSimpleButtons(usedTrack)"
              :option="option"
              @click="updateAndSave(option, idx)"
            />
            <TrackActivity
              v-if="TrackComponent.isNAFSearch(usedTrack, option)"
              :option="option as TrackOptionsInput"
              @update-selection="updateSelection($event.option, idx, $event.remove, $event.forceKeep)"
            />
            <TrackLocalisation
              v-if="TrackComponent.isLocalisation(usedTrack)"
              :option="option as TrackOptionsInput"
              @update-selection="updateSelection($event.option, idx, $event.remove, $event.forceKeep)"
            />
            <TrackSiret
              v-if="TrackComponent.isSiret(usedTrack, option)"
              :option="option as TrackOptionsInput"
              @update-selection="updateSelection($event.option, idx, $event.remove, $event.forceKeep)"
              @go-to-next-track="updateAndSave($event, idx)"
            />
          </div>
        </template>

        <TrackSelect
          v-if="TrackComponent.isSelect(usedTrack)"
          class="fr-col-12 fr-col-md-10 fr-col-lg-8"
          @update-selection="updateSelection($event.option, $event.index, $event.remove)"
        />

        <LazyTrackThemeCards
          v-if="TrackComponent.isThemeInterface(usedTrack)"
          @update-selection="updateAndSave($event.option, $event.index, $event.remove)"
        />
      </div>

      <div
        class="fr-grid-row fr-grid-row--gutters fr-pt-8v fr-px-md-0v"
        style="justify-content: start"
      >
        <!-- BTN PREVIOUS -->
        <TrackSubmitButton
          :selected-options="selectedOptions"
          :show-next-button="!TrackComponent.isThemeInterface(usedTrack)"
          @previous="backToPreviousTrack"
          @next="saveSelection"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TrackContent > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useNavigationStore } from '@/stores/navigation'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import {
  type Track,
  TrackComponent as TrackComponentType,
  TrackId,
  type TrackOptionsInput,
  type TrackOptionsUnion,
  type UsedTrack
} from '@/types'
import { RouteName } from '@/types/routeType'
import Navigation from '@/tools/navigation'
import { Scroll } from '@/tools/scroll/scroll'
import TrackColOption from '@/tools/questionnaire/track/TrackColOption'
import TrackComponent from '@/tools/questionnaire/track/TrackComponent'

interface Props {
  trackElement: Element
}
const props = defineProps<Props>()

const router = useRouter()

const trackStore = useTrackStore()
const usedTrackStore = useUsedTrackStore()
const navigationStore = useNavigationStore()

const selectedOptionsIndexes = ref<number[]>([])
const selectedOptions = ref<TrackOptionsUnion[]>([])

const usedTrack = usedTrackStore.current as UsedTrack
const track: Track | undefined = trackStore.getTrack(usedTrack.id)
const allowMultiple: boolean = !!track?.behavior?.multipleChoices

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
  return selectedOptionsIndexes.value.includes(index)
}

const updateSelection = async (option: TrackOptionsUnion, index: number, forceRemove: boolean = false, forceKeep = false) => {
  const isActive = isActiveChoice(index)
  let remove = false
  if ((!isActive && !forceRemove) || forceKeep) {
    selectedOptionsIndexes.value = allowMultiple ? [...selectedOptionsIndexes.value, index] : [index]
    selectedOptions.value = allowMultiple ? [...selectedOptions.value, option] : [option]
  } else {
    // remove from selection because is already active
    selectedOptionsIndexes.value = allowMultiple
      ? selectedOptionsIndexes.value.filter((selectedOptionIndex) => selectedOptionIndex !== index)
      : []
    selectedOptions.value = allowMultiple ? selectedOptions.value.filter((selectedOption) => selectedOption.value !== option.value) : []
    remove = !selectedOptions.value.length
  }

  // Direct to next track
  const directToNext: string[] = [TrackComponentType.Cards, TrackComponentType.CitySearch, TrackComponentType.Activity]
  if (!allowMultiple && directToNext.includes(trackStore.currentComponent)) {
    await saveSelection(remove)
  }
}

const updateAndSave = async (option: TrackOptionsUnion, index: number, needRemove = false) => {
  await updateSelection(option, index)
  await saveSelection(needRemove)
}

const saveSelection = async (needRemove = false) => {
  usedTrackStore.updateCurrent(selectedOptions.value)
  const next = usedTrackStore.current?.next
  if (!needRemove && next && next.default !== false) {
    if (next.default === TrackId.Results) {
      return await router.push({
        name: RouteName.QuestionnaireResult,
        hash: Navigation.hashByRouteName(RouteName.QuestionnaireResult),
        query: navigationStore.query
      })
    }

    const canAddTrack = !usedTrackStore.hasUsedTrack(next.default)
    canAddTrack && usedTrackStore.add(usedTrack.id, next.default)
    return await router.push({
      name: RouteName.Questionnaire,
      hash: Navigation.hashByRouteName(RouteName.Questionnaire),
      params: { trackId: next.default },
      query: navigationStore.query
    })
  } else {
    usedTrackStore.removeFurtherUsedTracks(usedTrack.id)
  }

  Scroll.to(props.trackElement, false)
}

const backToPreviousTrack = async () => {
  const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
  usedTrackStore.setCurrentToUncompleted()
  if (trackId) {
    usedTrackStore.removeFurtherUsedTracks(trackId)

    return await router.push(navigationStore.routeByTrackId(trackId))
  }
  return await router.push({
    name: RouteName.Homepage
  })
}
</script>
