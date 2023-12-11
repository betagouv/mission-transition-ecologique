<template>
  <DsfrHeader
    service-title="Transition écologique des entreprises"
    service-description="Allier écologie avec économies !"
    home-to="/"
    :quick-links="quickLinks"
    logo-text='RÉPUBLIQUE<br>FRANÇAISE'
    :show-search="false"
    :operator-img-src="`/images/logos/mission-transition-logo-alone.png`"
    operator-img-alt='Transition Ecologique des Entreprises - ADEME'
    operator-img-style='width:3.5rem;'
    >
  </DsfrHeader>

</template>

<script setup lang="ts">
import { DsfrHeader } from '@gouvminint/vue-dsfr'
import { RouteName } from '@/types/routeType'
import type { DsfrHeaderMenuLinkProps } from '@gouvminint/vue-dsfr/types/components/DsfrHeader/DsfrHeaderMenuLink.vue'
import { externalLinks } from '@/utils/global'

const quickLinks: DsfrHeaderMenuLinkProps[] = [
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
  },
  {
    label: "Échanger avec un conseiller",
    href: externalLinks.placeDesEntreprises,
    target: "_blank"
  }
]

</script>
