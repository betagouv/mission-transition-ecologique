<template>
  <!-- MAIN APP COMPONENT  -->
    <div
      class="fr-container--fluid fr-px-20v fr-pb-20v fr-mt-10v fr-mb-20v"
      style="min-height: 800px">
      <WidgetApp
        :seed="'track_help'"
        :showHeaderBool="false"
        :showFooterBool="false"
        :disable-widget="true"
        :locale="'fr'"
      />
    </div>
</template>

<script setup lang="ts">

// @ts-ignore
import WidgetApp from '../../WidgetApp.ce.vue'

</script>