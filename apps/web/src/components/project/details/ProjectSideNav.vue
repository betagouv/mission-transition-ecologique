<template>
  <DsfrSideMenu class="fr-mr-2v fr-pr-0 fr-sticky">
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
import { Project } from '@/types'
import { Scroll } from '@/utils/scroll'

interface Props {
  project: Project
}
const props = defineProps<Props>()

const menuItems = computed(() => allMenuItems.filter((item) => item.condition !== false))

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    Scroll.to(element)
  }
}

const allMenuItems = [
  {
    id: 'project',
    to: `project-details-title`,
    text: "Qu'est ce que c'est ?",
    condition: props.project.longDescription.length > 0
  },
  {
    id: 'project-more',
    to: `project-more-details-title`,
    text: 'Pour aller plus loin',
    condition: props.project.moreDescription.length > 0
  },
  { id: 'aids', to: `project-aids-title`, text: 'Mes aides' },
  { id: 'contact', to: `project-form-title`, text: 'Contact' },
  {
    id: 'linked-project',
    to: `project-linked-projects-title`,
    text: 'Projets complémentaires',
    condition: props.project.linkedProjects.length > 0
  }
]
</script>
