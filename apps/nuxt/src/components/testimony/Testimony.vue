<template>
  <figure class="fr-quote fr-quote--column fr-my-4w">
    <blockquote :cite="testimony.externalLink">
      <p>« {{ testimony.verbatim }} »</p>
    </blockquote>

    <figcaption>
      <p class="fr-quote__author">
        {{ testimony.authorName }}
      </p>

      <ul class="fr-quote__source">
        <li>
          <cite>{{ testimony.authorFunction }}</cite>
        </li>
      </ul>
      <div class="fr-ml-12w fr-ml-md-0">
        <ul class="fr-grid-row fr-grid-row--left fr-raw-list">
          <li
            v-for="linkedProject in linkedProjectsTags"
            :key="linkedProject.id"
            class="fr-mr-2v"
          >
            <TeeProjectButton
              class="fr-my-1-5v"
              target="_blank"
              :project="linkedProject"
              :color="Color.blue"
            />
          </li>
        </ul>
      </div>
      <div
        v-if="testimony.authorImage"
        class="fr-quote__image"
      >
        <img
          :src="testimony.authorImage"
          class="fr-responsive-img"
          alt=""
        />
        <!-- L’alternative de l’image (attribut alt) doit rester vide car l’image est illustrative et ne doit pas être restituée aux technologies d’assistance (DSFR guidance)-->
      </div>
    </figcaption>
  </figure>
</template>

<script lang="ts" setup>
import { ProjectManager } from '@/tools/project/projectManager'
import { ProjectType, Color, Testimony } from '@/types'

export type TestimonyProps = {
  testimony: Testimony
}

const props = defineProps<TestimonyProps>()

const linkedProjectsTags = ref<ProjectType[]>([])

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
  linkedProjectsTags.value = await useProjectStore().getProjectsFromIds(props.testimony.projects)
})
</script>

<style scoped lang="scss">
figure::before {
  content: none !important;
}
</style>
