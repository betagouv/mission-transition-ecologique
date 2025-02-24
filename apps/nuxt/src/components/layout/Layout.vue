<template>
  <slot
    v-if="breadcrumb"
    name="breadcrumb"
  >
    <TeeDsfrBreadcrumb :links="links" />
  </slot>
  <div
    v-if="$slots.top"
    class="fr-container--fluid"
  >
    <slot name="top"> </slot>
  </div>
  <div
    v-if="$slots.beforeDefault"
    :class="`${beforeDefaultClass ?? 'fr-container'}`"
  >
    <slot name="beforeDefault"> </slot>
  </div>
  <div :class="`fr-container${fluid ? '--fluid' : ''}`">
    <div class="fr-grid-row">
      <div
        v-if="$slots.sidemenu"
        class="fr-col-2 fr-col-hidden fr-col-md-3 fr-col-lg-2 fr-col-unhidden-md"
      >
        <div class="fr-sidemenu fr-pr-3v">
          <slot name="sidemenu"> </slot>
        </div>
      </div>
      <div
        class="fr-col-12"
        :class="$slots.sidemenu ? 'fr-col-md-9 fr-col-lg-10' : ''"
      >
        <slot> </slot>
      </div>
    </div>
  </div>
  <div
    v-if="$slots.bottom"
    class="fr-container--fluid"
  >
    <slot name="bottom"> </slot>
  </div>
</template>

<script setup lang="ts">
import { TeeDsfrBreadcrumbProps } from '@/components/element/TeeDsfrBreadcrumb.vue'
interface Props {
  breadcrumb?: boolean
  links?: TeeDsfrBreadcrumbProps['links']
  fluid?: boolean
  beforeDefaultClass?: string
}
withDefaults(defineProps<Props>(), {
  breadcrumb: true,
  links: undefined,
  beforeDefaultClass: undefined
})
</script>
