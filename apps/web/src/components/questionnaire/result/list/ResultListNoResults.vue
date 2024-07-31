<template>
  <div class="fr-col-9 fr-text-center">
    <ProgramListNoResults
      v-if="!countItems && !hasError"
      image="images/tracks/no-results.png"
      :message="{ fr: message }"
    />
    <TeeError
      v-else-if="hasError"
      :mailto="Contact.email"
      :email="Contact.email"
    />
  </div>
</template>

<script setup lang="ts">
import Contact from '@/utils/contact'
import ProgramListNoResults from '@/components/program/list/ProgramListNoResults.vue'

interface Props {
  hasError?: boolean
  countItems?: number
  message: string
}
defineProps<Props>()
</script>
