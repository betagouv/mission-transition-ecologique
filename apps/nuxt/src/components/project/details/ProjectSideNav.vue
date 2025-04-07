<template>
  <DsfrSideMenu
    id="project-sidemenu"
    class="fr-pr-0"
  >
    <template #default>
      <a
        v-for="item in menuItems"
        :key="item.id"
        :href="`#${item.to}`"
        class="fr-sidemenu__link"
        @click.prevent="scrollTo(item.to)"
      >
        {{ item.text }}
      </a>
    </template>
  </DsfrSideMenu>
</template>
<script setup lang="ts">
import { ProjectType } from '@/types'
import { Scroll } from '@/tools/scroll'

interface Props {
  project: ProjectType
}
const props = defineProps<Props>()

const { isDataFull } = storeToRefs(useCompanyDataStore())

const menuItems = computed(() => allMenuItems.value.filter((item) => item.condition))

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    Scroll.to(element)
  }
}

const allMenuItems = computed(() => [
  {
    id: 'project',
    to: `project-description-details-title`,
    text: "Qu'est ce que c'est ?",
    condition: props.project.longDescription.length > 0
  },
  {
    id: 'project-more',
    to: `project-more-details-title`,
    text: 'Pour aller plus loin',
    condition: props.project.moreDescription.length > 0
  },
  { id: 'aids', to: `project-aids-title`, text: 'Mes aides', condition: props.project.programs.length > 0 || isDataFull.value },
  { id: 'contact', to: `form-title`, text: 'Contact', condition: props.project.programs.length > 0 || isDataFull.value },
  {
    id: 'linked-project',
    to: `project-linked-projects-title`,
    text: 'Prérequis',
    condition: props.project.linkedProjects.length > 0
  }
])
</script>
