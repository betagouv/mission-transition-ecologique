<template>
  <ul class="fr-tags-group fr-justify-center">
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

export interface TeeDsfrTagProps extends DsfrTagProps {
  'aria-pressed'?: boolean
  class?: string
  value?: string | number
}

export interface TeeDsfrTagsProps {
  tags: TeeDsfrTagProps[]
}
withDefaults(defineProps<TeeDsfrTagsProps>(), {
  tags: () => []
})

const model = defineModel<string | number>()
</script>
