<script lang="ts" setup>
import { ConfigFeedback } from '@/tools/feedback/configFeedback'
import type { FeedbackButtonPosition } from '@/tools/feedback/feedbackType'

defineProps<{
  position: FeedbackButtonPosition
}>()
</script>

<template>
  <a
    :href="ConfigFeedback.getUrl(position)"
    target="_blank"
    title="Je donne mon avis - nouvelle fenêtre"
    class="fr-bg--none"
  >
    <img
      src="https://jedonnemonavis.numerique.gouv.fr/static/bouton-bleu-clair.svg"
      alt="Je donne mon avis"
      loading="lazy"
      height="80px"
    />
  </a>
</template>
