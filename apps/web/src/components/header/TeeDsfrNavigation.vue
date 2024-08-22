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
        <DsfrNavigationMenu
          v-else-if="(navItem as DsfrNavigationMenuProps).title && (navItem as DsfrNavigationMenuProps).links"
          v-bind="navItem as DsfrNavigationMenuProps"
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
import { ref, onMounted, onUnmounted } from 'vue'
import {
  DsfrNavigationItem,
  DsfrNavigationMegaMenu,
  DsfrNavigationMegaMenuProps,
  DsfrNavigationMenu,
  DsfrNavigationMenuLink,
  DsfrNavigationMenuLinkProps,
  DsfrNavigationMenuLinks,
  DsfrNavigationMenuProps,
  DsfrNavigationProps,
  getRandomId
} from '@gouvminint/vue-dsfr'

export type { DsfrNavigationMenuLinks, DsfrNavigationProps }

export type TeeDsfrNavigationProps = DsfrNavigationProps & {
  textColor: string
  menuAlignment: 'left' | 'right' | 'center'
}

const props = withDefaults(defineProps<TeeDsfrNavigationProps>(), {
  id: () => getRandomId('menu'),
  label: 'Menu principal',
  navItems: () => [],
  textColor: 'dark',
  menuAlignment: 'left'
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

:deep(.fr-nav__btn) {
  color: var(--text-active-blue-france);
  font-weight: 500;
}
</style>
