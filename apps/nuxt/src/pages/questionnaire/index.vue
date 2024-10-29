<template>
  <div
    class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v"
    style="min-height: 800px"
  >
    <TeeQuestionnaire :track-id="TrackId.QuestionnaireRoute" />
    <ContactHelp v-if="useNavigationStore().isByRouteName(RouteName.QuestionnaireResult)" />
  </div>
</template>

<script setup lang="ts">
import ContactHelp from '@/components/contact/ContactHelp.vue'
import { useNavigationStore } from '@/stores/navigation'
import { TrackId } from '@/types'
import { RouteName } from '@/types/routeType'

definePageMeta({
  name: RouteName.QuestionnaireStart
})
</script>
