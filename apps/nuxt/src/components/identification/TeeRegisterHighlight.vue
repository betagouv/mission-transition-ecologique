<template>
  <DsfrHighlight
    class="fr-highlight-border--yellow fr-highlight-bg--yellow--lightness fr-m-0 fr-p-0"
    :large="true"
  >
    <template #default>
      <div class="fr-container--fluid fr-p-4v">
        <div class="fr-grid-row fr-grid-row--middle">
          <img
            class="fr-col-2 fr-col-xs-2 fr-hidden fr-unhidden-sm fr-mr-8v"
            src="/images/tracks/ecriture.svg"
            alt="image / ecriture"
          />
          <div class="fr-col-9 fr-col-xs-12">
            <p class="fr-mb-4v">{{ text }}</p>
            <TeeDsfrButton
              class="fr-text--yellow fr-text--bold"
              :label="Translation.t('results.noResultCTA')"
              @click="openModal"
            />
          </div>
        </div>
      </div>
    </template>
  </DsfrHighlight>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import Translation from '@/tools/translation'

interface Props {
  text: string
}
defineProps<Props>()
const openModal = () => {
  Navigation.toggleRegisterModal()
}
</script>
