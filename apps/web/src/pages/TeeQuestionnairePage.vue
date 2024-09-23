<template>
  <div class="fr-container--fluid fr-container--fluid--no-overflow fr-px-0v fr-mt-0 fr-mb-10v">
    <router-view :key="useRoute().path" />
  </div>
  <ContactHelp v-if="useNavigationStore().isQuestionnaireResult()" />
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeQuestionnairePage > FUNCTION_NAME > MSG_OR_VALUE :`)

import ContactHelp from '@/components/contact/ContactHelp.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useRoute } from 'vue-router'
</script>
