<template>
  <div
    v-if="$slots.beforeBreadcrumb"
    class="fr-container--fluid"
  >
    <slot name="beforeBreadcrumb"> </slot>
  </div>
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
  <div
    :class="`fr-container${fluid ? '--fluid' : ''}`"
    class="fr-mb-8v"
  >
    <div class="fr-grid-row">
      <div
        v-if="$slots.sidemenu"
        class="fr-col-2 fr-col-hidden fr-col-md-3 fr-col-lg-2 fr-col-unhidden-md"
      >
        <div
          class="fr-sidemenu fr-pr-3v"
          :class="`${stickyMenu ? 'fr-sidemenu--sticky' : ''}`"
        >
          <slot name="sidemenu"> </slot>
        </div>
      </div>
      <main
        class="fr-col-12"
        :class="$slots.sidemenu ? 'fr-col-md-9 fr-col-lg-10' : ''"
      >
        <slot> </slot>
      </main>
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
  stickyMenu?: boolean
}
withDefaults(defineProps<Props>(), {
  breadcrumb: true,
  links: undefined,
  beforeDefaultClass: undefined
})
</script>
