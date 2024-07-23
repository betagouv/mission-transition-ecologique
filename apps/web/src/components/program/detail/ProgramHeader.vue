<template>
  <TeeDsfrBreadcrumb :links="links" />
  <TeeEligibilityCriteriaBar
    v-if="!isCatalogDetail"
    :bg-color="Color.greenLightnessed"
    :bg-bar-color="Color.greenLighted"
    :previous-route="props.project ? routeToProject : routeToPrograms"
    message="Cette aide correspond à vos critères d’éligibilité"
    message-icon="fr-icon-checkbox-circle-fill"
  />
  <div class="fr-container-fluid fr-px-0 fr-px-md-20v fr-mt-3v">
    <div class="fr-grid-row fr-grid-row-gutters">
      <div
        v-if="isCatalogDetail"
        class="fr-col"
      >
        <!-- BACK TO RESULTS BTN -->
        <button
          class="fr-btn fr-btn--lg fr-btn--tertiary-no-outline fr-mb-3v fr-pl-2v"
          @click="goToPrograms"
        >
          <v-icon
            name="ri-arrow-left-line"
            aria-hidden="true"
            class="fr-mr-2v"
          />
          {{ Translation.t('results.backToResults') }}
        </button>
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
import { Color, Project, type ProgramData as ProgramType } from '@/types'
import { RouteName } from '@/types/routeType'
import Contact from '@/utils/contact'
import { useNavigationStore } from '@/stores/navigation'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import Translation from '@/utils/translation'

interface Props {
  programId: string
  program: ProgramType | undefined
  project: Project | undefined
}
const props = defineProps<Props>()
console.log(props.project)
const navigationStore = useNavigationStore()
const isCatalogDetail = navigationStore.isByRouteName(RouteName.CatalogDetail)
const router = useRouter()

const routeToPrograms = {
  name: isCatalogDetail ? RouteName.Catalog : RouteName.QuestionnaireResult,
  hash: '#' + props.programId,
  query: isCatalogDetail ? undefined : navigationStore.query
}

const routeToProjects = {
  name: RouteName.QuestionnaireResult,
  hash: '#' + props.project?.slug,
  query: navigationStore.query
}

const routeToProject = {
  name: RouteName.ProjectResultDetail,
  hash: '#' + props.project?.id,
  query: navigationStore.query
}

const links = computed<DsfrBreadcrumbProps['links']>(() => {
  const links = [{ text: 'Vos résultats', to: props.project ? routeToProjects : routeToPrograms }]
  if (props.project) {
    links.push({ text: props.project?.title || '', to: routeToProject })
  }
  return [...links, { text: props.program?.titre || '' }]
})

const goToPrograms = async () => {
  if (props.project) {
    await router.push(routeToProjects)
  } else {
    await router.push(routeToPrograms)
  }
}
</script>
