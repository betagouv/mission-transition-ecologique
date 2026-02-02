<template>
  <Layout :links="links">
    <template
      v-if="isDataFull || Program.isTemporaryUnavailable(currentProgram) || !Program.isAvailable(currentProgram)"
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
          <ProgramResume />
          <ProgramMainCta
            :program="currentProgram as AbstractProgramTypeForFront"
            :is-activation-visible="isActivationVisible"
            :scroll-to-form="scrollToForm"
            :scroll-to-activation="scrollToActivation"
          />
        </div>
      </div>
      <div ref="activation-ref">
        <ProgramActivation
          v-if="isActivationVisible"
          :program="currentProgram"
          :is-form-visible="isFormVisible"
          :scroll-to-form="scrollToForm"
        />
      </div>
      <ProgramTiles />
      <ProgramEligibilityConditions :program="currentProgram as AbstractProgramTypeForFront" />
      <ProgramProjects :program="currentProgram" />
      <ProgramLongDescription :program="currentProgram as AbstractProgramTypeForFront" />
      <div ref="form-ref">
        <ClientOnly>
          <ProgramForm
            v-if="isFormVisible && isActivationVisible"
            :form-container-ref="formRef"
          />
        </ClientOnly>
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
import { RouteName } from '@/types/routeType'
import { MetaSeo } from '@/tools/metaSeo'
import Program from '@/tools/program/program'
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { useExternalLinkTracker } from '@/tools/analytic/useExternalLinkTracker'
import Analytics from '@/tools/analytic/analytics'
import { Scroll } from '@/tools/scroll/scroll'
import { useCompanyDataStore } from '@/stores/companyData'
import { AbstractProgramTypeForFront, ProgramEligibility } from '@/types'
import { defineWebPage, useSchemaOrg } from '@unhead/schema-org/vue'

const { currentProgram } = storeToRefs(useProgramStore())
const { currentProject } = storeToRefs(useProjectStore())
const { query } = storeToRefs(useNavigationStore())
const { isDataFull } = storeToRefs(useCompanyDataStore())

const navigation = new Navigation()
const formRef = useTemplateRef<HTMLElement>('form-ref')
const activationRef = useTemplateRef<HTMLElement>('activation-ref')

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

if (currentProgram.value) {
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

const scrollToRef = (targetRef: HTMLElement | null | undefined) => {
  if (!targetRef) {
    return
  }
  if (targetRef) {
    Scroll.toWithEligibilityBarOffset(targetRef)
  }
}
const scrollToForm = () => scrollToRef(formRef.value)
const scrollToActivation = () => scrollToRef(activationRef.value)

const description = currentProgram.value?.metaDescription ?? currentProgram.value?.description
useSeoMeta(MetaSeo.get(currentProgram.value?.metaTitre ?? currentProgram.value?.titre, description))
useSchemaOrg(defineWebPage({ description: description }))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

const isFormNeeded = computed(() => {
  if (!currentProgram.value) {
    return false
  }
  if (currentProgram.value['contact question'] === 'formulaire') {
    return true
  }
  return Program.hasFormInObjectives(currentProgram.value)
})

const isActivationVisible = computed(() => {
  if (!currentProgram.value || !Program.isAvailable(currentProgram.value)) {
    return false
  }
  if (!isDataFull.value) {
    return true
  }
  return ProgramEligibility.isEligible(currentProgram.value)
})

const isFormVisible = computed(() => {
  return isFormNeeded.value && isActivationVisible.value
})

Analytics.sendDetailPageView('program', currentProgram.value?.titre)
useExternalLinkTracker('program')
</script>
