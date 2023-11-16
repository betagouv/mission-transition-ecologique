<template>
  <!-- MAIN APP COMPONENT  -->
  <div
    class="fr-container--fluid fr-px-20v fr-pb-20v fr-mt-10v fr-mb-20v"
    style="min-height: 800px">
    <router-view/>
  </div>

  <TeeContact />
</template>

<script setup lang="ts">

// @ts-ignore
import TeeContact from '@/components/home/TeeContact.vue'

</script>