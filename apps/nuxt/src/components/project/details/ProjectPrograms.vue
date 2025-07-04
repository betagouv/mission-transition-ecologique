<template>
  <TeeContentBlock
    v-if="isDataFull || countFilteredPrograms"
    id="project-aids-title"
    class="fr-py-5v fr-border-b--grey--light"
    :title="companyDataSelected && isDataFull ? '💰 Vos aides' : '💰 Toutes les aides'"
    container-from="md"
    title-class="fr-h4"
    title-tag="h2"
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
          v-if="!isDataFull"
          class="fr-mx-3v"
          :text="Translation.t('project.projectRegisterHighlightText')"
        />
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-text-center">
            <TeeSpinner v-if="navigationStore.hasSpinner" />
            <TeeError
              v-else-if="hasError"
              :mailto="Contact.mailTo"
              :email="Contact.email"
            />
          </div>
          <p
            v-if="companyDataSelected && isDataFull && !navigationStore.hasSpinner && countFilteredPrograms"
            class="fr-mb-0"
            v-html="resume"
          ></p>
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
        <TeeDsfrHighlight
          v-if="isDataFull && !countFilteredPrograms && !navigationStore.hasSpinner"
          large
          :text="Translation.t('project.noPrograms.title')"
          alt-img="projet / aucune aide"
          :color="Color.yellow"
          img="/images/tracks/no-programs.svg"
        >
          <p class="fr-mt-n3v fr-mb-0">{{ Translation.t('project.noPrograms.subtitle') }}</p>
        </TeeDsfrHighlight>
        <div
          v-if="isDataFull"
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
import { CompanyData } from '@/tools/companyData'
import { ProgramManager } from '@/tools/program/programManager'
import { ProgramAidType, ProjectType, OpportunityType, Color, ProgramTypeForFront } from '@/types'
import Contact from '@/tools/contact'
import Translation from '@/tools/translation'
import Opportunity from '@/tools/opportunity'
import ProgramFilter from '@/tools/program/programFilter'
import { ProgramSorter } from '@/tools/program/programSorter'

interface Props {
  project: ProjectType
}
const props = defineProps<Props>()

const navigationStore = useNavigationStore()
const { programs, hasError } = storeToRefs(useProgramStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())
const { companyDataSelected } = storeToRefs(useFiltersStore())
const teeProjectFormContainer = useTemplateRef<HTMLElement>('teeProjectFormContainer')

const resume = computed<string>(() =>
  Translation.t('project.programsList', {
    effectif: Translation.t('enterprise.structureSize.' + CompanyData.size),
    secteur: CompanyData.company?.secteur,
    region: CompanyData.company?.region
  })
)

onServerPrefetch(async () => {
  await new ProgramManager().getDependentCompanyData()
})

onNuxtReady(async () => {
  await new ProgramManager().getDependentCompanyData(true)
})

const countFilteredPrograms = computed(() => {
  return filteredPrograms.value.length || 0
})

const filteredPrograms = computed(() => {
  return programs.value && props.project ? programs.value.filter((program) => props.project?.programs.includes(program.id)) : []
})

const studyPrograms = computed(() => {
  return filteredPrograms.value.filter((program: ProgramTypeForFront) =>
    [ProgramAidType.study, ProgramAidType.train].includes(program["nature de l'aide"])
  )
})

const financePrograms = computed(() => {
  const filteredByAidType = filteredPrograms.value.filter((program) => {
    return ProgramFilter.byAidType(program, [ProgramAidType.fund, ProgramAidType.loan, ProgramAidType.tax])
  })

  return ProgramSorter.byFinanceAidType(filteredByAidType)
})
</script>
