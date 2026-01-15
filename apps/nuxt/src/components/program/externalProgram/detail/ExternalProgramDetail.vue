<template>
  <Layout :links="links">
    <ExternalProgramBackLink />
    <article
      v-if="currentExternalProgram"
      id="externalLinksTracking"
    >
      <!-- PROGRAM DETAILS -->
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-8v">
        <!-- IMAGE -->
        <div class="fr-col-md-4 fr-col-lg-3 fr-col-xl-3 fr-col-sm-12 fr-text-right fr-tee-program-detail-img">
          <ExternalProgramImage />
        </div>

        <!-- TITLE & RESUME -->
        <div class="fr-col">
          <ExternalProgramTitle />
          <ExternalProgramResume />
          <ExternalProgramMainCta
            :program="currentExternalProgram"
            :is-activation-visible="false"
            :scroll-to-form="scrollToForm"
            :scroll-to-activation="scrollToActivation"
          />
        </div>
      </div>
      <ExternalProgramTiles />
      <ExternalProgramEligibilityConditions :program="currentExternalProgram" />
      <ExternalProgramLongDescription :program="currentExternalProgram" />
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
import { useProjectStore } from '@/stores/project'
import { storeToRefs } from 'pinia'
import { useExternalLinkTracker } from '@/tools/analytic/useExternalLinkTracker'
import Analytics from '@/tools/analytic/analytics'
import { Scroll } from '@/tools/scroll/scroll'
import { defineWebPage, useSchemaOrg } from '@unhead/schema-org/vue'

const { currentExtProgram: currentExternalProgram } = storeToRefs(useProgramStore())
const { currentProject } = storeToRefs(useProjectStore())
const { query } = storeToRefs(useNavigationStore())

const navigation = new Navigation()
const formRef = useTemplateRef<HTMLElement>('form-ref')
const activationRef = useTemplateRef<HTMLElement>('activation-ref')

onNuxtReady(async () => {
  if (currentExternalProgram.value?.id) {
    await new ProgramManager().getOneExternal(currentExternalProgram.value.id)
  }
})

await new ProjectManager().getProjects()

const isCatalogDetail = navigation.isCatalogProgramDetail()

const routeToResults = {
  name: isCatalogDetail ? RouteName.CatalogProjectDetail : RouteName.ProjectResultDetail,
  params: { projectSlug: currentProject.value?.slug },
  query: isCatalogDetail ? undefined : query.value,
  hash: '#' + currentExternalProgram.value?.id
}

const links = computed<TeeDsfrBreadcrumbProps['links']>(() => {
  const links = []
  if (navigation.isProgramFromProject()) {
    links.push({ text: currentProject.value?.title || '', to: routeToResults })
  }
  return [...links, { text: currentExternalProgram.value?.titre || '' }]
})

if (currentExternalProgram.value?.id) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: navigation.getHrefByRouteName(RouteName.CatalogProgramDetail, {
          programId: currentExternalProgram.value.id
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

const description = currentExternalProgram.value?.metaDescription ?? currentExternalProgram.value?.description
useSeoMeta(MetaSeo.get(currentExternalProgram.value?.metaTitre ?? currentExternalProgram.value?.titre, description))
useSchemaOrg(defineWebPage({ description: description }))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

// const isFormNeeded = computed(() => {
//   if (!currentExternalProgram.value) {
//     return false
//   }
//   if (currentExternalProgram.value['contact question'] === 'formulaire') {
//     return true
//   }
// })

// const isActivationVisible = computed(() => {
//   if (!currentExternalProgram.value) {
//     return false
//   }
//   if (!isDataFull.value) {
//     return true
//   }
//   return ProgramEligibility.isEligible(currentExternalProgram.value)
// })

// const isFormVisible = computed(() => {
//   return isFormNeeded.value && isActivationVisible.value
// })

Analytics.sendDetailPageView('program', currentExternalProgram.value?.titre)
useExternalLinkTracker('program')
</script>
