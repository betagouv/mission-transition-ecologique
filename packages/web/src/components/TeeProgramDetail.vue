<template>
  <!-- PROGRAM INFOS -->
  <div class="">

    <!-- BACK TO RESULTS BTN -->
    <button
      class="fr-btn fr-btn--tertiary-no-outline inline-flex fr-mb-3v fr-link"
      tertiary
      noOutline
      @click="resetDetailResult">
      <v-icon name="ri-arrow-left-line" aria-hidden="true"></v-icon>
      {{ choices.t('results.backToResults') }}
    </button>

    <!-- PROGRAM DETAILS -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-10v">
      <!-- IMAGE -->
      <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-3 fr-col-sm-hide fr-text-right">
        <img
          class="fr-responsive-img"
          :src="`${choices.publicPath}${program.illustration}`"
          :alt="`image / ${program.titre}`"
          style="min-height: 100%; object-fit: cover;"
          />
      </div>

      <!-- TITLE & RESUME -->
      <div class="fr-col fr-pl-10v">
        <!-- PROGRAM TITLE -->
        <p class="tee-program-title fr-mb-5v">
          {{ program.titre }}
        </p>

        <!-- PROGRAM RESUME / TEXT-->
        <h6
          v-if="trackConfig.config?.showProgramSubtitles"
          :style="`color: ${blockColor}`">
          {{ choices.t('program.programResume') }}
        </h6>
        <h2
          :style="`color: ${blockColor}`"
          v-html="program.promesse">
        </h2>
        <p
          style="color: #000091"
          v-html="program.description">
        </p>
        <!-- <p
          v-if="program['description longue']"
          style="color: #000091"
          v-html="program['description longue']">
        </p> -->

        <!-- OPEN MODAL -> FORM -->
        <!-- :label="choices.t('results.showForm', {title: program.title})" -->
        <!-- <DsfrButton
          class="fr-mb-3v fr-btn-sm-fullwidth"
          :label="choices.t('results.knowMore')"
          secondary
          @click="toggleShowForm"
          ref="modalOrigin"/> -->

        <!-- PROGRAM DESCRIPTION -->
        <div
          class="fr-mb-18v">
          <h3>
            {{ choices.t('program.programDescription') }}
          </h3>
          <div class="fr-tee-description-list">
            <p
              v-for="(paragraph, idx) in program.objectifs"
              :key="`description-paragraph-${idx}`"
              class="fr-mb-6v">
              <span
                class="fr-tee-description-paragraph-marker">
                {{ idx + 1 }} |
              </span>
              <span
                class="fr-tee-description-paragraph-content">
                {{ paragraph }}
              </span>
            </p>
          </div>
        </div>

      </div>

    </div>

    <!-- PROGRAM INFOS : PROVIDERS / TYPE / START / END -->
    <div
      v-if="trackConfig.config?.showProgramInfos"
      class="fr-grid-row fr-grid-row--gutters fr-mb-5v">

      <!-- PROGRAM GEO ZONES -->
      <!-- <div
        v-if="program.geo_zones"
        :class="columnTiles">
        <TeeTile
          :title="choices.t('program.programGeoZones')"
          :image-path="`${choices.publicPath}images/TEE-porteur.svg`"
          :description="'...'"
        />
      </div> -->

      <!-- PROGRAM COST | LOAN | AID -->
      <div
        v-if="program[`coût de l'accompagnement`]"
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('programCosts.cost')"
          :image-path="`${choices.publicPath}images/TEE-cout.svg`"
          :description="`${program[`coût de l'accompagnement`]}`"
        />
      </div>

      <div
        v-if="program[`montant du financement`]"
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('programCosts.aid')"
          :image-path="`${choices.publicPath}images/TEE-cout.svg`"
          :description="`${program[`montant du financement`]}`"
        />
      </div>

      <div
        v-if="program[`montant de l'avantage fiscal`]"
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('programCosts.taxAdvantage')"
          :image-path="`${choices.publicPath}images/TEE-cout.svg`"
          :description="`${program[`montant de l'avantage fiscal`]}`"
        />
      </div>

      <div
        v-if="program[`montant du prêt`]"
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('programCosts.loan')"
          :image-path="`${choices.publicPath}images/TEE-cout.svg`"
          :description="`${program[`montant du prêt`]}`"
        />
      </div>
      <!-- <div
        v-if="program[`taux du prêt`]"
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('programCosts.loanRate')"
          :image-path="`${choices.publicPath}images/TEE-cout.svg`"
          :description="`${program[`taux du prêt`]}`"
        />
      </div> -->

      <!-- PROGRAM TYPE -->
      <div
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('program.programType')"
          :image-path="`${choices.publicPath}images/TEE-typefinance.svg`"
          :description="program[`nature de l'aide`]">
        </TeeTile>
      </div>

      <!-- PROGRAM DURATION -->
      <div
        v-if="program[`durée de l'accompagnement`]"
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('program.programDuration')"
          :image-path="`${choices.publicPath}images/TEE-duree.svg`"
          :description="program[`durée de l'accompagnement`]"
        />
      </div>
      <div
        v-if="program[`durée du prêt`]"
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('program.programLoanDuration')"
          :image-path="`${choices.publicPath}images/TEE-duree.svg`"
          :description="program[`durée du prêt`]"
        />
      </div>

      <!-- PROGRAM PROVIDERS -->
      <div
        :class="columnTiles">
        <TeeTile
          class="tee-no-hover"
          :title="choices.t('program.programProviders')"
          :image-path="`${choices.publicPath}images/TEE-porteur.svg`"
          :description="choices.to(program['opérateur de contact'])">
        </TeeTile>
      </div>

    </div>

    <!-- PROGRAM FORM -->
    <div
      class="fr-form-block">
      <TeeForm
        :track-id="trackConfig.id"
        :form-options="trackConfig.form"
        :data-props="{ programId: program.id }"
        :program="program"
        :debug="debug"/>
    </div>
  </div>

  <!-- MODAL DIALOG -->
  <dialog
    aria-labelledby="fr-modal-title-modal-1"
    role="dialog"
    id="fr-modal-1"
    :class="`fr-modal fr-modal-custom ${showForm ? 'fr-modal--opened' : ''}`">
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-11 fr-col-lg-10">
          <div
            class="fr-modal__body fr-modal__body-custom"
            >
            <div class="fr-modal__header">
              <button
                class="fr-link--close fr-link"
                aria-controls="fr-modal-1"
                style="align-items: center;"
                @click="toggleShowForm"
                >
                <span class="fr-sm-hide">
                  {{ choices.t('close') }}
                </span>
              </button>
            </div>
            <div class="fr-modal__content">
              <!-- <h1 id="fr-modal-title-modal-1" class="fr-modal__title">
                <span class="fr-fi-arrow-right-line fr-fi--lg"></span>
                Titre de la modale
              </h1> -->
              <div class="fr-grid-row fr-grid-row--gutters">
                <!-- MODAL INFOS -->
                <div class="fr-col-md-5 fr-col-sm-12 align">
                  <h4
                    class=""
                    style="text-align: center;">
                    {{ choices.ti(trackConfig?.form.label[choices.lang], { title: program.titre }) || '' }}
                  </h4>
                  <p
                    class=""
                    style="text-align: center;">
                    {{ trackConfig?.form.hint[choices.lang] || '' }}
                  </p>
                  <img
                    class="fr-responsive-img fr-sm-hide"
                    :src="`${choices.publicPath}images/TEE_illustration.png`"
                    :alt="`image / ${program.titre}`"
                    />
                </div>
                <!-- MODAL FORM -->
                <div class="fr-col">
                  <TeeForm
                    :track-id="trackConfig.id"
                    :form-options="trackConfig.form"
                    :data-props="{ programId: program.id }"
                    :program="program"
                    :debug="debug"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>

</template>


<script setup lang="ts">

import { ref, onBeforeMount } from 'vue'

// @ts-ignore
import TeeTile from './TeeTile.vue'
// @ts-ignore
import TeeForm from './TeeForm.vue'

import { choicesStore } from '../stores/choices'
import { tracksStore } from '../stores/tracks'
import { programsStore } from '../stores/programs'
import { navigationStore } from '../stores/navigation'
import { analyticsStore } from '../stores/analytics'

import { scrollToId } from '../utils/helpers'
import type { TrackId } from '@/types'

const choices = choicesStore()
const tracks = tracksStore()
const programs = programsStore()
const analytics = analyticsStore()
const nav = navigationStore()

const program = ref<any>()
const trackConfig = ref<any>()

const blockColor = '#000091'
const showForm = ref<boolean>(false)
const columnTiles = ref<string>('fr-col')

interface Props {
  programId: string | number,
  trackId: TrackId | undefined,
  disableWidget?: boolean,
  debug?: boolean,
}
const props = defineProps<Props>()

// functions
const resetDetailResult = async () => {
  // console.log('TeeProgramDetail > resetDetailResult > props.trackConfig : ', props.trackConfig )
  programs.resetDetailResult()
  nav.setCurrentDetailId('', props.disableWidget)
  nav.updateUrl(props.disableWidget)
  
  scrollToId(`${props.programId}`)
}
const toggleShowForm = () => {
  // console.log('TeeProgramDetail > toggleShowForm > trackConfig : ', props.trackConfig )
  showForm.value = !showForm.value
  if (showForm.value) {
    analytics.sendEvent('result_detail', 'show_form', props.programId)
  }
}

onBeforeMount(async() => {
  // await router.isReady()
  // console.log('TeeProgramDetail > onBeforeMount > props.programId :', props.programId )
  program.value = programs.getProgramById(props.programId)
  if (props.trackId) {
    trackConfig.value = tracks.getTrack(props.trackId)
  }
  // console.log('TeeProgramDetail > onBeforeMount > resultsProgs :', resultsProgs )
  // analytics / send event
  analytics.sendEvent('result_detail', 'show_detail', props.programId)
})
</script>
