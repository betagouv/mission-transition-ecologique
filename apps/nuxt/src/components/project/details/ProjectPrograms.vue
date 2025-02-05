<template>
  <TeeContentBlock
    v-if="hasRegisteredData || countFilteredPrograms"
    id="project-aids-title"
    class="fr-pt-3v fr-pb-4v fr-border-b--grey--light"
    title="💰 Mes aides"
  >
    <template #content>
      <client-only fallback-tag="div">
        <template #fallback>
          <div class="fr-container">
            <div class="fr-col-12 fr-col--middle fr-col-justify--center">
              <TeeSpinner />
            </div>
          </div>
        </template>
        <TeeRegisterHighlight
          v-if="!hasRegisteredData"
          class="fr-mx-3v"
          :text="Translation.t('project.projectRegisterHighlightText')"
        />
        <div class="fr-container--fluid fr-px-3v">
          <div class="fr-grid-row">
            <div class="fr-col-12 fr-text-center">
              <TeeSpinner v-if="navigationStore.hasSpinner" />
              <TeeError
                v-else-if="hasError"
                :mailto="Contact.mailTo"
                :email="Contact.email"
              />
            </div>
            <ProjectProgramsList
              v-if="studyPrograms.length > 0 && !navigationStore.hasSpinner"
              :title="Translation.t('project.studyPrograms')"
              :programs="studyPrograms"
              :project="project"
            />
            <ProjectProgramsList
              v-if="financePrograms.length > 0 && !navigationStore.hasSpinner"
              :title="Translation.t('project.financePrograms')"
              :programs="financePrograms"
              :project="project"
            />
          </div>
        </div>
        <TeeDsfrHighlight
          v-if="hasRegisteredData && !countFilteredPrograms && !navigationStore.hasSpinner"
          large
          :text="Translation.t('project.noPrograms.title')"
          alt-img="projet / aucune aide"
          :color="Color.yellow"
          img="/images/tracks/no-programs.svg"
        >
          <p class="fr-mt-n3v fr-mb-0">{{ Translation.t('project.noPrograms.subtitle') }}</p>
        </TeeDsfrHighlight>
        <div
          v-if="hasRegisteredData"
          id="project-contact"
          ref="teeProjectFormContainer"
          class="fr-bg--blue--lightness fr-grid-row fr-p-2w"
        >
          <TeeForm
            v-if="project"
            :form-container-ref="teeProjectFormContainer"
            :form-type="OpportunityType.Project"
            :title="Translation.t('project.form.title')"
            :phone-callback="Translation.t('form.phoneContactCE')"
            :form="Opportunity.getProjectFormFields(project)"
            :data-id="project.id.toString()"
            :data-slug="project.slug"
            :show-c-e-logo="true"
            :hint="Translation.t('project.form.hint')"
            :error-email-subject="Translation.t('project.form.errorEmail.subject', { titre: props.project.title })"
          />
        </div>
      </client-only>
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import { ProgramAidType, type ProgramData, ProjectType, OpportunityType, Color } from '@/types'
import Contact from '@/tools/contact'
import Translation from '@/tools/translation'
import Opportunity from '@/tools/opportunity'
import { CompanyData } from '@/tools/companyData'

interface Props {
  project: ProjectType
}
const props = defineProps<Props>()

const navigationStore = useNavigationStore()
const { programs, hasError } = storeToRefs(useProgramStore())
const teeProjectFormContainer = useTemplateRef<HTMLElement>('teeProjectFormContainer')

onServerPrefetch(async () => {
  await new ProgramManager().getDependentCompanyData()
})

onNuxtReady(async () => {
  await new ProgramManager().getDependentCompanyData(true)
})

const hasRegisteredData = CompanyData.isDataFull()

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
  return filteredPrograms.value
    .filter((program: ProgramData) => [ProgramAidType.fund, ProgramAidType.loan, ProgramAidType.tax].includes(program["nature de l'aide"]))
    .sort((a, b) => a["nature de l'aide"].localeCompare(b["nature de l'aide"]))
})
</script>
