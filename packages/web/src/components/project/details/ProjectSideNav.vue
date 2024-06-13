<template>
  <DsfrSideMenu
    class="fr-ml-4v"
    :menu-items="menuItems"
  />
</template>
<script setup lang="ts">
import { DsfrSideMenuListProps } from '@gouvminint/vue-dsfr/types/components/DsfrSideMenu/DsfrSideMenu.types'

const menuItems: DsfrSideMenuListProps['menuItems'] = [
  { id: 'project', to: '#project-details', text: 'Le projet' },
  { id: 'project-more', to: '#project-more-details', text: 'Pour aller plus loin' },
  { id: 'aids', to: '#project-aids', text: 'Mes aides' },
  { id: 'contact', to: '#project-contact', text: 'Contact' },
  { id: 'linked-project', to: '#project-linked-projects', text: 'Projets complémentaires' }
]
</script>
