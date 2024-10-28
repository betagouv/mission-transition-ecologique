<template>
  <p
    id="tag-siret"
    class="fr-tag fr-bg--blue-france--lightness"
  >
    {{ siretTagLabel }}
    <span
      class="fr-icon-close-line"
      @click="modifySiret"
    />
  </p>
</template>
<script lang="ts" setup>
import { RegisterDetails } from '@/types'
import Breakpoint from '@/utils/breakpoints'

interface Props {
  infos: RegisterDetails
  manual: boolean
}
const props = defineProps<Props>()
const siretTagLabel = computed(() => {
  if (Breakpoint.isMobile()) {
    return `${props.infos.tagLabel} \n SIRET ${props.infos.value}`
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
