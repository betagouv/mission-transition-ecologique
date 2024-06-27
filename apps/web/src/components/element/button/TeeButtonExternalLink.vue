<template>
  <a
    :href="props.href"
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-external-link-fill"
    target="_blank"
  >
    <slot />
  </a>
</template>

<script setup lang="ts">
interface Props {
  href: string
}
const props = withDefaults(defineProps<Props>(), {
  href: ''
})
</script>

<style scoped lang="scss">
@import '../../../assets/scss/setting/color';

[target='_blank']:after,
[target='_blank'][class*=' fr-fi-']:after,
[target='_blank'][class*=' fr-icon-']:after,
[target='_blank'][class^='fr-fi-']:after,
[target='_blank'][class^='fr-icon-']:after {
  content: none;
}
a {
  box-shadow: inset 0 0 0 1px $base-purple;
  color: $base-purple;
  text-align: center;
  font-size: 0.875rem;
}
</style>
