<template>
  <ul class="fr-tags-group fr-justify-center">
    <li
      v-for="({ value, ...tagProps }, i) in tags"
      :key="i"
    >
      <TeeDsfrTag
        v-bind="tagProps"
        @click="model = value"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { TeeDsfrTagProps } from '@/components/element/tag/TeeDsfrTag.vue'

export interface TeeDsfrTagsProps {
  tags: TeeDsfrTagProps[]
}
withDefaults(defineProps<TeeDsfrTagsProps>(), {
  tags: () => []
})

const model = defineModel<string | number>()
</script>
