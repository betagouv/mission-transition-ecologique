<template>
  <!-- MAIN APP COMPONENT  -->
    <div
      class="fr-container--fluid fr-p-20v fr-my-20v "
      style="min-height: 800px">
      <WidgetApp
        :seed="'track_help'"
        :showHeaderBool="false"
        :showFooterBool="false"
        :noLocalMatomo="true"
        :noLocalStyles="true"
        :locale="'fr'"
      />
    </div>
</template>

<script setup lang="ts">

// @ts-ignore
import WidgetApp from '../../WidgetApp.ce.vue'

</script>