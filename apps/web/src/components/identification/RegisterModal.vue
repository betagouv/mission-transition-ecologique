<template>
  <div
    id="register-modal"
    class="fr-bg--blue-france"
  >
    <div class="fr-container">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-h1 fr-col-12 fr-col-justify--left fr-py-4v fr-text--yellow">{{ Translation.t('registration.mainTitle') }}</div>
        <div class="fr-text--yellow fr-col-justify--left fr-pb-8v fr-col-12">{{ Translation.t('registration.description') }}</div>
        <RegisterSiret class="fr-col-12" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Translation from '@/utils/translation'
</script>
<style lang="scss" scoped>
#register-modal {
  position: fixed;
  top: 60px; /* Correspond à la hauteur de la bannière */
  left: 0;
  right: 0;
  height: fit-content;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Assurez-vous que la modal soit au-dessus des autres éléments */
}
</style>
