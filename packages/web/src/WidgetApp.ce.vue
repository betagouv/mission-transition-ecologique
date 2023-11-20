<template>
  <div
    :ref="disableWidget ? 'widget' : 'trackElement'"
    class="fr-container--fluid">

    <!-- HEADER -->
    <p
      v-if="showHeaderBool && !disableWidget"
      class="fr-pb-0v fr-mb-0">
      <DsfrHeader
        logo-text="ADEME"
        service-title="Transition écologique des entreprises"
        service-description="Faire rimer écologie avec économies !"
      />
    </p>

    <!-- DEBUGGING -->
    <div
      class="vue-debug"
      v-if="debugBool">
      <h5>DEBUG - WidgetApp</h5>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-3v">
        <div class="fr-col-4">
          <h6 class="fr-mb-1v"> tracks.currentStep : <code>{{ tracks.currentStep }} </code></h6>
          <h6 class="fr-mb-1v"> seed : <code>{{ seed }} </code></h6>

        </div>
        <div class="fr-col-4">
          <h6 class="fr-mb-1v"> programs.programDetail : <code>{{ programs.programDetail }} </code></h6>
          <h6 class="fr-mb-1v"> tracks.seedTrack : <code>{{ tracks.seedTrack }} </code></h6>
        </div>
      </div>
    </div>

    <!-- MESSAGE & DEBUG SWITCH-->
    <div
      v-if="showMessageBool || debugSwitchBool"
      class="fr-grid-row fr-grid-row--gutters ">
      <!-- MESSAGE-->
      <div
        v-if="showMessageBool"
        class="fr-col">
        <h3
          v-if="message"
          class="red-color">
          <span v-html="message[choices.lang]"/>
        </h3>
      </div>
      <!-- DEBUG SWITCH-->
      <div
        v-if="debugSwitchBool"
        class="fr-col-md-3 fr-col-sm-6">
        <DsfrToggleSwitch
          label="Debug mode"
          hint="Switch to activate / deactivate debugging mode"
          :modelValue="debugBool"
          @update:modelValue="changeDebug"
          />
      </div>
    </div>

    <!-- MATOMO -->
    <TeeMatomo
      v-if="!disableWidget"
      :debug="debugBool"
      />

    <!-- QUESTIONNAIRE -->
    <div
      v-show="!programs.programDetail"
      id="trackElement"
      :class="`fr-container--fluid ${tracks.currentStep > 1 ? 'fr-pt-10v' : ''}`">

      <!-- TRACKS INTERFACES -->
      <div
        ref="tee-app-tracks"
        class="fr-grid-row fr-grid-row-gutters fr-p-0 fr-justify-center">

        <!-- SIDEBAR MENU (FIL D'ARIANE)-->
        <div
          v-if="needSidebar && tracks.currentStep > 1"
          class="fr-tee-add-padding fr-mt-4v fr-col-3 fr-col-md-4 fr-col-lg-4 fr-col-xl-2 fr-col-sm-hide"
          style="height: 100%;">
          <TeeSidebar
            :used-tracks="tracks.usedTracks"
            :debug="debugBool"
          />
        </div>

        <!-- TRACKS -->
        <div
          id="tee-app-tracks"
          :class="`${tracks.currentStep > 1 ? 'fr-tee-add-padding' : ''} ${getColumnsWidth} ${debugBool ? '' : 'fr-grid-row--center'}`"
          >
          <div
            v-for="(track, index) in tracks.usedTracks"
            :key="track.id"
            :style="`${tracks.getTrackBgColor(track.id) ? 'padding: 0px; background-color:'+tracks.getTrackBgColor(track.id) : ''}`"
            :class="`fr-p-0 fr-mb-${ debugBool ? '12v' : '0'}`">
            <TeeTrack
              :step="index + 1"
              :track-id="track.id"
              :is-completed="!!tracks.isTrackCompleted(track.id)"
              :track-element="trackElement"
              :disable-widget="disableWidget"
              :debug="debugBool"
            />
          </div>
        </div>

        <!-- DEBUGGING -->
        <div
          v-if="debugBool"
          class="vue-debug fr-col-2 fr-pl-3v">
          <h5>DEBUG - WidgetApp</h5>
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
              <h6>tracks.usedTracks :</h6>
              <code><pre>{{ tracks.usedTracks  }}</pre></code>
              <!-- <h6>tracks.tracksResults :</h6>
              <code><pre>{{ tracks.tracksResults  }}</pre></code> -->
            </div>

            <div
              v-if="false"
              class="fr-col-12">
              <h6>metaEnv :</h6>
              <code><pre>{{ metaEnv }}</pre></code>
            </div>

            <!-- <h4>
              WidgetApp debug / programs :
            </h4>
            <code><pre>{{ programsArray  }}</pre></code> -->
          </div>
        </div>

      </div>
    </div>

    <!-- DETAIL RESULT CARD -->
    <div
      v-if="programs.programDetail"
      :class="`fr-container-fluid fr-px-6v fr-px-md-20v fr-mt-10v`">
      <div
        class="fr-grid-row fr-grid-row-gutters">
        <div class="fr-col">
          <TeeProgramDetail
            :program-id="programs.programDetail"
            :track-id="programs.programDetailConfig"
            :track-element="trackElement"
            :disable-widget="disableWidget"
            :debug="debugBool"
            />
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div
      v-if="showFooterBool"
      class="fr-mt-10v">
      <TeeCredits/>
    </div>
  </div>
</template>

<script setup lang="ts">
// cf : https://stackoverflow.com/questions/71163741/vuejs-script-setup-cannot-contain-es-module-exports

import '@gouvfr/dsfr/dist/core/core.main.min.css'               // Le CSS minimal du DSFR
// import '@gouvfr/dsfr/dist/component/component.main.min.css'  // Styles de tous les composants du DSFR
// import '@gouvfr/dsfr/dist/utility/utility.main.min.css'      // Classes utilitaires : les composants de VueDsfr en ont besoin
// import '@gouvminint/vue-dsfr/styles'                         // Les styles propres aux composants de VueDsfr
// import '@gouvfr/dsfr/dist/scheme/scheme.min.css'             // Facultatif : Si les thèmes sont utilisés (thème sombre, thème clair)
// import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'       // Facultatif : Si des icônes sont utilisées avec les classes "fr-icon-..."

// import '@public/css/core.main.min.css'
// import '@public/css/custom.css'

// @ts-ignore
// import jsonDataset from '../public/data/generated/dataset_out.json'
// console.log('WidgetApp > jsonDataset :', jsonDataset)

import { ref, watch, computed, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { tracksStore } from './stores/tracks'
import { choicesStore } from './stores/choices'
import { programsStore } from './stores/programs'
import { navigationStore } from './stores/navigation'

import { TrackComponents } from './types'

import {
  metaEnv,
  deployMode,
  deployUrl,
  noDebugSwitch,
  publicPath,
  programsFromJson
} from './utils/global'
import { unfoldQueries } from './utils/navigation'

// @ts-ignore
import TeeMatomo from './components/TeeMatomo.vue'
// @ts-ignore
import TeeTrack from './components/TeeTrack.vue'
// @ts-ignore
import TeeSidebar from './components/TeeSidebar.vue'
// @ts-ignore
import TeeProgramDetail from './components/TeeProgramDetail.vue'
// @ts-ignore
import TeeCredits from './components/TeeCredits.vue'

interface Props {
  showHeader?: string,
  showMessage?: string,
  showStepper?: string,
  showFooter?: string,
  locale?: string,
  msg?: string,
  seed: string,
  disableWidget?: boolean,
  programId?: string | any,
  datasetUrl?: string,
  maxDepth?: string
  debugSwitch?: string,
  debug?: string,
}
const props = defineProps<Props>()

const tracks = tracksStore()
const choices = choicesStore()
const programs = programsStore()
const nav = navigationStore()

let trackElement = ref(null)
// let teeAppTopPosition = ref()
let showHeaderBool = ref(false)
let showMessageBool = ref(false)
let showStepperBool = ref(false)
let showFooterBool = ref(false)
let message = ref()
let debugSwitchBool = ref(false)
let debugBool = ref(false)

const router = useRouter()
const route = useRoute()

// @ts-ignore
window.stores = { tracks, choices, programs }

// watch (() => props.programId, (next) => {
//   console.log('WidgetApp > watch > props.programId > next : ', next)
// })
// watch (() => props.seed, (next) => {
//   console.log('WidgetApp > watch > props.seed > next : ', next)
// })

watch(() => tracks.usedTracks, (next) => {
  console.log()
  console.log('WidgetApp > watch > tracks.usedTracks > next : ', next)
  if (nav.routerReady) {
    nav.setCurrentStep(tracks.currentStep)
    nav.setCurrentTrackId(tracks.currentTrackId)
    nav.updateQueries(tracks.getAllUsedTracksValuesPairs, props.disableWidget)
  }
})

const changeDebug = (ev: any) => {
  debugBool.value = ev
}

const needSidebar = computed(() => {
  return tracks.seedTrack !== 'track_results' && (tracks.currentStep > 1 || props.disableWidget)
})

const getColumnsWidth = computed(() => {
  const currentTrack = tracks.getLastTrack
  const colsDebug = 'fr-col-7'
  const colsStart = 'fr-col-12 fr-col-xl-12'
  const colsTracks = 'fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-8 fr-col-xl-6'
  const colsResults = 'fr-col fr-col-sm-12 fr-col-md-8 fr-col-lg-8 fr-col-xl-8'
  if (debugBool.value) return colsDebug
  else if ((tracks.seedTrack === 'track_results') || tracks.currentStep === 1 && !props.disableWidget) {
    return colsStart
  }
  else if (currentTrack?.component === TrackComponents.results) {
    return colsResults
  }
  else {
    return colsTracks
  }
})

const setupGlobal = () => {
  choices.setPublicPath(publicPath)

  // load dataset to pinia store
  // programs.setDataset(props.datasetUrl, deployMode, deployUrl)
  programs.setDataset(programsFromJson)

  // set locale and message
  const locale = props.locale || 'fr'
  choices.setLocale(locale)
}

const setupFromUrl = () => {  
  // parse url to get current track and other queries
  const currentTrack = route.query['teeActiveTrack']
  /*
  GOAL => unfold object such as 
  {
    teetrack_track_help: "user_help:precise"
    teetrack_track_needs: "project_needs:*"
    teetrack_track_sectors: ""
    teetrack_track_siret: "siret:|codeNaf:|codeNAF1:|ville:|codePostal:|structure_sizes:|denomination:|label_sectors:undefined|secteur:undefined"
    teetrack_track_structure_workforce: "entreprise . effectif:249|structure_sizes:PME"
  }
  */
  const queryTracksRaw = unfoldQueries(route.query)
  console.log('WidgetApp > mounted > queryTracksInfos :', queryTracksRaw)
    // TO DO
  // tracks.populateUsedTracksFromQuery(route.query)
  // nav.populateFromQuery(route.query)
  // parse url to get detail program (if any)
  const programId = props.programId || route.query['teeDetail']
  console.log('WidgetApp > mounted > currentTrack :', currentTrack)
  console.log('WidgetApp > mounted > programId :', programId)
  // @ts-ignore
  nav.setCurrentDetailId(programId)
  // @ts-ignore
  programs.setDetailResult(programId, 'track_results')
  /*
  tested with url such as : 
  localhost:4242/?teeActiveTrack=track_results&teeDetail=accelerateur-decarbonation
  http://localhost:4242/?teeStep=3&teeActiveTrack=track_results&teetrack_track_needs=project_needs:*&teetrack_track_help=user_help:direct&teetrack_track_results=&teeDetail=accelerateur-decarbonation
  */
  nav.setCurrentTrackId(tracks.currentTrackId)
  nav.updateQueries(tracks.getAllUsedTracksValuesPairs, props.disableWidget)
}

onBeforeMount(() => {
  // console.log('WidgetApp > onBeforeMount > props.seed :', props.seed)
  // console.log('WidgetApp > onBeforeMount > props.maxDepth :', props.maxDepth)

  setupGlobal()

  // inject style link in html head if not present
  const href = deployMode ? `${deployUrl}/style.css` : ''
  console.log('WidgetApp > onBeforeMount > href :', href)
  let needStyle = !props.disableWidget // true
  // avoid duplicates
  const styleSheets = document.styleSheets.length
  // console.log('WidgetApp > onBeforeMount > document.styleSheets :', document.styleSheets)
  // console.log('WidgetApp > onBeforeMount > styleSheets :', styleSheets)
  if (needStyle && styleSheets) {
    // console.log('WidgetApp > onBeforeMount > styleSheets - A ')
    for(let i = 0; i < styleSheets; i++){
      // console.log('WidgetApp > onBeforeMount > styleSheets - A - i :', i)
      const docStyle = document.styleSheets[i]
      // console.log('WidgetApp > onBeforeMount > styleSheets - A - docStyle :', docStyle)
      // console.log('WidgetApp > onBeforeMount > styleSheets - A - docStyle.href :', docStyle.href)
      if(docStyle.href == href){
        needStyle = false
        // return
      }
    }
  }
  // console.log('WidgetApp > onBeforeMount > needStyle :', needStyle)
  // console.log('WidgetApp > onBeforeMount > SET STYLES...')
  if (needStyle && deployMode) {
    const head = document.head
    // console.log('WidgetApp > onBeforeMount > head :', head)
    const link = document.createElement('link')
    link.type = "text/css"
    link.rel = "stylesheet"
    link.href = href
    head.appendChild(link)
  }

  // console.log('WidgetApp > onBeforeMount > SET HEADER...')

  // set header / footer components
  showHeaderBool.value = props.showHeader === 'true'
  showStepperBool.value = props.showStepper === 'true'
  showMessageBool.value = props.showMessage === 'true'
  showFooterBool.value = props.showFooter === 'true'

  const messageObj = {}
  if (props.msg) {
    props.msg.split(',').forEach((s: string) => {
      const strObj = s.split('|').map((i: string) => i.trim())
      // @ts-ignore
      messageObj[strObj[0]] = strObj[1]
    })
    // console.log('WidgetApp > onBeforeMount > messageObj :', messageObj)
    message.value = messageObj
  }

  // set max depth at mount
  if (props.maxDepth) {
    const maxDepthNum = Number(props.maxDepth)
    tracks.setMaxDepth(maxDepthNum)
  }

  // set debug mode
  // no switch for production deployment

  debugSwitchBool.value = !noDebugSwitch && props.debugSwitch === 'true'
  if (debugSwitchBool.value && props.debug) {
    debugBool.value = props.debug === 'true'
  }
  // console.log('WidgetApp > onBeforeMount > END...')

  // set first track at mount
  console.log('WidgetApp > onMounted > set seed track...')
  tracks.setSeedTrack(props.seed)
  tracks.addToUsedTracks(props.seed, props.seed)
})

onMounted(async() => {
  // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
  console.log('WidgetApp > onMounted > set router...')
  await router.isReady()
  if (!props.disableWidget) {
    nav.setRouter(router)
    nav.setRoute(route)
  }
  setupFromUrl()

  // set detail program ID if any
  if (props.programId) {
    programs.setDetailResult(props.programId, props.seed)
    nav.setCurrentDetailId(props.programId, props.disableWidget)
  }
})
</script>

<!-- <style lang="scss">
  @import '~@gouvfr/dsfr/dist/core/core.main.min.css';
  @import '~@gouvfr/dsfr/dist/component/component.main.min.css';
  @import '~@gouvfr/dsfr/dist/utility/utility.main.min.css';
  @import '~@gouvfr/dsfr/dist/scheme/scheme.min.css';
  @import '~@gouvfr/dsfr/dist/utility/icons/icons.min.css';
  @import '~@gouvminint/vue-dsfr/dist/vue-dsfr.css';
</style> -->

<style lang="scss">
  @import '~@gouvfr/dsfr/dist/dsfr.min.css'; // ok
  @import '@public/css/custom.css';

  // @import '../public/core.main.css';
  // @import '~@gouvfr/dsfr/dist/core/core.main.min.css';

  // @import '~@gouvfr/dsfr/dist/dsfr.legacy.min.css';
  // @import '~@gouvfr/dsfr/dist/dsfr.main.min.css';

  // @import '~@gouvfr/dsfr/dist/component/component.main.min.css';
  // @import '~@gouvfr/dsfr/dist/utility/utility.main.min.css';

  // @import '~@gouvfr/dsfr/dist/scheme/scheme.min.css';
  @import '~@gouvfr/dsfr/dist/utility/icons/icons.min.css'; // ok

  // @import '~@gouvminint/vue-dsfr/styles';
  @import '~@gouvminint/vue-dsfr/dist/vue-dsfr.css'; // ok
</style>

