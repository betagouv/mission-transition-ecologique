<template>
  <div
    id="project-sidemenu"
    class="fr-pr-0 fr-mt-6v"
  >
    <a
      v-for="item in menuItems"
      :key="item.id"
      :href="`#${item.to}`"
      class="fr-pl-4v"
      :class="[item.class ? item.class : 'fr-sidemenu__link', item.icon ? 'fr-btn--icon-left ' + item.icon : '']"
      @click.prevent="scrollTo(item.to)"
    >
      {{ item.text }}
    </a>
    <ProjectFiltersAccordion
      v-if="isDataFull"
      with-title
    />
  </div>
</template>
<script setup lang="ts">
import { ProjectType } from '@/types'
import { Scroll } from '@/tools/scroll'
import { testimonies } from '@tee/data/static'

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

const hasTestimony = computed(() => {
  if (!props.project) {
    return false
  }
  return testimonies.some((testimony) => testimony.projects?.includes(props.project!.id))
})

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
  {
    id: 'contact',
    to: `form-title`,
    text: 'Contact',
    condition: props.project.programs.length > 0 || isDataFull.value,
    class: 'fr-btn fr-radius-a--2v fr-text--white',
    icon: 'fr-icon-mail-line'
  },
  {
    id: 'linked-testimonies',
    to: `project-testimonies-title`,
    text: "Elles l'ont fait !",
    condition: hasTestimony.value
  },
  {
    id: 'linked-project',
    to: `project-linked-projects-title`,
    text: 'Prérequis',
    condition: props.project.linkedProjects.length > 0
  }
])
</script>
