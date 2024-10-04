<template>
  <TeeContentBlock
    id="project-aids-title"
    class="fr-pt-3v fr-pb-4v"
    title="💰 Mes aides"
    :border-position="[BorderPosition.bottom]"
  >
    <template #content>
      <div class="fr-container--fluid fr-px-3v">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-text-center">
            <TeeSpinner
              v-if="navigationStore.hasSpinner"
              scale="6"
            />
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
        v-if="isCatalogDetail && !hasCompanyData"
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
        class="fr-bg--blue-france--lightness fr-col-justify--center fr-p-2w"
      >
        <ProjectForm
          v-if="project"
          :project="project"
        />
      </div>
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { useUsedTrackStore } from '@/stores/usedTrack'
import { useProgramStore } from '@/stores/program'
import { BorderPosition, ProgramAidType, type ProgramData, Project, QuestionnaireRoute, TrackId } from '@/types'
import Contact from '@/utils/contact'
import { RouteName } from '@/types/routeType'
import { type RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import Translation from '@/utils/translation'
import CompanyData from '@/utils/storage/companyData'

interface Props {
  project: Project
}
const props = defineProps<Props>()

const programStore = useProgramStore()
const navigationStore = useNavigationStore()
const isCatalogDetail = navigationStore.isCatalogProjectDetail()
const hasCompanyData = CompanyData.hasData()

const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)

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
