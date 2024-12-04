<template>
  <TeeDsfrHighlight
    :color="Color.yellow"
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
  </TeeDsfrHighlight>
</template>
<script setup lang="ts">
import Translation from '@/utils/translation'

import Navigation from '@/utils/navigation'
import { Color } from '@/types'

interface Props {
  text: string
}
defineProps<Props>()
const openModal = () => {
  Navigation.toggleRegisterModal()
}
</script>
