<template>
  <button
    class="fr-nav__btn fr-text--medium"
    :class="textColorClass"
    :aria-expanded="expanded"
    :aria-current="active || undefined"
    :aria-controls="id"
    @click="$emit('toggleId', id)"
  >
    <span>{{ title }}</span>
  </button>
  <div
    :id="id"
    ref="collapse"
    class="fr-collapse fr-menu"
    data-testid="navigation-menu"
    :class="{ 'fr-collapse--expanded': cssExpanded, 'fr-collapsing': collapsing }"
    @transitionend="onTransitionEnd(expanded)"
  >
    <ul class="fr-menu__list">
      <!-- @slot Slot par défaut pour le contenu de l’item de liste. Sera dans `<ul class="fr-menu__list">` -->
      <slot />
      <DsfrNavigationMenuItem
        v-for="(link, idx) of links"
        :key="idx"
      >
        <DsfrNavigationMenuLink
          v-bind="link"
          @toggle-id="$emit('toggleId', expandedId)"
        />
      </DsfrNavigationMenuItem>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch, onMounted } from 'vue'
import { DsfrNavigationMenuItem, DsfrNavigationMenuLink, DsfrNavigationMenuProps, getRandomId, useCollapsable } from '@gouvminint/vue-dsfr'
import { Color } from '@/types'

export type { DsfrNavigationMenuProps }

export type TeeDsfrNavigationMenuProps = DsfrNavigationMenuProps & {
  textColor?: Color
}

const props = withDefaults(defineProps<TeeDsfrNavigationMenuProps>(), {
  id: () => getRandomId('menu'),
  links: () => [],
  expandedId: '',
  textColor: 'black'
})

defineEmits<{ (event: 'toggleId', id: string): void }>()

const { collapse, collapsing, cssExpanded, doExpand, onTransitionEnd } = useCollapsable()

const expanded = computed(() => props.id === props.expandedId)

const textColorClass = computed(() => {
  if (props.textColor) {
    return [`fr-text--${props.textColor}`]
  }

  return []
})

watch(expanded, (newValue, oldValue) => {
  // @see https://github.com/GouvernementFR/dsfr/blob/main/src/core/script/collapse/collapse.js
  if (newValue !== oldValue) {
    doExpand(newValue)
  }
})

onMounted(() => {
  // NavigationMenu can be expanded by default
  // We need to trigger the expand animation at mounted
  if (expanded.value) {
    doExpand(true)
  }
})
</script>
<style lang="scss" scoped>
.fr-nav__btn {
  font-weight: 500;
}
</style>
