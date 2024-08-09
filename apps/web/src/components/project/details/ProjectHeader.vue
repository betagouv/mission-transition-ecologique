<template>
  <TeeDsfrBreadcrumb :links="links" />
  <TeeEligibilityCriteriaBar
    v-if="!navigationStore.isCatalogProjectDetail"
    :bg-color="Color.blueLightnessed"
    :bg-bar-color="Color.blueLighted"
  />
  <div class="fr-mb-4v background-project-title">
    <img
      :src="project.image"
      :alt="`image / ${project.title}`"
    />
    <div
      class="project-title-gradient"
      :class="`fr-gradient--${themeColor}`"
    >
      <div class="fr-container">
        <div class="fr-grid-row fr-grid-row--bottom">
          <div class="fr-col-9 fr-col-sm-9 fr-col-xs-12 fr-col-offset-sm-3 fr-h1 fr-text-left fr-pb-8v project-title">
            {{ project.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Color, Project } from '@/types'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'

interface Props {
  project: Project
  themeColor?: Color
}
const props = defineProps<Props>()

const links = ref<DsfrBreadcrumbProps['links']>([{ text: props.project.title }])
</script>

<style scoped lang="scss">
.background-project-title {
  position: relative;
  height: 400px;

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    object-fit: cover;
  }
}

.project-title-gradient {
  height: 100%;
  position: relative;

  .fr-container {
    height: 100%;
  }

  .fr-grid-row {
    height: 100%;
  }
}

.project-title {
  z-index: 100;
  padding: 0.75rem 1rem;
}
</style>
