<template>
  <a
    class="fr-btn fr-btn--secondary fr-btn--lg  fr-btn--icon-right fr-icon-mail-line"
    :href="externalLinks.placeDesEntreprises"
    target='_blank'
  >
    Nous contacter
  </a>
</template>

<script setup lang='ts'>

import { externalLinks } from '@/utils/global'
</script>
