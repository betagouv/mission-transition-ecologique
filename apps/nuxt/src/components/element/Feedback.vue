<script lang="ts" setup>
import { ConfigFeedback } from '@/tools/feedback/configFeedback'
import { FeedbackButtonPosition } from '@/tools/feedback/feedbackType'

defineProps<{ title: string; titleClass: string; position: FeedbackButtonPosition }>()
</script>

<template>
  <div>
    <p
      class="fr-mb-0"
      :class="titleClass"
    >
      {{ title }}
    </p>
    <p class="fr-mb-4v">Donnez-nous votre avis en 2 minutes.</p>
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
  </div>
</template>
