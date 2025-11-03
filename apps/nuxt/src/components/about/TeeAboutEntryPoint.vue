<template>
  <section class="fr-my-3w">
    <h2>Le point d’entrée vers les aides à la transition écologique des entreprises</h2>
    <p>
      La plateforme <em>Transition écologique des entreprises</em> est un <strong>service public en ligne et gratuit</strong> qui accompagne
      les entreprises dans leur transition environnementale.
    </p>
    <p>Elle permet de :</p>
    <ol>
      <li class="fr-ml-1w"><strong>découvrir des idées de projets</strong> et d’actions de transition écologique pour votre entreprise.</li>
      <li class="fr-ml-1w">
        <strong>identifier la bonne aide</strong> pour votre entreprise (accompagnements, études, formations, financements…) issue de
        l’ensemble des partenaires publics.
      </li>
      <li class="fr-ml-1w"><strong>contacter un conseiller</strong> pour vous accompagner dans vos démarches.</li>
    </ol>
    <div class="fr-col-12 fr-mt-3w">
      <TeeDsfrButton @click="toCatalog()">
        <template #default> Je trouve les aides pour mon projet </template>
      </TeeDsfrButton>
    </div>

    <ul class="fr-grid-row fr-grid-row--center fr-grid-row-md--left fr-raw-list fr-mt-2w">
      <li
        v-for="project in sortedProjects"
        :key="project.id"
        class="fr-mr-4v"
      >
        <TeeProjectButton
          :project="project"
          class="fr-mt-2v"
          :color="Color.blue"
        />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { RouteName, Color } from '@/types'
import { useRouter } from 'vue-router'
import { ProjectManager } from '@/tools/project/projectManager'
import ProjectFilter from '@/tools/project/projectFilter'
import ProjectSorter from '@/tools/project/projectSorter'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project'

const router = useRouter()
function toCatalog() {
  router.push({ name: RouteName.CatalogPrograms })
}

onServerPrefetch(async () => {
  await new ProjectManager().getProjects()
})

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
})

const { projects } = storeToRefs(useProjectStore())
const filteredProjects = ProjectFilter.filterByHighlight(projects)
const sortedProjects = computed(() => {
  console.log(projects)
  return ProjectSorter.byHighlight(filteredProjects.value)
})
</script>
