<template>
  <TeeDsfrHighlight
    :color="Color.yellow"
    :large="true"
    :text="text"
    img="/images/tracks/ecriture.svg"
    alt-img="image / ecriture"
  >
    <TeeDsfrButton
      class="fr-text--bold fr-btn-bg--blue-agir"
      :label="buttonLabel"
      @click="openModal"
    />
  </TeeDsfrHighlight>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import Translation from '@/tools/translation'
import { Color } from '@/types'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

interface Props {
  text: string
  buttonLabel?: string
  setHash?: string
}

const props = withDefaults(defineProps<Props>(), {
  buttonLabel: Translation.t('results.eligibilityCheckCTA'),
  setHash: ''
})

const openModal = () => {
  Navigation.toggleRegisterModal()

  if (props.setHash) {
    router.replace({
      name: route.name,
      params: route.params,
      query: route.query,
      hash: '#' + props.setHash
    })
  }
}
</script>
