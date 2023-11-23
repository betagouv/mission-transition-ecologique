<template>
  <DsfrHeader
    service-title="Transition écologique des entreprises"
    service-description="Allier écologie avec économies !"
    :home-to="'/'"
    :quick-links="quickLinks"
    logo-text='RÉPUBLIQUE<br>FRANÇAISE'
    :show-search="false"
    :operator-img-src="'/images/logos/mission-transition-logo-alone.png'"
    operator-img-alt='Transition Ecologique des Entreprises - ADEME'
    operator-img-style='width:3.5rem;'
    >
  </DsfrHeader>
</template>

<script setup lang="ts">

import { RouteName } from '@/types/routeType'

const quickLinks = [
  {
    label: 'Accueil',
    to: {
      name: RouteName.Homepage
    }
  },
  {
    label: 'Annuaire',
    to: {
      name: RouteName.Catalog
    }
  }
]

</script>