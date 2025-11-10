<script lang="ts" setup>
import { FeedbackButtonPosition } from '@/tools/feedback/feedbackType'

defineProps<{ title: string; titleClass: string; position: FeedbackButtonPosition }>()
</script>

<template>
  <div>
    <p
      class="fr-mb-0"
      :class="titleClass"
      v-html="title"
    />
    <p class="fr-mb-4v">Donnez-nous votre avis en 2 minutes.</p>
    <FeedbackLink :position="position" />
  </div>
</template>
