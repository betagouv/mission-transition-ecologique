<template>
  <!-- PROGRAM INFOS -->
  <div :class="`fr-container-fluid fr-px-6v fr-px-md-20v fr-mt-10v`">
    <div class="fr-grid-row fr-grid-row-gutters">
      <div class="fr-col">
        <!-- BACK TO RESULTS BTN -->
        <button class="fr-btn fr-btn--tertiary-no-outline inline-flex fr-mb-3v fr-link" tertiary noOutline @click="resetDetailResult">
          <v-icon name="ri-arrow-left-line" aria-hidden="true"></v-icon>
          {{ choices.t('results.backToResults') }}
        </button>

        <!-- PROGRAM DETAILS -->
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-10v">
          <!-- IMAGE -->
          <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-3 fr-col-sm-hide fr-text-right">
            <img
              class="fr-responsive-img"
              :src="`${choices.publicPath}${program?.illustration}`"
              :alt="`image / ${program?.titre}`"
              style="min-height: 100%; object-fit: cover"
            />
          </div>

          <!-- TITLE & RESUME -->
          <div class="fr-col fr-pl-10v">
            <!-- PROGRAM TITLE -->
            <p class="tee-program-title fr-mb-5v">
              {{ program?.titre }}
            </p>

            <!-- PROGRAM RESUME / TEXT-->
            <h6 v-if="trackConfig.config?.showProgramSubtitles" :style="`color: ${blockColor}`">
              {{ choices.t('program.programResume') }}
            </h6>
            <h2 :style="`color: ${blockColor}`" v-html="program?.promesse"></h2>
            <p style="color: #000091" v-html="program?.description"></p>
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

            <ProgramObjective v-if="program" :program="program"></ProgramObjective>
          </div>
        </div>

        <!-- PROGRAM INFOS : PROVIDERS / TYPE / START / END -->
        <div v-if="trackConfig.config?.showProgramInfos" class="fr-grid-row fr-grid-row--gutters fr-mb-5v">
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
          <div v-if="program?.[`coût de l'accompagnement`]" :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="choices.t('programCosts.cost')"
              :image-path="`${choices.publicPath}images/TEE-cout.svg`"
              :description="`${program[`coût de l'accompagnement`]}`"
            />
          </div>

          <div v-if="program?.[`montant du financement`]" :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="choices.t('programCosts.aid')"
              :image-path="`${choices.publicPath}images/TEE-cout.svg`"
              :description="`${program[`montant du financement`]}`"
            />
          </div>

          <div v-if="program?.[`montant de l'avantage fiscal`]" :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="choices.t('programCosts.taxAdvantage')"
              :image-path="`${choices.publicPath}images/TEE-cout.svg`"
              :description="`${program[`montant de l'avantage fiscal`]}`"
            />
          </div>

          <div v-if="program?.[`montant du prêt`]" :class="columnTiles">
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
          <div :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="choices.t('program.programType')"
              :image-path="`${choices.publicPath}images/TEE-typefinance.svg`"
              :description="program?.[`nature de l'aide`]"
            >
            </TeeTile>
          </div>

          <!-- PROGRAM DURATION -->
          <div v-if="program?.[`durée de l'accompagnement`]" :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="choices.t('program.programDuration')"
              :image-path="`${choices.publicPath}images/TEE-duree.svg`"
              :description="program[`durée de l'accompagnement`]"
            />
          </div>
          <div v-if="program?.[`durée du prêt`]" :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="choices.t('program.programLoanDuration')"
              :image-path="`${choices.publicPath}images/TEE-duree.svg`"
              :description="program[`durée du prêt`]"
            />
          </div>

          <!-- PROGRAM PROVIDERS -->
          <div :class="columnTiles">
            <TeeTile
              v-if="program"
              class="tee-no-hover"
              :title="choices.t('program.programProviders')"
              :image-path="`${choices.publicPath}images/TEE-porteur.svg`"
              :description="choices.to(program['opérateur de contact'])"
            >
            </TeeTile>
          </div>
        </div>

        <ProgramEligibility v-if="program" :program="program"></ProgramEligibility>

        <!-- PROGRAM FORM -->
        <div class="fr-form-block">
          <TeeForm
            v-if="program"
            :track-id="trackConfig.id"
            :form-options="trackConfig.form"
            :data-props="{ programId: program.id }"
            :program="program"
            :debug="debug"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeProgramDetail > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref, onBeforeMount } from 'vue'

import TeeTile from '../TeeTile.vue'
import TeeForm from '../TeeForm.vue'
import ProgramEligibility from '@/components/program/ProgramEligibility.vue'
import ProgramObjective from '@/components/program/ProgramObjective.vue'

import { choicesStore } from '../../stores/choices'
import { tracksStore } from '../../stores/tracks'
import { programsStore } from '../../stores/programs'
import { navigationStore } from '../../stores/navigation'
import { analyticsStore } from '../../stores/analytics'

import { scrollToId } from '../../utils/helpers'
import type { TrackId, ProgramData } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/types/routeType'

const choices = choicesStore()
const tracks = tracksStore()
const programs = programsStore()
const analytics = analyticsStore()
const nav = navigationStore()
const route = useRoute()
const router = useRouter()

const program = ref<{ index: string } & ProgramData>()
const trackConfig = ref<any>()

const blockColor = '#000091'
const columnTiles = ref<string>('fr-col')

interface Props {
  programId: string | number
  trackId: TrackId | undefined
  disableWidget?: boolean
  debug?: boolean
}
const props = defineProps<Props>()

// functions
const resetDetailResult = async () => {
  if (route.name === RouteName.CatalogDetail) {
    tracks.resetUsedTracks()
    await router.push({ name: RouteName.Catalog })
    return
  }
  programs.resetDetailResult()
  await nav.setCurrentDetailId('', props.disableWidget)
  await nav.updateUrl(props.disableWidget)

  scrollToId(`${props.programId}`)
}

onBeforeMount(() => {
  program.value = programs.getProgramById(props.programId)
  if (props.trackId) {
    trackConfig.value = tracks.getTrack(props.trackId)
  }
  // analytics / send event
  analytics.sendEvent('result_detail', route.name === RouteName.CatalogDetail ? 'show_detail_catalog' : 'show_detail', props.programId)
})
</script>
