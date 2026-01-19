<template>
  <Layout :links="links">
    <ProgramBackLink />
    <article
      v-if="currentExtProgram"
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
            :program="currentExtProgram"
            :is-activation-visible="true"
            :scroll-to-form="() => {}"
            :scroll-to-activation="scrollToActivation"
          />
        </div>
      </div>
      <div
        v-if="currentExtProgram && currentExtProgram.objectifs && currentExtProgram.objectifs.length > 0"
        ref="activation-ref"
      >
        <ProgramActivation
          :program="currentExtProgram"
          :is-form-visible="false"
          :scroll-to-form="() => {}"
          :show-registration-step="false"
        />
      </div>

      <ProgramTiles />
      <ProgramEligibilityConditions :program="currentExtProgram" />
      <ProgramLongDescription :program="currentExtProgram" />
    </article>
  </Layout>
</template>

<script setup lang="ts">
import { TeeDsfrBreadcrumbProps } from '@/components/element/TeeDsfrBreadcrumb.vue'
import { useProgramStore } from '@/stores/program'
import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'
import { RouteName } from '@/types/routeType'
import { MetaSeo } from '@/tools/metaSeo'
import { storeToRefs } from 'pinia'
import { useExternalLinkTracker } from '@/tools/analytic/useExternalLinkTracker'
import Analytics from '@/tools/analytic/analytics'
import { Scroll } from '@/tools/scroll/scroll'
import { defineWebPage, useSchemaOrg } from '@unhead/schema-org/vue'

const { currentExtProgram } = storeToRefs(useProgramStore())

const navigation = new Navigation()
const activationRef = useTemplateRef<HTMLElement>('activation-ref')

onNuxtReady(async () => {
  if (currentExtProgram.value?.id) {
    await new ProgramManager().getOneExternal(currentExtProgram.value.id)
  }
})

const links = computed<TeeDsfrBreadcrumbProps['links']>(() => {
  return [{ text: currentExtProgram.value?.titre || '' }]
})

if (currentExtProgram.value?.id) {
  useHead({
    link: [
      {
        rel: 'canonical',
        href: navigation.getHrefByRouteName(RouteName.CatalogProgramDetail, {
          programId: currentExtProgram.value.id
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
const scrollToActivation = () => scrollToRef(activationRef.value)

const description = currentExtProgram.value?.metaDescription ?? currentExtProgram.value?.description
useSeoMeta(MetaSeo.get(currentExtProgram.value?.metaTitre ?? currentExtProgram.value?.titre, description))
useSchemaOrg(defineWebPage({ description: description }))

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})

Analytics.sendDetailPageView('program', currentExtProgram.value?.titre)
useExternalLinkTracker('program')
</script>
