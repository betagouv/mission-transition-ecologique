<template>
  <a
    class="fr-btn fr-btn--secondary fr-btn--lg fr-btn--icon-right fr-icon-mail-line"
    :href="Contact.mailTo"
  >
    Nous contacter
  </a>
</template>

<script setup lang="ts">
import Contact from '@/tools/contact'
</script>
