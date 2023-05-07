<template>
  <div 
    id="tee-app-ce"
    class="fr-container">

    <!-- HEADER -->
    <p 
      v-if="showHeaderBool"
      class="fr-pb-5v">
      <DsfrHeader
        logo-text="ADEME"
        service-title="Transition écologique des entreprises"
        service-description="Vos aides en quelques clics"
      />
    </p>

    <!-- MESSAGE -->
    <div class="fr-grid-row fr-grid-row-gutters">
      <div class="fr-col-9">
        <h3
          v-if="message"
          class="red-color">
          <span v-html="message[choices.lang]"/>
        </h3>
      </div>
      <div
        v-if="debugSwitchBool" 
        class="fr-col-3">
        <DsfrToggleSwitch 
          label="Debug mode" 
          hint="Switch to activate / deactivate debugging mode"
          :modelValue="debugBool"
          @update:modelValue="changeDebug"
          />
      </div>
    </div>

    <!-- STEPPER -->
    <p>
      <Stepper
        :steps-array="tracks.tracksStepsArray"
        :current-step="tracks.currentStep"
        :debug="debugBool"
      />
    </p>

    <!-- TRACKS INTERFACES -->
    <div class="fr-grid-row fr-grid-row-gutters">

      <div
        v-if="debugBool"
        class="fr-col-3">
        <h5>DEBUG - TeeApp</h5>
        <div class="fr-grid-row fr-grid-row--gutters">
          <div class="fr-col-12">
            <h6 class="fr-mb-1v"> seed : <code>{{ seed }} </code></h6>
            <h6 class="fr-mb-1v"> debug : <code>{{ debug }} </code></h6>
            <h6 class="fr-mb-1v"> debugBool : <code>{{ debugBool }} </code></h6>
            <h6 class="fr-mb-1v"> showHeader : <code>{{ showHeader }} </code></h6>
            <h6 class="fr-mb-1v"> choices.lang : <code>{{ choices.lang }} </code></h6>
            <h6 class="fr-mb-1v"> tracks.maxDepth : <code>{{ tracks.maxDepth }} </code></h6>
            <h6 class="fr-mb-1v"> tracks.seedTrack : <code>{{ tracks.seedTrack }} </code></h6>
          </div>
          
          <div class="fr-col-12">
            <h6 class="fr-mb-1v"> tracks.currentStep : <code>{{ tracks.currentStep }} </code></h6>
            <h6>
              tracks.tracksStepsArray :
            </h6>
            <code><pre>{{ tracks.tracksStepsArray  }}</pre></code>
          </div>

          <div class="fr-col-12">
            <h6>
              tracks.usedTracks :
            </h6>
            <code><pre>{{ tracks.usedTracks  }}</pre></code>
          </div>
    
          <!-- <h4>
            TeeApp debug / programs :
          </h4>
          <code><pre>{{ programsArray  }}</pre></code> -->
        </div>
      </div>

      <div
        v-if="!debugBool"
        class="fr-col-3">
      </div>

      <div class="fr-col-9">
        <p
          v-for="(track, index) in tracks.usedTracks"
          :key="track.id"
          :class="`fr-py-0 fr-mb-${ debugBool ? '12v' : '0'}`">
          <RadioChoices
            :step="index + 1"
            :track-id="track.id"
            :debug="debugBool"
          />
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// cf : https://stackoverflow.com/questions/71163741/vuejs-script-setup-cannot-contain-es-module-exports

import { ref, reactive, onBeforeMount } from 'vue'

import { tracksStore } from './stores/tracks'
import { choicesStore } from './stores/choices'
import { programsStore } from './stores/programs'

// @ts-ignore
import RadioChoices from './components/RadioChoices.vue'
// @ts-ignore
import Stepper from './components/Stepper.vue'

interface Props {
  showHeader: string,
  locale?: string,
  msg?: string,
  seed: string,
  dataset: string,
  maxDepth?: string
  debugSwitch?: string,
  debug?: string,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()
const programsArray = programsStore()

let message = ref()
let debugSwitchBool = ref(false)
let debugBool = ref(false)
let showHeaderBool = ref(false)

// @ts-ignore
window.stores = { tracks, choicesStore, programsArray }

const changeDebug = (ev: any) => {
  debugBool.value = ev
}

onBeforeMount(() => {
  // console.log('TeeApp > props.seed :', props.seed)
  // console.log('TeeApp > props.maxDepth :', props.maxDepth)

  // set header
  showHeaderBool.value = props.showHeader === 'true'

  // set locale and message
  const locale = props.locale || 'fr'
  choices.setLocale(locale)
  const messageObj = {}
  if (props.msg) {
    props.msg.split(',').forEach((s: string) => {
      const strObj = s.split('|').map((i: string) => i.trim())
      // @ts-ignore
      messageObj[strObj[0]] = strObj[1]
    })
    // console.log('TeeApp > messageObj :', messageObj)
    message.value = messageObj
  }

  // set max depth at mount
  if (props.maxDepth) {
    const maxDepthNum = Number(props.maxDepth)
    tracks.setMaxDepth(maxDepthNum)
  }

  // set debug mode
  debugSwitchBool.value = props.debugSwitch === 'true'
  if (debugSwitchBool.value && props.debug) {
    debugBool.value = props.debug === 'true'
  }

  // set first track at mount
  tracks.setSeedTrack(props.seed)
  tracks.addToUsedTracks(props.seed, props.seed)
})

</script>

<style>
  code {
    color: red !important;
  }
</style>

<style lang="scss">
  @import '~@gouvfr/dsfr/dist/core/core.main.min.css';
  @import '~@gouvfr/dsfr/dist/component/component.main.min.css';
  @import '~@gouvfr/dsfr/dist/utility/utility.main.min.css';
  @import '~@gouvfr/dsfr/dist/scheme/scheme.min.css';
  @import '~@gouvfr/dsfr/dist/utility/icons/icons.min.css';
  @import '~@gouvminint/vue-dsfr/dist/vue-dsfr.css';
</style>
