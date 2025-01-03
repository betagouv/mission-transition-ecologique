<template>
  <TeeContentBlock
    v-if="hasRegisteredData || countFilteredPrograms"
    id="project-aids-title"
    class="fr-pt-3v fr-pb-4v fr-border-b--grey--light"
    title="💰 Mes aides"
  >
    <template #content>
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
        class="fr-bg--blue-france--lightness fr-grid-row fr-p-2w"
      >
        <TeeForm
          v-if="project"
          :form-container-ref="teeProjectFormContainer"
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
import { useProgramStore } from '@/stores/program'
import { ProgramAidType, type ProgramData, Project, OpportunityType, Color } from '@/types'
import Contact from '@/utils/contact'
import { useNavigationStore } from '@/stores/navigation'
import Translation from '@/utils/translation'
import Opportunity from '@/utils/opportunity'
import { CompanyData } from '@/utils/companyData'

interface Props {
  project: Project
}
const props = defineProps<Props>()

const programStore = useProgramStore()
const navigationStore = useNavigationStore()
const teeProjectFormContainer = useTemplateRef<HTMLElement>('teeProjectFormContainer')

const programs = ref<ProgramData[]>()
const hasError = ref<boolean>(false)

const hasRegisteredData = CompanyData.isDataFull()
const registeredData = CompanyData.dataRef

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

const getPrograms = async () => {
  navigationStore.hasSpinner = true
  const result = await programStore.programsByUsedTracks
  if (result.isOk) {
    programs.value = result.value
  } else {
    hasError.value = true
  }
  navigationStore.hasSpinner = false
}

watch(
  registeredData.value,
  async () => {
    await getPrograms()
  },
  {
    immediate: true
  }
)
</script>
