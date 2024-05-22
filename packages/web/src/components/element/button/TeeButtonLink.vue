<template>
  <RouterLink
    class="fr-btn fr-btn--tertiary-no-outline"
    :class="[icon, ...classes]"
    :to="props.to"
  >
    <slot></slot>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

interface Props {
  to: RouteLocationRaw
  icon?: string
  iconOnly?: boolean
  iconRight?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  iconOnly: false,
  iconRight: false,
  icon: undefined
})

const classes = computed(() => {
  return [
    {
      'fr-btn--icon-only': props.iconOnly,
      'fr-btn--icon-right': !props.iconOnly && props.iconRight,
      'fr-btn--icon-left': !props.iconOnly && !props.iconRight
    }
  ]
})
</script>

<style scoped lang="scss">
.fr-btn {
  &:hover,
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
