<template>
  <DsfrAccordion
    id="project-aids"
    :expanded-id="expandedId"
    @expand="(id: string | undefined) => (expandedId = id)"
  >
    <template #title
      ><div
        id="project-aids-title"
        class="fr-h3"
      >
        💰 Mes aides
      </div></template
    >
    <DsfrHighlight
      v-if="!hasSiret"
      class="fr-highlight-border--yellow fr-highlight-bg--yellow-light fr-m-0 fr-p-0"
      :large="true"
    >
      <template #default>
        <div class="fr-container--fluid fr-p-4v">
          <div class="fr-grid-row fr-grid-row--middle">
            <img
              class="fr-col-2 fr-col-xs-2 fr-mr-8v"
              src="/images/tracks/ecriture.svg"
              alt="image / ecriture"
            />
            <div class="fr-col-9 fr-col-xs-8">
              <div class="fr-pb-2v">Complétez votre profil en 2 minutes et accédez aux aides éligibles pour votre entreprise.</div>
              <TeeButtonLink
                :to="navigationStore.routeByTrackId(TrackId.Siret)"
                size="sm"
                secondary
              >
                Compléter mon profil
              </TeeButtonLink>
            </div>
          </div>
        </div>
      </template>
    </DsfrHighlight>
    <div
      v-else
      class="fr-container--fluid"
    >
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-text-center">
          <TeeSpinner
            v-if="hasSpinner"
            scale="6"
          />
          <ProgramListNoResults
            v-else-if="!countFilteredPrograms && !hasError"
            image="images/tracks/no-results.svg"
            :message="{ fr: 'Aucune aide n\'a pu être identifiée avec les critères choisis...' }"
          />
          <TeeError
            v-else-if="hasError"
            :mailto="Contact.email"
            :email="Contact.email"
          />
        </div>
        <router-link
          v-for="program in filteredPrograms"
          :id="program.id"
          :key="program.id"
          :to="getRouteToProgramDetail(program.id)"
          class="fr-col-12 fr-card fr-enlarge-link fr-card--horizontal-tier fr-mb-10v"
        >
          <ProgramCard :program="program" />
        </router-link>
      </div>
    </div>
    <div
      id="project-contact"
      class="fr-tee-form-block fr-p-4v"
    >
      <ProjectForm
        v-if="project"
        :project="project"
      />
    </div>
  </DsfrAccordion>
</template>
<script setup lang="ts">
import TrackStructure from '@/utils/track/trackStructure'
import { useProgramStore } from '@/stores/program'
import { type ProgramData, Objective, TrackId, Project } from '@/types'
import Contact from '@/utils/contact'
import { RouteName } from '@/types/routeType'
import { type RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  objective: Objective | undefined
  project: Project | undefined
}
const props = defineProps<Props>()

const programStore = useProgramStore()
const navigationStore = useNavigationStore()

const expandedId = ref<string | undefined>('project-aids')
const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)

const siret: undefined | string = TrackStructure.getSiret()
const hasSpinner = navigationStore.hasSpinner

const hasSiret = computed(() => siret !== undefined && siret !== '')

const countFilteredPrograms = computed(() => {
  return filteredPrograms.value.length || 0
})

const filteredPrograms = computed(() => {
  return programs.value && props.project ? programs.value.filter((program) => props.project?.programs.includes(program.id)) : []
})

onBeforeMount(async () => {
  navigationStore.hasSpinner = true
  const result = await programStore.programsByUsedTracks
  if (result.isOk) {
    programs.value = result.value
  } else {
    hasError.value = true
  }
  navigationStore.hasSpinner = false
})

const getRouteToProgramDetail = (programId: string): RouteLocationRaw => {
  return {
    name: RouteName.QuestionnaireResultDetail,
    params: { programId },
    query: navigationStore.query
  }
}
</script>
