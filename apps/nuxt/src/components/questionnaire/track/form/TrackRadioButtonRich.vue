<script setup lang="ts">
import { type TrackOptionsInput } from '@/types'
import Translation from '@/tools/translation'

interface Props {
  option: TrackOptionsInput
  isActive: boolean
  index: number
}
const props = defineProps<Props>()

const emit = defineEmits<{
  updateSelection: []
}>()

const onSelect = () => {
  if (!props.isActive) {
    emit('updateSelection')
  }
}
</script>

<template>
  <div class="fr-fieldset__element fr-p-0 fr-mb-0">
    <div class="fr-radio-group fr-radio-rich">
      <input
        :id="`radio-rich-${index}`"
        :value="option.label?.[Translation.lang]"
        type="radio"
        name="radio-rich"
        :checked="isActive ? isActive : undefined"
        @click="onSelect"
      />
      <label
        class="fr-label fr-pl-22v"
        :for="`radio-rich-${index}`"
      >
        {{ option.label?.[Translation.lang] }}
      </label>
    </div>
  </div>
</template>
