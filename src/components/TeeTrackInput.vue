<template>
  <!-- DEBUGGING -->
  <div
    class="vue-debug"
    v-if="debug">
    <h5>DEBUG - TeeTrackInput</h5>
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> inputValue : <code>{{ inputValue }} </code></h6>
      </div>
    </div>
  </div>

  <!-- INPUT -->
  <div
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
      :placeholder="option.placeholder[choices.lang]" 
      type="search" 
      :name="`input-${option.id}`"
      v-model="inputValue">
    <button 
      class="fr-btn"
      :title="choices.t('input.search')"
      @click="processInput">
      {{ choices.t('input.search') }}
    </button>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'

import { tracksStore } from '../stores/tracks'
import { choicesStore } from '../stores/choices'

// @ts-ignore
import type { Track, TrackOptionsInput } from '@/types/index'

interface Props {
  trackId: string,
  option: TrackOptionsInput,
  debug?: boolean,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()

const inputValue = ref<string>()

const track: Track | any = tracks.getTrack(props.trackId)

const processInput = (ev: any) => {
  console.log('TeeTrackInput > processInput > track :', track)
  console.log('TeeTrackInput > processInput > ev :', ev)
  console.log('TeeTrackInput > processInput > inputValue.value :', inputValue.value)
}
</script>