<template>
  <Layout
    :links="[{ text: 'Plan du site' }]"
    fluid
  >
    <div class="fr-container fr-mt-3v fr-mb-8v">
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-md-3 fr-mt-md-4w fr-mb-2w">
          <DsfrSideMenu
            heading-title="Sommaire"
            :menu-items="tableOfContents"
          />
        </div>
        <div class="fr-col-12 fr-col-md-9">
          <h1 class="fr-text--blue-france">Plan du site</h1>
          <p class="fr-text--lg fr-mb-4w">Retrouvez l'ensemble des pages de la plateforme Transition écologique des entreprises.</p>

          <!-- Pages principales -->
          <section
            id="pages-principales"
            class="fr-mb-6w"
          >
            <h2 class="fr-text--blue-france">Pages principales</h2>
            <ul class="fr-ml-4w">
              <li
                v-for="page in mainPages"
                :key="page.name"
              >
                <NuxtLink :to="{ name: page.name }">
                  {{ page.label }}
                </NuxtLink>
              </li>
            </ul>
          </section>

          <!-- Programs -->
          <section
            id="dispositifs-aide"
            class="fr-mb-6w"
          >
            <h2 class="fr-text--blue-france">
              Dispositifs d'aide
              <span
                v-if="programs.length > 0"
                class="fr-text--regular fr-text--sm"
              >
                ({{ programs.length }} aide{{ programs.length > 1 ? 's' : '' }})
              </span>
            </h2>
            <p class="fr-mb-2w">
              <NuxtLink :to="{ name: RouteName.CatalogPrograms }"> Voir toutes les aides aux entreprises </NuxtLink>
            </p>
            <div
              v-if="loadingPrograms"
              class="fr-ml-4w"
            >
              <TeeSpinner class="fr-my-2w" />
            </div>
            <ul
              v-else-if="sortedPrograms.length > 0"
              class="fr-ml-4w sitemap-list"
            >
              <li
                v-for="program in sortedPrograms"
                :key="program.id"
              >
                <NuxtLink :to="`/aides-entreprise/${program.id}`">
                  {{ program.titre }}
                </NuxtLink>
              </li>
            </ul>
          </section>

          <!-- Projets -->
          <section
            id="projets-transition"
            class="fr-mb-6w"
          >
            <h2 class="fr-text--blue-france">
              Projets de transition écologique
              <span
                v-if="projects.length > 0"
                class="fr-text--regular fr-text--sm"
              >
                ({{ projects.length }} projet{{ projects.length > 1 ? 's' : '' }})
              </span>
            </h2>
            <p class="fr-mb-2w">
              <NuxtLink :to="{ name: RouteName.CatalogProjects }"> Voir tous les projets d'entreprise </NuxtLink>
            </p>
            <div
              v-if="loadingProjects"
              class="fr-ml-4w"
            >
              <TeeSpinner class="fr-my-2w" />
            </div>
            <ul
              v-else-if="sortedProjects.length > 0"
              class="fr-ml-4w sitemap-list"
            >
              <li
                v-for="project in sortedProjects"
                :key="project.slug"
              >
                <NuxtLink :to="`/projets-entreprise/${project.slug}`">
                  {{ project.title }}
                </NuxtLink>
              </li>
            </ul>
          </section>

          <!-- Pages d'Informations légales -->
          <section
            id="informations-legales"
            class="fr-mb-6w"
          >
            <h2 class="fr-text--blue-france">Informations légales</h2>
            <ul class="fr-ml-4w">
              <li
                v-for="page in legalPages"
                :key="page.name"
              >
                <NuxtLink :to="{ name: page.name }">
                  {{ page.label }}
                </NuxtLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import { RouteName } from '@/types'
import { MetaSeo } from '@/tools/metaSeo'
import { MetaRobots } from '@/tools/metaRobots'
import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'
import { ProjectManager } from '@/tools/project/projectManager'
import { useProgramStore } from '@/stores/program'
import { useProjectStore } from '@/stores/project'
import { useNavigationStore } from '@/stores/navigation'
import { DsfrSideMenuListItemProps } from '@gouvminint/vue-dsfr/types'

definePageMeta({
  path: '/plan-du-site',
  name: RouteName.SitemapPage
})

const navigation = new Navigation()

// SEO
const description =
  'Plan du site de la plateforme Transition écologique des entreprises. Accédez à toutes les pages, aides et projets pour faciliter votre navigation.'

useSeoMeta(MetaSeo.get('Plan du site - Transition écologique des entreprises', description))
useSchemaOrg(defineWebPage({ description: description }))

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.SitemapPage)
    }
  ],
  ...MetaRobots.indexFollow()
})

// Chargement des données côté serveur
onServerPrefetch(async () => {
  // await new ProgramManager().getDependentCompanyData(false)
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  await new ProgramManager().getDependentCompanyData(false)
  await new ProjectManager().getProjects()
})

// Récupération des stores
const { programs, hasError: hasProgramError } = storeToRefs(useProgramStore())
const { projects, hasError: hasProjectError } = storeToRefs(useProjectStore())
const { hasSpinner } = storeToRefs(useNavigationStore())

const mainPages = [
  { name: RouteName.Homepage, label: 'Accueil' },
  { name: RouteName.About, label: 'Qui sommes-nous ?' },
  { name: RouteName.Faq, label: 'Questions fréquentes' },
  { name: RouteName.CatalogProjects, label: 'Catalogue des projets' },
  { name: RouteName.CatalogPrograms, label: 'Catalogue des aides' },
  { name: RouteName.QuestionnaireStart, label: 'Auto-diagnostic' }
]

const legalPages = [
  { name: RouteName.Statistics, label: 'Statistiques' },
  { name: RouteName.Budget, label: 'Budget' },
  { name: RouteName.Accessibility, label: 'Accessibilité' },
  { name: RouteName.PersonalData, label: 'Données personnelles' },
  { name: RouteName.Legal, label: 'Mentions légales' }
]

const sortedPrograms = computed(() => {
  return [...programs.value].sort((a, b) => a.titre.localeCompare(b.titre))
})

const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => a.title.localeCompare(b.title))
})

const loadingPrograms = computed(() => hasSpinner.value || hasProgramError.value)
const loadingProjects = computed(() => hasSpinner.value || hasProjectError.value)

const tableOfContents = computed(() => [
  {
    text: 'Pages principales',
    to: '#pages-principales'
  },
  {
    text: "Dispositifs d'aide",
    to: '#dispositifs-aide'
  },
  {
    text: 'Projets de transition',
    to: '#projets-transition'
  },
  {
    text: 'Informations légales',
    to: '#informations-legales'
  }
]) as unknown as DsfrSideMenuListItemProps[]
</script>
