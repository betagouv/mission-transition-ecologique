<template>
  <TeeContentBlock
    id="project-aids-title"
    class="fr-pt-3v fr-pb-4v fr-border-b--grey--light"
    title="💰 Mes aides"
  >
    <template #content>
      <div class="fr-container--fluid fr-px-3v">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-text-center">
            <TeeSpinner v-if="navigationStore.hasSpinner" />
            <TeeNoResult
              v-else-if="!countFilteredPrograms && !hasError && !navigationStore.hasSpinner"
              message="Aucune aide n'a pu être identifiée avec les critères choisis..."
            />
            <TeeError
              v-else-if="hasError"
              :mailto="Contact.email"
              :email="Contact.email"
            />
          </div>
          <ProjectProgramsList
            v-if="studyPrograms.length > 0"
            :title="Translation.t('project.studyPrograms')"
            :programs="studyPrograms"
            :project="project"
          />
          <ProjectProgramsList
            v-if="financePrograms.length > 0"
            :title="Translation.t('project.financePrograms')"
            :programs="financePrograms"
            :project="project"
          />
        </div>
      </div>
      <DsfrHighlight
        v-if="isCatalogDetail"
        class="fr-highlight-border--yellow fr-highlight-bg--yellow--lightness fr-m-0 fr-p-0"
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
                  :to="trackSiretTo()"
                  size="sm"
                  secondary
                  @click="onTrackSiretTo()"
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
        id="project-contact"
        ref="TeeProjectFormContainer"
        class="fr-bg--blue-france--lightness fr-grid-row fr-p-2w"
      >
        <TeeForm
          v-if="project"
          :form-container-ref="TeeProjectFormContainer"
          :form-type="OpportunityType.Project"
          :phone-callback="Translation.t('form.phoneContact', { operator: ' ' })"
          :form="Opportunity.getProjectFormFields(project)"
          :data-id="project.id.toString()"
          :data-slug="project.slug"
          :hint="Translation.t('project.form.hint')"
          :error-email-subject="Translation.t('project.form.errorEmail.subject', { titre: props.project.title })"
        />
      </div>
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { useUsedTrackStore } from '@/stores/usedTrack'
import { useProgramStore } from '@/stores/program'
import Navigation from '@/tools/navigation'
import { ProgramAidType, type ProgramData, Project, QuestionnaireRoute, TrackId, OpportunityType } from '@/types'
import Contact from '@/tools/contact'
import { RouteName } from '@/types/routeType'
import { type RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import Translation from '@/tools/translation'
import Opportunity from '@/tools/opportunity'

interface Props {
  project: Project
}
const props = defineProps<Props>()

const programStore = useProgramStore()
const navigationStore = useNavigationStore()

const TeeProjectFormContainer = ref<HTMLElement | null | undefined>(null)
const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)

const isCatalogDetail = new Navigation().isCatalogProjectDetail()

navigationStore.hasSpinner = true
const programsResult = await programStore.programsByUsedTracks
if (programsResult.isOk()) {
  programs.value = programsResult.data
} else {
  hasError.value = true
}
navigationStore.hasSpinner = false

const countFilteredPrograms = computed(() => {
  return filteredPrograms.value.length || 0
})

const filteredPrograms = computed(() => {
  return programs.value && props.project ? programs.value.filter((program) => props.project?.programs.includes(program.id)) : []
})

const studyPrograms = computed(() => {
  return filteredPrograms.value.filter((program: ProgramData) =>
    [ProgramAidType.study, ProgramAidType.train].includes(program["nature de l'aide"])
  )
})

const financePrograms = computed(() => {
  return filteredPrograms.value.filter((program: ProgramData) =>
    [ProgramAidType.fund, ProgramAidType.loan, ProgramAidType.tax].includes(program["nature de l'aide"])
  )
})

const trackSiretTo = (): RouteLocationRaw => {
  if (navigationStore.isByRouteName(RouteName.CatalogProjectDetail)) {
    navigationStore.updateSearchParam({ name: TrackId.QuestionnaireRoute, value: QuestionnaireRoute.SpecificGoal })
  }

  return navigationStore.routeByTrackId(TrackId.Siret)
}

function onTrackSiretTo() {
  if (navigationStore.isByRouteName(RouteName.CatalogProjectDetail)) {
    useUsedTrackStore().updateByTrackIdAndValue(TrackId.QuestionnaireRoute, QuestionnaireRoute.SpecificGoal)
  }
}
</script>
