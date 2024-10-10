<template>
  <div class="fr-col-9 fr-text-center">
    <TeeNoResult
      v-if="!countItems && !hasError"
      message="Aucune aide n'a pu être identifiée avec les critères choisis..."
    />
    <TeeError
      v-else-if="hasError"
      :mailto="Contact.email"
      :email="Contact.email"
    />
  </div>
</template>

<script setup lang="ts">
import Contact from '@/tools/contact'

interface Props {
  hasError?: boolean
  countItems?: number
}
defineProps<Props>()
</script>
