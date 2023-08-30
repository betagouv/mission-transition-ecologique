<template>
  <div class="fr-tile fr-enlarge-link">
    <!-- TITLE -->
    <div 
      class="fr-tile__body fr-px-3v fr-pb-3v fr-pt-0"
      style="justify-content: start;">
      <span 
        class="fr-tile__title fr-pb-3v"
        style="font-weight: normal; font-size: 0.7rem;">
        {{ title }}
      </span>
      <p 
        class="fr-tile__desc"
        style="font-weight: 700;">
        <span v-if="description">
          {{ description }}
        </span>
        <slot name="description"></slot>
      </p>
    </div>
    <!-- ILLUSTRATION -->
    <div class="fr-tile__header">
      <div 
        class="fr-tile__pictogram"
        style="text-align: center;">
        <img 
          class="fr-responsive-img fr-p-5v"
          :src="imagePath"
          :alt="`image / ${title}`"
          :style="`width: 95px`"
          />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  title: string,
  imagePath: string,
  description?: string,
  debug?: boolean,
}>()

</script>
