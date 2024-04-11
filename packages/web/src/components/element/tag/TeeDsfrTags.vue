<template>
  <ul class="fr-tags-group">
    <li
      v-for="({ value, ...tagProps }, i) in tags"
      :key="i"
    >
      <DsfrTag
        v-bind="tagProps"
        @click="model = value"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { DsfrTag, DsfrTagProps } from '@gouvminint/vue-dsfr'

export interface TeeDsfrTag extends DsfrTagProps {
  'aria-pressed'?: boolean
  class?: string
  value?: string | number
}

export interface TeeDsfrTags {
  tags: TeeDsfrTag[]
}
withDefaults(defineProps<TeeDsfrTags>(), {
  tags: () => []
})

const model = defineModel<string | number>()
</script>
