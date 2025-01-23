<template>
  <p
    id="tag-siret"
    class="fr-tag fr-mb-4v fr-bg--blue--lightness"
  >
    <span
      class="fr-pr-4v"
      v-html="siretTagLabel"
    />
    <span
      class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
      @click="modifySiret"
    />
  </p>
</template>
<script lang="ts" setup>
import { RegisterDetails } from '@/types'
import Breakpoint from '@/tools/breakpoints'

interface Props {
  infos: RegisterDetails
  manual: boolean
}
const props = defineProps<Props>()
const siretTagLabel = computed(() => {
  if (Breakpoint.isMobile()) {
    return `${props.infos.tagLabel} <br> SIRET ${props.infos.value}`
  }
  return `${props.infos.tagLabel} - SIRET ${props.infos.value} `
})
const emit = defineEmits<{
  'update:siret': []
}>()
const modifySiret = () => {
  emit('update:siret')
}
</script>
<style scoped lang="scss">
#tag-siret {
  white-space: pre-line;
}
</style>
