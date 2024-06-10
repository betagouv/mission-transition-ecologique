<template>
  <div>
    <DsfrSideMenu :menu-items="menuItems" />
  </div>
</template>
<script setup lang="ts">
import { DsfrSideMenuListItemProps } from '@gouvminint/vue-dsfr/types/components/DsfrSideMenu/DsfrSideMenu.types'

const menuItems: DsfrSideMenuListItemProps[] = [{ id: '', to: '', text: '' }]
</script>
