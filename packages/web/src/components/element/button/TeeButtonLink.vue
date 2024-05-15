<template>
  <RouterLink
    class="fr-btn fr-btn fr-btn--tertiary-no-outline fr-btn--icon-left"
    :class="icon"
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
  iconRight: false
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
