<template>
  <TeeDsfrBreadcrumb :links="links" />
  <TeeEligibilityCriteriaBar
    v-if="!isCatalogDetail"
    :bg-color="Color.greenLightnessed"
    :bg-bar-color="Color.greenLighted"
    message="Cette aide correspond à vos critères d’éligibilité"
    message-icon="fr-icon-checkbox-circle-fill"
  />
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
        v-if="!program"
        class="fr-col-12"
      >
        <TeeError
          :mailto="Contact.email"
          :email="Contact.email"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import { Color, Project, type ProgramData as ProgramType } from '@/types'
import { RouteName } from '@/types/routeType'
import Contact from '@/tools/contact'
import { useNavigationStore } from '@/stores/navigation'
import { useProjectStore } from '@/stores/project'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import Translation from '@/tools/translation'

interface Props {
  programId: string
  program: ProgramType | undefined
  projectSlug: string | undefined
}
const props = defineProps<Props>()

const projectStore = useProjectStore()
const navigationStore = useNavigationStore()
const router = useRouter()
const navigation = new Navigation()

const project = ref<Project | undefined>(projectStore.currentProject)

const isCatalogDetail = navigation.isCatalogProgramDetail()

const routeToResults = {
  name: isCatalogDetail ? RouteName.CatalogPrograms : RouteName.QuestionnaireResult,
  hash: '#' + props.programId,
  query: isCatalogDetail ? undefined : navigationStore.query
}

const routeToProject = {
  ...routeToResults,
  name: isCatalogDetail ? RouteName.CatalogProjectDetail : RouteName.ProjectResultDetail,
  params: { projectSlug: props.projectSlug }
}

console.log(props.projectSlug)
console.log(routeToProject)

const links = computed<DsfrBreadcrumbProps['links']>(() => {
  const links = []
  if (navigation.isProgramFromProject()) {
    links.push({ text: project.value?.title || '', to: routeToProject })
  }
  return [...links, { text: props.program?.titre || '' }]
})
</script>
