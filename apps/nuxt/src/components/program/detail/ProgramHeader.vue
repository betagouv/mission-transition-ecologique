<template>
  <ProgramEligibilityBar v-if="hasRegisteredData" />
  <TeeDsfrBreadcrumb :links="links" />
  <div class="fr-container fr-mt-0 fr-mt-md-3v">
    <div class="fr-grid-row fr-grid-row-gutters">
      <div
        v-if="isCatalogDetail"
        class="fr-col"
      >
        <TeeDsfrButton
          :label="Translation.t('results.back')"
          icon="fr-icon-arrow-left-line"
          size="lg"
          class="fr-btn fr-btn--tertiary-no-outline fr-mb-3v fr-pl-2v"
          @click="router.back()"
        />
      </div>
      <div
        v-if="!currentProgram"
        class="fr-col-12"
      >
        <TeeError
          :mailto="Contact.mailTo"
          :email="Contact.email"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types/routeType'
import Contact from '@/tools/contact'
import { useNavigationStore } from '@/stores/navigation'
import { useProjectStore } from '@/stores/project'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import Translation from '@/tools/translation'
import { CompanyData } from '@/tools/companyData'

const { currentProject } = storeToRefs(useProjectStore())
const { currentProgram } = storeToRefs(useProgramStore())
const navigationStore = useNavigationStore()
const router = useRouter()
const navigation = new Navigation()

const isCatalogDetail = navigation.isCatalogProgramDetail()

const hasRegisteredData = CompanyData.isDataFull()

const routeToResults = {
  name: isCatalogDetail ? RouteName.CatalogPrograms : RouteName.QuestionnaireResult,
  hash: '#' + currentProgram.value?.id, //TODO get from program
  query: isCatalogDetail ? undefined : navigationStore.query
}

const routeToProject = {
  ...routeToResults,
  name: isCatalogDetail ? RouteName.CatalogProjectDetail : RouteName.ProjectResultDetail,
  params: { projectSlug: currentProject.value?.slug }
}

const links = computed<DsfrBreadcrumbProps['links']>(() => {
  const links = []
  if (navigation.isProgramFromProject()) {
    links.push({ text: currentProject.value?.title || '', to: routeToProject })
  }
  return [...links, { text: currentProgram.value?.titre || '' }]
})
</script>
