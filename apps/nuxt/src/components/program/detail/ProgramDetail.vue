<template>
  <Layout :links="links">
    <template
      v-if="isDataFull || Program.isTemporaryUnavailable(currentProgram)"
      #beforeBreadcrumb
    >
      <ClientOnly>
        <ProgramEligibilityBar />
      </ClientOnly>
    </template>
    <ProgramBackLink />
    <article
      v-if="currentProgram"
      id="externalLinksTracking"
    >
      <!-- PROGRAM DETAILS -->
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-8v">
        <!-- IMAGE -->
        <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-3 fr-col-sm-12 fr-text-right fr-tee-program-detail-img">
          <ProgramImage />
        </div>

        <!-- TITLE & RESUME -->
        <div class="fr-col">
          <ProgramTitle />
          <ProgramResume :form-container-ref="teeProgramFormContainer" />
        </div>
      </div>
      <ProgramTiles />
      <ProgramAccordions />

      <!-- PROGRAM FORM -->
      <div
        v-if="hasRegisteredData && programIsEligible && !Program.isTemporaryUnavailable(currentProgram)"
        ref="tee-program-form-container"
        class="fr-bg--blue--lightness fr-grid-row fr-p-2w"
      >
        <TeeForm
          :form-container-ref="teeProgramFormContainer"
          :data-id="currentProgram.id"
          :show-c-e-logo="!isProgramAutonomous"
          :phone-callback="
            isProgramAutonomous
              ? Translation.t('form.phoneContactAutonomy', { operator: currentProgram['opérateur de contact'] })
              : Translation.t('form.phoneContactCE')
          "
          :form="Opportunity.getProgramFormFields(currentProgram)"
          :form-type="OpportunityType.Program"
          :error-email-subject="Translation.t('program.form.errorEmail.subject', { program: currentProgram.titre })"
          :hint="Translation.t('program.form.hint', { operator: currentProgram['opérateur de contact'] })"
        />
      </div>
    </article>
  </Layout>
</template>

<script setup lang="ts">
import { TeeDsfrBreadcrumbProps } from '@/components/element/TeeDsfrBreadcrumb.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'
import { ProjectManager } from '@/tools/project/projectManager'
import { OpportunityType, ProgramEligibility, ProgramType } from '@/types'
import { RouteName } from '@/types/routeType'
import { MetaSeo } from '@/tools/metaSeo'
import Program from '@/tools/program/program'
import Translation from '@/tools/translation'
import { useProjectStore } from '@/stores/project'
import Opportunity from '@/tools/opportunity'
import { CompanyData } from '@/tools/companyData'
import { storeToRefs } from 'pinia'
import { useExternalLinkTracker } from '@/tools/analytic/useExternalLinkTracker'
import Analytics from '@/tools/analytic/analytics'

const { currentProgram } = storeToRefs(useProgramStore())
const { currentProject } = storeToRefs(useProjectStore())
const { query } = storeToRefs(useNavigationStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())

const navigation = new Navigation()
const hasRegisteredData = CompanyData.isDataFullComputed()
const teeProgramFormContainer = useTemplateRef<HTMLElement>('tee-program-form-container')

onNuxtReady(async () => {
  if (currentProgram.value) {
    await new ProgramManager().getOneById(currentProgram.value.id)
  }
})

await new ProjectManager().getProjects()

const isCatalogDetail = navigation.isCatalogProgramDetail()

const routeToResults = {
  name: isCatalogDetail ? RouteName.CatalogProjectDetail : RouteName.ProjectResultDetail,
  params: { projectSlug: currentProject.value?.slug },
  query: isCatalogDetail ? undefined : query,
  hash: '#' + currentProgram.value?.id
}

const links = computed<TeeDsfrBreadcrumbProps['links']>(() => {
  const links = []
  if (navigation.isProgramFromProject()) {
    links.push({ text: currentProject.value?.title || '', to: routeToResults })
  }
  return [...links, { text: currentProgram.value?.titre || '' }]
})

if (currentProgram.value && navigation.isByRouteName(RouteName.CatalogProgramFromCatalogProjectDetail)) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: navigation.getHrefByRouteName(RouteName.CatalogProgramDetail, {
          programId: currentProgram.value.id
        })
      }
    ]
  })
}

useSeoMeta(MetaSeo.get(currentProgram.value?.titre, currentProgram.value?.description, currentProgram.value?.illustration))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const isProgramAutonomous = computed(() => {
  return Program.isProgramAutonomous(currentProgram.value)
})

const programIsEligible = computed(() => {
  return currentProgram.value ? ProgramEligibility.isEligible(currentProgram.value as unknown as ProgramType) : false
})

Analytics.sendDetailPageView('program', currentProgram.value?.titre)
useExternalLinkTracker('program')
</script>
