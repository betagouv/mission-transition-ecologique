<template>
  <div class="fr-container--fluid fr-container--iframe">
    <iframe
      :src="Contact.iframeSrc"
      class="contact-iframe"
      title="Place des entreprise - france-transition-ecologique"
      sandbox="allow-forms allow-scripts allow-same-origin"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import Contact from '@/utils/contact'
</script>

<style scoped lang="scss">
.fr-container--iframe {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.contact-iframe {
  flex-grow: 1;
  overflow: hidden;
}
</style>
