<template>
  <li class="fr-footer__bottom-item">
    <TeeDsfrButton
      label="Gestion des cookies"
      aria-controls="fr-consent-modal"
      class="fr-footer__bottom-link fr-btn--tertiary-no-outline"
      @click="openConsent"
    />
  </li>
</template>
<script setup lang="ts">
import Cookie from '@/utils/cookies'

const openConsent = () => {
  const modal = document.getElementById('fr-consent-modal')
  if (modal) {
    modal.classList.add('fr-modal--opened')
    Cookie.setCookies()
  }
}
</script>
