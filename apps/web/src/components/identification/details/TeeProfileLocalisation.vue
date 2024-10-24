<template>
  <p
    v-if="!manual"
    class="fr-tag fr-bg--blue-france--lightness"
  >
    {{ infos.tagLabel }}
  </p>
  <DsfrSelect
    v-else
    v-model="selectedRegion"
    :default-unselected-text="infos.description"
    :options="regionsOptions"
  />
</template>
<script lang="ts" setup>
import { RegisterDetail } from '@/types'
import { Region } from '@/types'

interface Props {
  infos: RegisterDetail
  manual: boolean
}
const selectedRegion = defineModel<Region>()

const regionsOptions = Object.values(Region).map((regionName) => {
  return {
    value: regionName,
    text: regionName
  }
})
defineProps<Props>()
</script>
