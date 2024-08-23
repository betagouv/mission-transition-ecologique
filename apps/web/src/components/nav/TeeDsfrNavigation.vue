<template>
  <nav
    :id="id"
    class="fr-nav"
    role="navigation"
    :aria-label="label"
    :class="`tee-menu--${menuAlignment}`"
  >
    <ul class="fr-nav__list">
      <!-- @slot Slot par défaut pour le contenu de la liste. Sera dans `<ul class="fr-nav__list">` -->
      <slot />
      <DsfrNavigationItem
        v-for="(navItem, idx) of navItems"
        :key="idx"
      >
        <DsfrNavigationMenuLink
          v-if="(navItem as DsfrNavigationMenuLinkProps).to && (navItem as DsfrNavigationMenuLinkProps).text"
          v-bind="navItem"
          :expanded-id="expandedMenuId"
          @toggle-id="toggle($event)"
        />
        <!-- @vue-ignore -->
        <TeeDsfrNavigationMenu
          v-else-if="(navItem as DsfrNavigationMenuProps).title && (navItem as DsfrNavigationMenuProps).links"
          v-bind="navItem as DsfrNavigationMenuProps"
          :text-color="textColor"
          :expanded-id="expandedMenuId"
          @toggle-id="toggle($event)"
        />
        <!-- @vue-ignore -->
        <DsfrNavigationMegaMenu
          v-else-if="(navItem as DsfrNavigationMegaMenuProps).title && (navItem as DsfrNavigationMegaMenuProps).menus"
          v-bind="navItem as DsfrNavigationMegaMenuProps"
          :expanded-id="expandedMenuId"
          @toggle-id="toggle($event)"
        />
      </DsfrNavigationItem>
    </ul>
  </nav>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import {
  DsfrNavigationItem,
  DsfrNavigationMegaMenu,
  DsfrNavigationMegaMenuProps,
  DsfrNavigationMenuLink,
  DsfrNavigationMenuLinkProps,
  DsfrNavigationMenuLinks,
  DsfrNavigationMenuProps,
  DsfrNavigationProps,
  getRandomId
} from '@gouvminint/vue-dsfr'
import { Color } from '@/types'

export type { DsfrNavigationMenuLinks, DsfrNavigationProps }

export type TeeDsfrNavigationProps = DsfrNavigationProps & {
  menuAlignment: 'left' | 'right' | 'center'
  textColor?: Color
}

const props = withDefaults(defineProps<TeeDsfrNavigationProps>(), {
  id: () => getRandomId('menu'),
  label: 'Menu principal',
  navItems: () => [],
  menuAlignment: 'left',
  textColor: Color.black
})

const expandedMenuId = ref<string | undefined>(undefined)

const toggle = (id: string | undefined) => {
  if (id === expandedMenuId.value) {
    expandedMenuId.value = undefined
    return
  }
  expandedMenuId.value = id
}

const handleElementClick = (el: HTMLElement) => {
  if (el === document.getElementById(props.id)) {
    return
  }

  if (!el?.parentNode) {
    toggle(expandedMenuId.value)
    return
  }

  handleElementClick(el.parentNode as HTMLElement)
}

const onDocumentClick = (e: MouseEvent) => {
  handleElementClick(e.target as HTMLElement)
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    toggle(expandedMenuId.value)
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeyDown)
})
</script>
<style lang="scss" scoped>
.fr-nav__list {
  position: relative;
}

.tee-menu {
  &--right {
    :deep(.fr-menu) {
      position: absolute;
      right: -1rem;
    }
  }
  &--center {
    :deep(.fr-menu) {
      position: absolute;
      right: -100%;
    }
  }
}
</style>
