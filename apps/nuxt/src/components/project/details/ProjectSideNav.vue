<template>
  <TeeSideMenu :items="allMenuItems">
    <ProjectFiltersAccordion
      v-if="isDataFull"
      with-title
    />
  </TeeSideMenu>
</template>
<script setup lang="ts">
import { ProjectType } from '@/types'
import { Testimony } from '@/types'

const { default: testimoniesJson } = await import('@/public/json/testimony/testimonies.json')
const testimonies = testimoniesJson as unknown as Testimony[]

interface Props {
  project: ProjectType
}
const props = defineProps<Props>()

const { isDataFull } = storeToRefs(useCompanyDataStore())

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
    text: props.project.titleLongDescription ? 'Pourquoi ?' : "Qu'est ce que c'est ?",
    condition: props.project.longDescription.length > 0
  },
  {
    id: 'project-more',
    to: `project-more-details-title`,
    text: props.project.titleMoreDescription ? 'Me documenter' : 'Pour aller plus loin',
    condition: props.project.moreDescription.length > 0
  },
  {
    id: 'aids',
    to: `aides`,
    text: isDataFull.value ? 'Vos aides' : 'Toutes les aides',
    condition: props.project.programs.length > 0 || isDataFull.value
  },
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
  },
  {
    id: 'project-faq',
    to: `project-faq-projects-title`,
    text: 'Questions fréquentes',
    condition: props.project?.faqs?.length > 0
  }
])
</script>
