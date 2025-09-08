<script lang="ts" setup>
import { FaqJson } from '@/tools/faq/FaqJson'
import { FaqPage } from '@/types'
import Navigation from '@/tools/navigation'

interface Props {
  faqPage: FaqPage
  hasSideMenu: boolean
}
defineProps<Props>()
</script>

<template>
  <div class="fr-grid-row">
    <div class="fr-bg--blue--lightness fr-col-12 fr-py-0-5v fr-mt-8v fr-mb-8v"></div>
    <div
      :class="Navigation.getClassesBySideMenu(hasSideMenu)"
      class="fr-col-12 fr-text-center fr-text-left-md fr-pt-6v fr-flex-direction--column"
    >
      <h2 class="fr-mb-2v fr-text--blue-france">Questions fréquentes</h2>
      <p class="fr-mb-8v fr-text-center fr-text-left-md fr-text--blue-france">
        Trouvez ici des réponses concrètes sur les aides, démarches et outils pour réussir votre transition écologique.
      </p>
    </div>
  </div>
  <Faq :faq-items="FaqJson.pages[faqPage]" />
</template>
