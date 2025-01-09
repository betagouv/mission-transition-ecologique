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
import Navigation from '@/tools/navigation'
import Translation from '@/tools/translation'
import { Color } from '@/types'

interface Props {
  text: string
}
defineProps<Props>()
const openModal = () => {
  Navigation.toggleRegisterModal()
}
</script>
