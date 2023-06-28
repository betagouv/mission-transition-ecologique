<template>
  <!-- DEBUGGING -->
  <div
    class="vue-debug"
    v-if="debug">
    <h5>DEBUG - TeeTrackInput</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> inputValue : <code>{{ inputValue }} </code></h6>
        <h6 class="fr-mb-1v"> hasSelection : <code>{{ hasSelection }} </code></h6>
        <!-- <h6 class="fr-mb-1v"> selection : <code>{{ selection }} </code></h6> -->
      </div>
      <div class="fr-col-9">
        <h6 class="fr-mb-1v"> option :</h6>
        <pre><code>{{ option }} </code></pre>
      </div>
    </div>
  </div>

  <!-- PostInput -->
  <p 
    v-if="option.postInput && !hasSelection"
    class="fr-mb-4v fr-hint-text"
    v-html="option.postInput[choices.lang]">
  </p>

  <!-- INPUT -->
  <div
    v-show="!hasSelection"
    class="fr-search-bar" 
    id="header-search"
    role="search">
    <label 
      class="fr-label" 
      :for="`input-${option.id}`">
      {{ choices.t('input.research') }}
    </label>
    <input 
      :id="`input-${option.id}`"
      class="fr-input" 
      :disabled="isLoading"
      :placeholder="option.placeholder[choices.lang]" 
      type="search" 
      :name="`input-${option.id}`"
      v-model="inputValue">
    <button 
      class="fr-btn"
      :disabled="isLoading"
      :title="choices.t('input.search')"
      @click="processInput">
      {{ choices.t('input.search') }}
    </button>
  </div>

  <DsfrButton 
    v-if="option.wildcard && !hasSelection"
    class="fr-mt-4v fr-hint-text"
    icon="ri-ball-pen-fill"
    tertiary
    no-outline
    @click="goToNextTrack">
    {{ option.wildcard.label[choices.lang] }}
  </DsfrButton>

  <!-- RESPONSE -->
  <div
    v-if="requestResponses.length"
    class="fr-mt-12v">
    <h6
      v-show="!hasSelection">
      {{ choices.t('enterprise.select') }}
    </h6>
    <!-- <hr> -->
    <!-- CARDS -->
    <div
      v-for="(resp, i) in requestResponses"
      :key="`resp-input-${i}`"
      class="fr-card fr-enlarge-link"
      @click="selectItem(resp)">
      <div class="fr-card__body">
        <div class="fr-card__content fr-py-4v fr-px-4v">
          <DsfrBadge 
            v-if="hasSelection"
            class="fr-mb-6v"
            type="success"
            :label="choices.t('selection.selected')"/>
          <p 
            v-for="(resultField, idx) in resp.resultsMapping"
            :key="`resp-input-${i}-field-${idx}`"
            :class="resultField.class || 'fr-mb-2v'">
            <!-- ICON -->
            <span
              v-if="resultField.icon"
              :class="`${resultField.icon} fr-mr-6v`" 
              aria-hidden="true">
            </span>
            <!-- TITLE -->
            <span
              v-if="resultField.label">
              {{ resultField.label }} :
            </span>
            <span
              :style="resultField.style">
              {{ getFrom(resp, resultField.respFields).join( resultField.sep || ' ') }}
            </span>
          </p>
        </div>
      </div>

      <!-- DEBUGGING -->
      <div
        class="vue-debug"
        v-if="debug">
        <h5>DEBUG - TeeTrackInput</h5>
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
          <div class="fr-col-6">
            <h6 class="fr-mb-1v"> resp.data :</h6>
            <code><pre>{{ resp.data }}</pre></code>
          </div>
          <div class="fr-col-6">
            <h6 class="fr-mb-1v"> resp.resultsMapping :</h6>
            <code>
              <pre>{{ resp.resultsMapping }}</pre>
            </code>
          </div>
        </div>
      </div>
    
    </div>
  </div>

  <!-- DEBUGGING -->
  <div
    class="vue-debug"
    v-if="debug && selection">
    <h5>DEBUG - TeeTrackInput</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-6">
        <h6 class="fr-mb-1v"> selection :</h6>
        <code><pre>{{ selection }}</pre></code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, toRaw } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
// import { analyticsStore } from '../stores/analytics'

// @ts-ignore
import type { Track, TrackOptionsInput, UsedTrack, ReqResp, FormCallback } from '@/types/index'

import { sendApiRequest } from '../utils/requests'
import { getFrom  } from '../utils/helpers'

interface Props {
  trackId: string,
  option: TrackOptionsInput,
  debug?: boolean,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()
// const analytics = analyticsStore()

const inputValue = ref<string>('83014132100034')
const isLoading = ref<boolean>(false)
const requestResponses = ref<ReqResp[]>([])
const selection = ref<any>()
const hasSelection = ref<boolean>(false)

const emit = defineEmits(['updateSelection', 'goToNextTrack'])

const track: Track | any = tracks.getTrack(props.trackId)

// computed
// const hasSelection = computed(() => {
//   return Boolean(selection.value)
// })

// functions
const processInput = async (ev: any) => {
  console.log('TeeTrackInput > processInput > track :', track)
  console.log('TeeTrackInput > processInput > ev :', ev)
  console.log('TeeTrackInput > processInput > props.option :', props.option)
  console.log('TeeTrackInput > processInput > inputValue.value :', inputValue.value)
  
  requestResponses.value = []
  selection.value = undefined

  const usedTracks: UsedTrack[] | any[] = tracks.getAllUsedTracks

  const responses: ReqResp[] = []
  const activeCallbacks = toRaw(props.option.callbacks).filter((cb: FormCallback) => !cb.disabled)

  isLoading.value = true

  for (const callback of activeCallbacks) {
    console.log()
    console.log('TeeTrackInput > processInput >  callback.action :', callback.action)
    let resp: ReqResp = {}
    switch (callback.action) {
      case 'getSiretInfos':
        resp = await sendApiRequest(callback, {inputValue: inputValue.value}, usedTracks, {})
        break
    }
    responses.push({
      data: resp,
      resultsMapping: callback.resultsMapping
    })
    console.log('TeeTrackInput > processInput >  resp :', resp)
  }
  requestResponses.value = responses
  // formIsSent.value = true
  isLoading.value = false

  // analytics / send event
  // analytics.sendEvent(props.trackId, 'input')

}

const goToNextTrack = () => {
  console.log
  const wildcard = props.option.wildcard
  console.log('TeeTrackInput > goToNextTrack > wildcard :', wildcard)
  emit('goToNextTrack', wildcard)
}

const selectItem = (item: any) => {
  console.log()
  console.log('TeeTrackInput > selectItem > hasSelection.value (A) :', hasSelection.value)
  hasSelection.value = !hasSelection.value
  console.log('TeeTrackInput > selectItem > item :', item)
  selection.value = hasSelection.value ? undefined : item
  console.log('TeeTrackInput > selectItem > hasSelection.value (B) :', hasSelection.value)
  console.log('TeeTrackInput > selectItem > selection.value (C) :', selection.value)
  const data = {
    option: {...props.option},
    remove: !hasSelection.value
  }
  data.option.value = item
  console.log('TeeTrackInput > selectItem > data :', data)
  emit('updateSelection', data)
}
</script>