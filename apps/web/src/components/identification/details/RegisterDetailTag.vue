<template>
  <p class="fr-tag">
    {{ label }}
    <span
      v-if="editable"
      class="fr-icon-close-line"
      @click="modifyValue"
    />
  </p>
</template>
<script lang="ts" setup>
import { RegisterDetailType } from '@/types'

interface Props {
  label: string
  editable: boolean
  manual: boolean
  type: RegisterDetailType
}
const props = defineProps<Props>()
const emit = defineEmits<{
  modifyField: [RegisterDetailType]
}>()
const modifyValue = () => {
  emit('modifyField', props.type)
}
</script>
