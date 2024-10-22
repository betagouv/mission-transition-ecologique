<template>
  <p
    v-if="!manual"
    class="fr-tag"
  >
    {{ infos.tagLabel }}
  </p>
  <div v-else>
    <span class="fr-hint-text fr-text--white tee-font-style--italic">
      {{ infos.description }}
    </span>
    <DsfrSelect
      v-model="selectedRegion"
      :error-message="selectedRegion ? '' : errorMessage"
      :options="regionsOptions"
    />
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetails } from '@/types'
import { Region } from '@/types'

interface Props {
  infos: RegisterDetails
  manual: boolean
}
const selectedRegion = ref()
const errorMessage = 'La sélection de la région est nécessaire'

const regionsOptions = Object.values(Region).map((regionName) => {
  return {
    value: regionName,
    text: regionName
  }
})
defineProps<Props>()
</script>
