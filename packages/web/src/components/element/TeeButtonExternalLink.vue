<template>
  <a
    :href="props.href"
    class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-external-link-fill tee-external-link-button"
    target="_blank"
  >
    <slot></slot>
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
@import '../../assets/scss/_colors.scss';

[target='_blank']:after,
[target='_blank'][class*=' fr-fi-']:after,
[target='_blank'][class*=' fr-icon-']:after,
[target='_blank'][class^='fr-fi-']:after,
[target='_blank'][class^='fr-icon-']:after {
  content: none;
}
.tee-external-link-button {
  box-shadow: inset 0 0 0 1px $secondary-purple;
  color: $secondary-purple !important;
  text-align: center;
  font-size: 14px;
}
</style>
