<template>
  <RouterLink
    class="fr-btn fr-btn--tertiary-no-outline fr-btn-bg"
    :class="[icon, classes]"
    :target="target"
    :to="props.to"
  >
    <slot />
  </RouterLink>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

interface Props {
  to: RouteLocationRaw
  icon?: string
  iconOnly?: boolean
  target?: string
  iconRight?: boolean
  size?: 'sm' | 'md' | 'lg'
  secondary?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  iconOnly: false,
  iconRight: false,
  icon: undefined,
  target: undefined,
  size: 'md',
  secondary: false
})

const classes = computed(() => {
  return {
    'fr-btn--icon-only': props.iconOnly,
    'fr-btn--icon-right': !props.iconOnly && props.iconRight,
    'fr-btn--icon-left': !props.iconOnly && !props.iconRight,
    'fr-btn--sm': props.size === 'sm',
    'fr-btn--lg': props.size === 'lg',
    'fr-btn--md': props.size === 'md',
    'fr-btn--secondary': props.secondary
  }
})
</script>
