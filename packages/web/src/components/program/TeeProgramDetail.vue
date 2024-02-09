<template>
  <!-- ALERT - PROGRAM NOT AVAILABLE ANYMORE -->
  <div
    v-if="!programIsAvailable"
    class="fr-notice fr-tee-program-notice-alert fr-mb-0"
  >
    <div class="fr-container">
      <div class="fr-notice__body fr-text-center">
        <p class="fr-notice__title">
          <span
            class="fr-icon-information-line"
            aria-hidden="true"
          ></span>
          {{ Translation.t('program.programNotAvailable') }}
        </p>
        <p class="fr-notice__subtitle">{{ Translation.t('program.programEndValidity') }} : {{ program?.[`fin de validité`] }}</p>
      </div>
    </div>
  </div>
  <!-- PROGRAM INFOS -->
  <div :class="`fr-container-fluid fr-px-6v fr-px-md-20v fr-mt-${!programIsAvailable ? 3 : 8}v`">
    <div class="fr-grid-row fr-grid-row-gutters">
      <div class="fr-col">
        <!-- BACK TO RESULTS BTN -->
        <button
          class="fr-btn fr-btn--lg fr-btn--tertiary-no-outline fr-mb-3v fr-pl-2v"
          tertiary
          noOutline
          @click="resetDetailResult"
        >
          <v-icon
            name="ri-arrow-left-line"
            aria-hidden="true"
            class="fr-mr-2v"
          ></v-icon>
          {{ Translation.t('results.backToResults') }}
        </button>

        <!-- PROGRAM DETAILS -->
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-8v">
          <!-- IMAGE -->
          <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-3 fr-col-sm-12 fr-text-right fr-tee-program-detail-img">
            <img
              class="fr-responsive-img"
              :src="`${publicPath}${program?.illustration}`"
              :alt="`image / ${program?.titre}`"
            />

            <!-- PROGRAM TYPE -->
            <ul class="fr-badges-group fr-tee-program-detail-img-badge">
              <p class="fr-badge tee-program-badge-image">
                {{ program?.["nature de l'aide"] }}
              </p>
            </ul>
          </div>

          <!-- TITLE & RESUME -->
          <div class="fr-col fr-pl-10v">
            <!-- PROGRAM TITLE -->
            <p class="tee-program-title fr-mb-5v">
              {{ program?.titre }}
            </p>

            <!-- PROGRAM RESUME / TEXT-->
            <h6
              v-if="trackConfig.config?.showProgramSubtitles"
              :style="`color: ${blockColor}`"
            >
              {{ Translation.t('program.programResume') }}
            </h6>
            <h2
              :style="`color: ${blockColor}`"
              v-html="program?.promesse"
            ></h2>
            <p
              class="fr-mb-12v"
              style="color: #000091"
              v-html="program?.description"
            ></p>
            <!-- <p
              v-if="program['description longue']"
              style="color: #000091"
              v-html="program['description longue']">
            </p> -->

            <!-- OPEN MODAL -> FORM -->
            <!-- :label="Translation.t('results.showForm', {title: program.title})" -->
            <!-- <DsfrButton
              class="fr-mb-3v fr-btn-sm-fullwidth"
              :label="Translation.t('results.knowMore')"
              secondary
              @click="toggleShowForm"
              ref="modalOrigin"/> -->

            <ProgramObjective
              v-if="program"
              :program="program"
            ></ProgramObjective>
          </div>
        </div>

        <!-- PROGRAM INFOS : PROVIDERS / TYPE / START / END -->
        <div
          v-if="trackConfig.config?.showProgramInfos"
          class="fr-grid-row fr-grid-row--gutters fr-mb-8v"
        >
          <!-- PROGRAM GEO ZONES -->
          <!-- <div
            v-if="program.geo_zones"
            :class="columnTiles">
            <TeeTile
              :title="Translation.t('program.programGeoZones')"
              :image-path="`${publicPath}images/TEE-porteur.svg`"
              :description="'...'"
            />
          </div> -->

          <!-- PROGRAM COST | LOAN | AID -->
          <div
            v-if="program?.[`coût de l'accompagnement`]"
            :class="columnTiles"
          >
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.cost')"
              :image-path="`${publicPath}images/TEE-cout.svg`"
              :description="`${program[`coût de l'accompagnement`]}`"
            />
          </div>

          <div
            v-if="program?.[`montant du financement`]"
            :class="columnTiles"
          >
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.aid')"
              :image-path="`${publicPath}images/TEE-cout.svg`"
              :description="`${program[`montant du financement`]}`"
            />
          </div>

          <div
            v-if="program?.[`montant de l'avantage fiscal`]"
            :class="columnTiles"
          >
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.taxAdvantage')"
              :image-path="`${publicPath}images/TEE-cout.svg`"
              :description="`${program[`montant de l'avantage fiscal`]}`"
            />
          </div>

          <div
            v-if="program?.[`montant du prêt`]"
            :class="columnTiles"
          >
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.loan')"
              :image-path="`${publicPath}images/TEE-cout.svg`"
              :description="`${program[`montant du prêt`]}`"
            />
          </div>
          <!-- <div
            v-if="program[`taux du prêt`]"
            :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.loanRate')"
              :image-path="`${Translation.publicPath}images/TEE-cout.svg`"
              :description="`${program[`taux du prêt`]}`"
            />
          </div> -->

          <!-- PROGRAM DURATION -->
          <div
            v-if="program?.[`durée de l'accompagnement`]"
            :class="columnTiles"
          >
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('program.programDuration')"
              :image-path="`${publicPath}images/TEE-duree.svg`"
              :description="program[`durée de l'accompagnement`]"
            />
          </div>
          <div
            v-if="program?.[`durée du prêt`]"
            :class="columnTiles"
          >
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('program.programLoanDuration')"
              :image-path="`${publicPath}images/TEE-duree.svg`"
              :description="program[`durée du prêt`]"
            />
          </div>

          <!-- PROGRAM PROVIDERS -->
          <div :class="columnTiles">
            <TeeTile
              v-if="program"
              class="tee-no-hover"
              :title="Translation.t('program.programProviders')"
              :image-path="`${publicPath}images/TEE-porteur.svg`"
              :description="Translation.to(program['opérateur de contact'])"
            >
            </TeeTile>
          </div>

          <!-- PROGRAM END VALIDITY -->
          <div :class="columnTiles">
            <TeeTile
              class="tee-no-hover"
              :title="Translation.t('program.programEndValidity')"
              :image-path="`${publicPath}images/TEE-duree.svg`"
              :description="
                program?.[`fin de validité`]
                  ? Translation.t(Translation.t('program.programAvailableUntil'), { date: program[`fin de validité`] })
                  : Translation.t('program.programAvailable')
              "
            />
          </div>
        </div>

        <!-- ELIGIBILITY -->
        <ProgramAccordion
          v-if="program && program['description longue']"
          :accordion-id="`${program.id}-eligibility`"
          :title="Translation.t('program.programAmIEligible')"
        >
          <template #content>
            <ProgramEligibility :program="program"></ProgramEligibility>
          </template>
        </ProgramAccordion>

        <!-- LONG DESCRIPTION -->
        <ProgramAccordion
          v-if="program && program['description longue']"
          :accordion-id="`${program.id}-long-description`"
          :title="Translation.t('program.programKnowMore')"
        >
          <template #content>
            <ProgramLongDescription :program="program"></ProgramLongDescription>
          </template>
        </ProgramAccordion>
        <hr class="fr-mb-9v fr-pb-1v" />
      </div>
    </div>

    <!-- PROGRAM FORM -->
    <div
      ref="TeeProgramFormContainer"
      class="fr-tee-form-block fr-tee-form-container"
    >
      <TeeForm
        v-if="program"
        :track-id="trackConfig.id"
        :form-options="trackConfig.form"
        :data-props="{ programId: program.id }"
        :program="program"
        :form-container-ref="TeeProgramFormContainer"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeProgramDetail > FUNCTION_NAME > MSG_OR_VALUE :`)

import { ref, computed, onBeforeMount } from 'vue'

import TeeTile from '../TeeTile.vue'
import TeeForm from '../TeeForm.vue'
import ProgramObjective from '@/components/program/ProgramObjective.vue'
import ProgramAccordion from '@/components/program/ProgramAccordion.vue'
import ProgramEligibility from '@/components/program/ProgramEligibility.vue'
import ProgramLongDescription from '@/components/program/ProgramLongDescription.vue'

import Translation from '@/utils/translation'
import { tracksStore } from '@/stores/tracks'
import { programsStore } from '@/stores/programs'
import { navigationStore } from '@/stores/navigation'
import { scrollToId } from '@/utils/helpers'
import type { TrackId, ProgramData } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '@/types/routeType'
import Widget from '@/utils/widget'
import MetaEnv from '@/utils/metaEnv'
import Matomo from '@/utils/matomo'
import Program from '@/utils/program'

const tracks = tracksStore()
const programs = programsStore()
const nav = navigationStore()
const route = useRoute()
const router = useRouter()

const program = ref<{ index: string } & ProgramData>()
const trackConfig = ref<any>()
const TeeProgramFormContainer = ref<HTMLElement | null | undefined>(null)

const blockColor = '#000091'
const columnTiles = ref<string>('fr-col')

const publicPath = MetaEnv.publicPath

interface Props {
  programId: string | number
  trackId: TrackId | undefined
}
const props = defineProps<Props>()

// functions
const resetDetailResult = async () => {
  if (route.name === RouteName.CatalogDetail) {
    tracks.resetUsedTracks()
    await router.push({ name: RouteName.Catalog, hash: '#' + props.programId })
    return
  }
  programs.resetDetailResult()
  await nav.setCurrentDetailId('')
  await nav.updateUrl(!Widget.is)

  scrollToId(`${props.programId}`)
}

onBeforeMount(() => {
  program.value = programs.getProgramById(props.programId)
  if (props.trackId) {
    trackConfig.value = tracks.getTrack(props.trackId)
  }
  // analytics / send event
  Matomo.sendEvent('result_detail', route.name === RouteName.CatalogDetail ? 'show_detail_catalog' : 'show_detail', props.programId)
})

const programIsAvailable = computed(() => {
  return Program.isAvailable(program.value)
})
</script>
