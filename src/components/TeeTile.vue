<template>
  <div class="fr-tile fr-enlarge-link">
    <div class="fr-tile__body fr-p-3v">
      <h4 class="fr-tile__title">
        {{ title }}
      </h4>
      <p class="fr-tile__desc">
        <span v-if="description">
          {{ description }}
        </span>
        <slot name="description"></slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  title: string,
  description: string,
  debug?: boolean,
}>()

</script>
