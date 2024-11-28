<template>
  <DsfrHighlight
    class="fr-m-0 fr-p-0"
    :large="true"
  >
    <template #default>
      <div class="fr-container--fluid fr-p-4v">
        <div class="fr-grid-row fr-grid-row--middle">
          <img
            class="fr-col-2 fr-col-xs-2 fr-hidden fr-unhidden-sm fr-mr-8v"
            :src="img"
            :alt="altImg"
          />
          <div class="fr-col-9 fr-col-xs-12">
            <p class="fr-mb-4v">{{ text }}</p>
            <slot />
          </div>
        </div>
      </div>
    </template>
  </DsfrHighlight>
</template>
<script setup lang="ts">
interface Props {
  large: boolean
  img: string
  text: string
  altImg: string
}
defineProps<Props>()
</script>
