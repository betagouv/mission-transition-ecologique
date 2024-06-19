<template>
  <DsfrSideMenu
    class="fr-ml-4v"
    :menu-items="menuItems"
  />
</template>
<script setup lang="ts">
import { DsfrSideMenuListProps } from '@gouvminint/vue-dsfr/types/components/DsfrSideMenu/DsfrSideMenu.types'
import { useNavigationStore } from '@/stores/navigation'

const route = useNavigationStore().route
const fullPath = route?.fullPath.split('#')[0]
const menuItems: DsfrSideMenuListProps['menuItems'] = [
  { id: 'project', to: `${fullPath}#project-details`, text: 'Le projet' },
  { id: 'project-more', to: `${fullPath}#project-more-details`, text: 'Pour aller plus loin' },
  { id: 'aids', to: `${fullPath}#project-aids`, text: 'Mes aides' },
  { id: 'contact', to: `${fullPath}#project-contact`, text: 'Contact' },
  { id: 'linked-project', to: `${fullPath}#project-linked-projects`, text: 'Projets complémentaires' }
]
</script>
