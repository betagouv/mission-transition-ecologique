<template>
  <TeeDsfrBreadcrumb :links="links" />
  <TeeEligibilityCriteriaBar
    v-if="!navigationStore.isCatalogProjectDetail()"
    :bg-color="Color.purpleLightnessed"
    :bg-bar-color="Color.purpleLighted"
  />
  <TeeBanner
    :bg-color="themeColor"
    :has-gradient="true"
    :bg-image="project.image"
    :img-alt="`image / ${project.title}`"
    :content-alignment="{ v: 'bottom', h: 'left' }"
    class="project-header"
  >
    <template #title>
      <div class="fr-col-12 fr-col-sm-9 fr-col-offset-sm-3 fr-text-left fr-pb-8v">
        <h1 class="fr-gradient__title">{{ project.title }}</h1>
      </div>
    </template>
  </TeeBanner>
</template>
<script setup lang="ts">
import { Color, Project } from '@/types'
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  project: Project
  themeColor?: Color
}
const props = defineProps<Props>()

const navigationStore = useNavigationStore()

const links = ref<DsfrBreadcrumbProps['links']>([{ text: props.project.title }])
</script>

<style scoped lang="scss">
.project-header {
  height: 400px;
}
</style>
