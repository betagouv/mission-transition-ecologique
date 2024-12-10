<template>
  <ProgramHeader
    :program-id="programId"
    :program="program"
    :project-slug="projectSlug"
  />
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
          />
          {{ Translation.t('program.programNotAvailable') }}
        </p>
        <p class="fr-notice__subtitle">{{ Translation.t('program.programEndValidity') }} : {{ program?.[`fin de validité`] }}</p>
      </div>
    </div>
  </div>

  <!-- PROGRAM INFOS -->
  <div
    v-if="program"
    class="fr-container fr-mt-0 fr-mt-md-3v"
  >
    <div class="fr-grid-row fr-grid-row-gutters">
      <div class="fr-col">
        <!-- PROGRAM DETAILS -->
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-12v">
          <!-- IMAGE -->
          <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-3 fr-col-sm-12 fr-text-right fr-tee-program-detail-img">
            <img
              class="fr-responsive-img"
              :src="`/${program?.illustration}`"
              :alt="`image / ${program?.titre}`"
            />

            <!-- PROGRAM TYPE -->
            <ul class="fr-badges-group fr-tee-program-detail-img-badge">
              <li class="fr-badge fr-badge--info fr-badge--no-icon">
                {{ program?.["nature de l'aide"] }}
              </li>
            </ul>
          </div>

          <!-- TITLE & RESUME -->
          <div class="fr-col">
            <!-- PROGRAM TITLE -->
            <div class="fr-col-justify--left fr-mb-5v fr-h6 fr-text--purple">
              <div class="fr-text-line-height--8v">{{ program?.titre }}</div>
              <TeeCopyLinkButton
                class="fr-ml-6v fr-hidden fr-unhidden-md"
                :tertiary="true"
                :no-outline="true"
                copy-class="fr-text--green"
                text-class="fr-text--black"
              />
            </div>

            <!-- PROGRAM RESUME / TEXT-->
            <h2
              class="fr-text--blue-france"
              v-html="program?.promesse"
            />
            <p
              class="fr-mb-12v fr-text--blue-france"
              v-html="program?.description"
            />
            <ProgramObjective
              v-if="program"
              :program="program"
            />
            <DsfrButton
              v-if="!isProgramAutonomous && programIsEligible"
              size="lg"
              icon="fr-icon-mail-line"
              class="fr-ml-md-3v"
              :on-click="scrollToProgramForm"
            >
              {{ Translation.t('program.CTAButton') }}
            </DsfrButton>
          </div>
        </div>

        <!-- PROGRAM INFOS : PROVIDERS / TYPE / START / END -->
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-8v">
          <!-- PROGRAM COST | LOAN | AID -->
          <div
            v-if="programCost"
            :class="columnTiles"
          >
            <ProgramTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.cost')"
              :image-path="`${publicPath}images/TEE-cout-02.svg`"
              :description="`${programCost}`"
            />
          </div>

          <div
            v-if="programAidAmount"
            :class="columnTiles"
          >
            <ProgramTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.aid')"
              :image-path="`${publicPath}images/TEE-cout-02.svg`"
              :description="`${programAidAmount}`"
            />
          </div>

          <div
            v-if="programTaxAdvantage"
            :class="columnTiles"
          >
            <ProgramTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.taxAdvantage')"
              :image-path="`${publicPath}images/TEE-cout-02.svg`"
              :description="`${programTaxAdvantage}`"
            />
          </div>

          <div
            v-if="programLoan"
            :class="columnTiles"
          >
            <ProgramTile
              class="tee-no-hover"
              :title="Translation.t('programCosts.loan')"
              :image-path="`${publicPath}images/TEE-cout-02.svg`"
              :description="`${programLoan}`"
            />
          </div>

          <!-- PROGRAM DURATION -->
          <div
            v-if="programDuration"
            :class="columnTiles"
          >
            <ProgramTile
              class="tee-no-hover"
              :title="Translation.t('program.programDuration')"
              :image-path="`${publicPath}images/TEE-duree.svg`"
              :description="programDuration"
            />
          </div>
          <div
            v-if="programLoanDuration"
            :class="columnTiles"
          >
            <ProgramTile
              class="tee-no-hover"
              :title="Translation.t('program.programLoanDuration')"
              :image-path="`${publicPath}images/TEE-duree.svg`"
              :description="programLoanDuration"
            />
          </div>

          <!-- PROGRAM PROVIDERS -->
          <div :class="columnTiles">
            <ProgramTile
              v-if="programProvider"
              class="tee-no-hover"
              :title="Translation.t('program.programProviders')"
              :image-path="`${publicPath}images/TEE-porteur.svg`"
              :description="Translation.to(programProvider)"
            />
          </div>

          <!-- PROGRAM END VALIDITY -->
          <div :class="columnTiles">
            <ProgramTile
              class="tee-no-hover"
              :title="Translation.t('program.programEndValidity')"
              :image-path="`${publicPath}images/TEE-date-fin.svg`"
              :description="
                programEndValidity
                  ? Translation.t(Translation.t('program.programAvailableUntil'), { date: programEndValidity })
                  : Translation.t('program.programAvailable')
              "
            />
          </div>
        </div>
        <ProgramAccordion
          v-if="program && program['conditions d\'éligibilité']"
          :accordion-id="`${program.id}-eligibility`"
          :title="Translation.t('program.programAmIEligible')"
        >
          <ProgramEligibility :program="program" />
          <TeeRegisterHighlight
            v-if="!hasRegisteredData"
            :text="Translation.t('program.programRegisterHighlightText')"
          />
        </ProgramAccordion>
        <ProgramAccordion
          v-if="program && linkedProjects && linkedProjects.length > 0"
          :accordion-id="`${program.id}-linked-projects`"
          :title="Breakpoint.isMobile() ? Translation.t('program.projectExamplesSM') : Translation.t('program.projectExamples')"
        >
          <ProgramProjects :linked-projects="linkedProjects" />
        </ProgramAccordion>
        <ProgramAccordion
          v-if="program && program['description longue']"
          :accordion-id="`${program.id}-long-description`"
          :title="Translation.t('program.programKnowMore')"
        >
          <ProgramLongDescription :program="program" />
        </ProgramAccordion>
      </div>
    </div>

    <!-- PROGRAM FORM -->
    <div
      v-if="hasRegisteredData && programIsEligible"
      ref="teeProgramFormContainer"
      class="fr-bg--blue-france--lightness fr-grid-row fr-p-2w"
    >
      <TeeForm
        v-if="program"
        :form-container-ref="teeProgramFormContainer"
        :data-id="program.id"
        :phone-callback="Translation.t('form.phoneContact', { operator: program['opérateur de contact'] })"
        :form="Opportunity.getProgramFormFields(program)"
        :form-type="OpportunityType.Program"
        :error-email-subject="Translation.t('program.form.errorEmail.subject', { program: program.titre })"
        :hint="Translation.t('program.form.hint', { operator: program['opérateur de contact'] })"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeProgramDetail > FUNCTION_NAME > MSG_OR_VALUE :`)

import ProgramAccordion from '@/components/program/detail/ProgramAccordion.vue'
import ProgramEligibility from '@/components/program/detail/ProgramEligibility.vue'
import ProgramLongDescription from '@/components/program/detail/ProgramLongDescription.vue'
import ProgramTile from '@/components/program/detail/ProgramTile.vue'
import Config from '@/config'
import { useProgramStore } from '@/stores/program'
import { OpportunityType, ProgramEligibilityType, Project as ProjectType } from '@/types'
import { RouteName } from '@/types/routeType'
import { useNavigationStore } from '@/stores/navigation'
import { MetaSeo } from '@/utils/metaSeo'
import Program from '@/utils/program/program'
import { Scroll } from '@/utils/scroll'
import Translation from '@/utils/translation'
import Breakpoint from '@/utils/breakpoints'
import { useProjectStore } from '@/stores/project'
import Opportunity from '@/utils/opportunity'
import { CompanyDataStorage } from '@/utils/storage'
import { storeToRefs } from 'pinia'

const projectStore = useProjectStore()
const programsStore = useProgramStore()
const navigationStore = useNavigationStore()

const { currentProgram: program } = storeToRefs(programsStore)
const linkedProjects = ref<ProjectType[] | undefined>([])
const teeProgramFormContainer = useTemplateRef<HTMLElement>('teeProgramFormContainer')

const publicPath = Config.publicPath

const hasRegisteredData = CompanyDataStorage.isDataFull()
const registeredData = CompanyDataStorage.getData()

interface Props {
  programId: string
  projectSlug?: string
}
defineProps<Props>()

// computed
const programCost = computed(() => program.value?.[`coût de l'accompagnement`])
const programAidAmount = computed(() => program.value?.[`montant du financement`])
const programTaxAdvantage = computed(() => program.value?.[`montant de l'avantage fiscal`])
const programLoan = computed(() => program.value?.[`montant du prêt`])
const programDuration = computed(() => program.value?.[`durée de l'accompagnement`])
const programLoanDuration = computed(() => program.value?.[`durée du prêt`])
const programProvider = computed(() => program.value?.['opérateur de contact'])
const programEndValidity = computed(() => program.value?.[`fin de validité`])

const columnTiles = computed(() => {
  const infoBlocks = [
    !!programCost.value,
    !!programAidAmount.value,
    !!programTaxAdvantage.value,
    !!programLoan.value,
    !!programDuration.value,
    !!programLoanDuration.value,
    true, // shortcut for programValidity block (always exists)
    true // shortcut for programProvider block (always exists)
  ].filter(Boolean)
  const colsSize = Math.round(12 / infoBlocks.length)
  return `fr-col fr-col-xs-12 fr-col-sm-12 fr-col-md-${colsSize} fr-tee-detail-info-tile`
})
const isProgramAutonomous = computed(() => {
  return program.value?.[`activable en autonomie`] == 'oui'
})

const programIsEligible = computed(() => {
  return (
    program.value?.eligibility === ProgramEligibilityType.Eligible ||
    program.value?.eligibility === ProgramEligibilityType.PartiallyEligible
  )
})

onBeforeMount(async () => {
  useNavigationStore().hasSpinner = true
  program.value = programsStore.currentProgram
  let projectResult
  if (useNavigationStore().isCatalogProgramDetail()) {
    projectResult = await projectStore.projects
  } else {
    projectResult = await projectStore.eligibleProjects
  }
  if (projectResult.isOk) {
    linkedProjects.value = Program.getLinkedProjects(program.value, projectResult.value)
  }

  if (program.value && navigationStore.isByRouteName(RouteName.CatalogProgramFromCatalogProjectDetail)) {
    useHead({
      link: [
        {
          rel: 'canonical',
          href: navigationStore.getAbsoluteUrlByRouteName(RouteName.CatalogProgramDetail, {
            programId: program.value.id
          })
        }
      ]
    })
  }

  useSeoMeta(MetaSeo.get(program.value?.titre, program.value?.description, program.value?.illustration))

  useNavigationStore().hasSpinner = false
})

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

watch(registeredData.value, async () => {
  if (program.value) {
    await programsStore.getProgramById(program.value.id)
  }
})

const programIsAvailable = computed(() => {
  return Program.isAvailable(programsStore.currentProgram)
})

const scrollToProgramForm = () => {
  if (teeProgramFormContainer.value) {
    navigationStore.isByRouteName(RouteName.CatalogProgramDetail) ||
    navigationStore.isByRouteName(RouteName.CatalogProgramFromCatalogProjectDetail)
      ? Scroll.to(teeProgramFormContainer.value)
      : Scroll.toWithTopBarOffset(teeProgramFormContainer.value)
  }
}
</script>
