<template>
  <div class="fr-text-center">
    <TeeNoResult
      v-if="!countItems && !hasError"
      :message="message"
    />
    <TeeError
      v-else-if="hasError"
      class="fr-py-32v"
      :mailto="Contact.email"
      :email="Contact.email"
    />
  </div>
</template>

<script setup lang="ts">
import Contact from '@/utils/contact'

interface Props {
  hasError?: boolean
  countItems?: number
  message?: string
}
defineProps<Props>()
</script>
