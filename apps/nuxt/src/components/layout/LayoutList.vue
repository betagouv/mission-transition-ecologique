<template>
  <div
    v-if="$slots.counter || $slots.modalFilter"
    class="fr-grid-row fr-grid-row--center fr-mt-2v fr-mt-md-3v"
  >
    <div class="fr-pl-md-0 fr-col-5 fr-col-md-12 fr-col-content--middle fr-text--blue-france tee-font-style--italic fr-text--sm fr-mb-0">
      <slot name="counter" />
    </div>
    <div class="fr-col-7 fr-col-hidden-md fr-text-right">
      <slot name="modalFilter" />
    </div>
  </div>
  <ul
    v-if="$slots.default"
    class="fr-grid-row fr-grid-row--gutters fr-grid-row--center fr-grid-row-sm--left fr-my-2v fr-raw-list"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts"></script>
