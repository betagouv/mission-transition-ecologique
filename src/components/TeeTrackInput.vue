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
  <!-- INPUT -->
  <label 
    class="fr-label fr-mb-2v"
    :for="`input-${option.id}`">
    {{ option.label[choices.lang] }}
  </label>
  <!-- <p>
    inputValue : 
    <code>
      {{ inputValue }}
    </code>
  </p> -->
  <div
    class="fr-search-bar" 
    id="header-search"
    role="search">
    <input 
      :id="`input-${option.id}`"
      :name="`input-${option.id}`"
      :disabled="isLoading"
      :placeholder="option.placeholder[choices.lang]" 
      class="fr-input" 
      type="search" 
      v-model="inputValue"
      @keyup.enter="processInput">
    <button 
      class="fr-btn"
      :disabled="isLoading"
      :title="choices.t('input.search')"
      @click="processInput">
      {{ choices.t('input.search') }}
    </button>
  </div>

  <!-- WILDCARD -->
  <DsfrButton 
    v-if="option.wildcard && !requestResponses.length"
    class="fr-mt-4v fr-hint-text"
    icon="ri-ball-pen-fill"
    tertiary
    no-outline
    @click="goToNextTrack">
    {{ option.wildcard.label[choices.lang] }}
  </DsfrButton>

  <!-- RESPONSE ERRORS -->
  <div
    v-if="requestErrors.length"
    class="fr-mt-4v">
    <div 
      v-for="(err, i) in requestErrors"
      :key="`resp-error-${i}`"
      class="fr-alert fr-alert--warning">
      <p>
        <b>
          <span class="fr-mr-2v">
            {{ choices.t('errors.error') }} {{ err.status }}
          </span>
        </b>
        <code>
          {{ err.statusText }}
        </code>
      </p>
    </div>
  </div>

  <!-- RESPONSES -->
  <div
    v-if="requestResponses.length"
    class="fr-mt-4v">
    <h6
      v-show="!hasSelection && requestResponses.length > 1">
      {{ choices.t('enterprise.select') }}
    </h6>
    <!-- CARDS -->
    <div
      v-for="(resp, i) in requestResponses"
      :key="`resp-input-${i}`"
      class="fr-card fr-enlarge-link"
      @click="selectItem(resp)">
      <div class="fr-card__body">
        <div class="fr-card__content fr-py-4v fr-px-4v">
          
          <!-- TITLE -->
          <template 
            v-for="(resMap, idx) in resp.resultsMapping"
            :key="`resp-input-${i}-field-title-${idx}`">
            <h3 
              v-if="resMap.position === 'title'"
              :class="`fr-card__title ${resMap.class || 'fr-mb-2v'}`">
              <!-- IF SELECTED -->
              <!-- <span 
                v-if="hasSelection"
                class="fr-icon-success-fill fr-mr-6v" 
                aria-hidden="true">
              </span> -->
              <span>
                {{ getFromField(resp, resMap) }}
              </span>
              <DsfrBadge 
                v-if="hasSelection"
                class="fr-ml-4v"
                type="success"
                :label="choices.t('selection.selected')"/>
            </h3>
          </template>
          
          <div class="fr-card__desc">
            <p 
              v-for="(resMap, idx) in resp.resultsMapping?.filter(i => i.position !== 'title')"
              :key="`resp-input-${i}-field-${idx}`"
              :class="resMap.class || 'fr-mb-2v'">
              <!-- ICON -->
              <span
                v-if="resMap.icon"
                :class="`${resMap.icon} fr-mr-6v`" 
                aria-hidden="true">
              </span>
              <!-- TITLE -->
              <span
                v-if="resMap.label">
                {{ resMap.label }} :
              </span>
              <span
                :style="resMap.style">
                {{ getFromField(resp, resMap) }}
              </span>
            </p>
          </div>
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
  
  <!-- PostInput -->
  <template
    v-if="option.postResponses">
    <p 
      v-if="requestErrors.length || (requestResponses.length && !hasSelection)"
      class="fr-mt-3v fr-hint-text"
      v-html="option.postResponses[choices.lang]">
    </p>
  </template>

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

import { onBeforeMount, ref, toRaw, watch } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'
import { analyticsStore } from '../stores/analytics'

// @ts-ignore
import type { TrackOptionsInput, UsedTrack, ReqResp, ReqError, FormCallback, ResultsMapping } from '@/types/index'

import { sendApiRequest } from '../utils/requests'
import { getFrom, remapItem } from '../utils/helpers'

interface Props {
  trackId: string,
  option: TrackOptionsInput,
  debug?: boolean,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()
const analytics = analyticsStore()

const inputValue = ref<string | number>()
const isLoading = ref<boolean>(false)

const requestResponses = ref<ReqResp[]>([])
const requestErrors = ref<ReqError[]>([])

const selection = ref<any>()
const hasSelection = ref<boolean>(false)

const emit = defineEmits(['updateSelection', 'goToNextTrack'])

// const track: Track | any = tracks.getTrack(props.trackId)

onBeforeMount(() => {
  if (props.option.defaultInput) {
    inputValue.value = props.option.defaultInput
  }
})

// computed
// const hasSelection = computed(() => {
//   return Boolean(selection.value)
// })

// watchers
watch(() => inputValue.value, (next) => {
  console.log('TeeTrackInput > syncValue > next :', next)
  // hasSelection.value = true
  // selectItem(undefined)
})

// getters
const getFromField = (resp: any, resMap: ResultsMapping) => {
  const val = getFrom(resp, resMap.respFields).join( resMap.sep || ' ')
  return val
} 

// functions
const resetSelection = () => {
  // console.log('TeeTrackInput > resetSelection > ...')
  requestResponses.value = []
  requestErrors.value = []
  selection.value = undefined
  hasSelection.value = false
}

const processInput = async (ev: any) => {
  console.log('TeeTrackInput > processInput > ev :', ev)
  // console.log('TeeTrackInput > processInput > track :', track)
  // console.log('TeeTrackInput > processInput > props.option :', props.option)
  
  isLoading.value = true
  resetSelection()

  const usedTracks: UsedTrack[] | any[] = tracks.getAllUsedTracks

  const responses: ReqResp[] = []
  const errors: ReqError[] = []
  const activeCallbacks = toRaw(props.option.callbacks).filter((cb: FormCallback) => !cb.disabled)

  // loop option's callbacks
  for (const callback of activeCallbacks) {
    console.log()
    // console.log('TeeTrackInput > processInput >  callback :', callback)
    let value = inputValue.value
    // Clean input value
    if (callback.inputCleaning) {
      callback.inputCleaning.forEach((cleaner: any) => {
        // console.log('TeeTrackInput > processInput >  cleaner :', cleaner)
        switch (cleaner.operation) {
          case 'replaceAll':
            var re = new RegExp(cleaner.stringToReplace, 'g')
            value = String(value).replace(re, cleaner.replaceBy)
            break 
        }
      })
    }
    // console.log('TeeTrackInput > processInput > value :', value)
    let resp: ReqResp = {}
    switch (callback.action) {
      case 'getSiretInfos':
        resp = await sendApiRequest(callback, {inputValue: value}, usedTracks, props)
        break
    }
    console.log('TeeTrackInput > processInput >  resp :', resp)
    if (resp.ok) {
      let item = remapItem(callback.dataStructure, callback.dataMapping, {inputValue: value}, usedTracks, props, resp)
      console.log('TeeTrackInput > processInput >  item :', item)
      responses.push({
        data: item,
        raw: resp,
        resultsMapping: callback.resultsMapping
      })
    } else {
      errors.push(resp)
    }
  }
  requestResponses.value = responses
  requestErrors.value = errors
  isLoading.value = false

  // analytics / send event
  analytics.sendEvent(props.trackId, 'processInput')

  // if only one result select it immediatly
  if (requestResponses.value.length === 1) {
    const item = requestResponses.value[0]
    selectItem(item)
  }

  // send signal to parent if error
  if (requestErrors.value.length) {
    const data = {
      option: {
        ...props.option,
        value: selection.value
      },
      remove: true
    }
    emit('updateSelection', data)
  } 
}

const goToNextTrack = () => {
  console.log
  const data = {
    option: { ...props.option },
  }
  data.option.next = props.option.wildcard.next
  console.log('TeeTrackInput > goToNextTrack > data :', data)
  emit('goToNextTrack', data)
}

const selectItem = (item: any) => {
  console.log()
  console.log('TeeTrackInput > selectItem > hasSelection.value (A) :', hasSelection.value)
  
  console.log('TeeTrackInput > selectItem > item :', item)

  selection.value = hasSelection.value ? undefined : item
  console.log('TeeTrackInput > selectItem > hasSelection.value (B) :', hasSelection.value)
  
  hasSelection.value = !hasSelection.value
  console.log('TeeTrackInput > selectItem > selection.value (C) :', selection.value)
  const data = {
    option: {
      ...props.option,
      value: item.data
    },
    remove: !hasSelection.value
  }
  // console.log('TeeTrackInput > selectItem > data :', data)
  emit('updateSelection', data)
}
</script>