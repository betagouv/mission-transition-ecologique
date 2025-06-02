<template>
  <a
    :href="props.href"
    :class="computedClass"
    class="fr-btn fr-btn--secondary fr-btn--icon-left"
    target="_blank"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
interface Props {
  href: string
  variant?: 'small-purple' | 'large-question'
}
const props = withDefaults(defineProps<Props>(), {
  href: '',
  variant: 'small-purple'
})

const computedClass = computed(() => {
  switch (props.variant) {
    case 'small-purple':
      return 'fr-icon-external-link-fill small-purple'
    case 'large-question':
      return 'fr-icon-chat-3-line fr-btn--lg'
    default:
      return ''
  }
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/setting';

[target='_blank']::after,
[target='_blank'][class*=' fr-fi-']::after,
[target='_blank'][class*=' fr-icon-']::after,
[target='_blank'][class^='fr-fi-']::after,
[target='_blank'][class^='fr-icon-']::after {
  content: none;
}

a.small-purple {
  box-shadow: inset 0 0 0 1px setting.$purple;
  color: setting.$purple;
  text-align: center;
  font-size: 0.875rem;
}
</style>
