<template>
  <DsfrBreadcrumb
    class="fr-pl-10v"
    :links="[...baseLinks, ...links]"
  />
</template>
<script setup lang="ts">
import type { DsfrBreadcrumbProps } from '@gouvminint/vue-dsfr'
import { useNavigationStore } from '@/stores/navigation'
import { useUsedTrackStore } from '@/stores/usedTrack'

interface Props {
  links: DsfrBreadcrumbProps['links']
}
const navigationStore = useNavigationStore()
const usedTrackStore = useUsedTrackStore()

const questionnaireRoute = computed(() => {
  const trackId = usedTrackStore.getPreviousCompletedUsedTrackId()
  if (trackId) {
    return navigationStore.routeByTrackId(trackId)
  }
  return '/questionnaire'
})

const baseLinks = ref<DsfrBreadcrumbProps['links']>([
  { text: 'Accueil', to: '/' },
  { text: 'Questionnaire', to: questionnaireRoute.value }
])
defineProps<Props>()
</script>
