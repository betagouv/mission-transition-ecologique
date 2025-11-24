<template>
  <figure class="fr-quote fr-quote--column">
    <blockquote :cite="testimony.externalLink">
      <div
        class=""
        v-html="Marked.toHtml(`« ${testimony.verbatim} »`, true, false)"
      />
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
      <div class="fr-quote__image">
        <img
          :src="testimony.authorImage ? img(testimony.authorImage, { width: 184, quality: 70, loading: 'lazy' }) : Identity.logoPath"
          class="fr-responsive-img"
          alt=""
        />
        <!-- L’alternative de l’image (attribut alt) doit rester vide car l’image est illustrative et ne doit pas être restituée aux technologies d’assistance (DSFR guidance)-->
      </div>
    </figcaption>
    <ul class="fr-grid-row fr-grid-row--left fr-raw-list fr-mt-md-2v">
      <li
        v-for="linkedProject in linkedProjectsTags"
        :key="linkedProject.id"
        class="fr-mr-2v"
      >
        <TeeProjectButton
          class="fr-my-1-5v"
          :project="linkedProject"
          :color="Color.blue"
          size="sm"
        />
      </li>
    </ul>
  </figure>
</template>

<script lang="ts" setup>
import { Identity } from '@/tools/identity'
import { Image } from '@/tools/image'
import { Marked } from '@/tools/marked'
import { ProjectManager } from '@/tools/project/projectManager'
import { ProjectType, Color, Testimony } from '@/types'

export type TestimonyProps = {
  testimony: Testimony
}

const props = defineProps<TestimonyProps>()

const linkedProjectsTags = ref<ProjectType[]>([])

onNuxtReady(async () => {
  if (props.testimony.projects) {
    await new ProjectManager().getProjects()
    const allLinkedProjectsTags = await useProjectStore().getProjectsFromIds(props.testimony.projects)
    const shuffled = allLinkedProjectsTags.sort(() => 0.5 - Math.random())
    linkedProjectsTags.value = shuffled.slice(0, 3)
  }
})

const img = Image.getUrl
</script>

<style lang="scss">
figure::before {
  content: none !important;
}

.fr-quote blockquote p {
  font-size: 1rem !important;
  line-height: 1.5rem !important;
  font-weight: 400 !important;
}

.fr-quote__author {
  --text-spacing: 0 0 0rem !important;
}
</style>
