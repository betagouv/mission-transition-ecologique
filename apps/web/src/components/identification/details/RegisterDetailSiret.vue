<template>
  <p class="fr-tag">
    {{ infos.tagLabel }}
    <span
      class="fr-icon-close-line"
      @click="modifySiret"
    />
  </p>
</template>
<script lang="ts" setup>
import { RegisterDetails } from '@/types'
interface Props {
  infos: RegisterDetails
  manual: boolean
}
defineProps<Props>()
const emit = defineEmits<{
  modifySiret: []
}>()
const modifySiret = () => {
  emit('modifySiret')
}
</script>
