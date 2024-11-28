<template>
  <TeeHighlight
    class="fr-highlight-border--yellow fr-highlight-bg--yellow--lightness fr-m-0 fr-p-0"
    :large="true"
    :text="text"
    img="/images/tracks/ecriture.svg"
    alt-img="image / ecriture"
  >
    <TeeDsfrButton
      class="fr-text--yellow fr-text--bold"
      :label="Translation.t('results.noResultCTA')"
      @click="openModal"
    />
  </TeeHighlight>
</template>
<script setup lang="ts">
import Translation from '@/utils/translation'

import Navigation from '@/utils/navigation'

interface Props {
  text: string
}
defineProps<Props>()
const openModal = () => {
  Navigation.toggleRegisterModal()
}
</script>
