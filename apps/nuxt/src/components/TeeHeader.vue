<template>
  <TeeDsfrHeader
    id="tee-header"
    service-title="Transition écologique des entreprises"
    service-description="Allier écologie avec économies !"
    home-to="/"
    :quick-links="quickLinks"
    logo-text="RÉPUBLIQUE<br>FRANÇAISE"
    :show-search="false"
    :operator-img-src="img(`/images/logos/mission-transition-logo-alone.png`, { quality: 70, format: 'webp' })"
    operator-img-alt="Transition Écologique des Entreprises - ADEME"
    operator-img-style="width:3.5rem;"
  />
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeHeader > FUNCTION_NAME > MSG_OR_VALUE :`)

import { TeeDsfrHeaderMenuLinkProps } from '@/components/element/vueDsfr/dsfrHeader/TeeDsfrHeaderMenuLinks.vue'
import { RouteName } from '@/types/routeType'

const img = useImage()

const quickLinks: TeeDsfrHeaderMenuLinkProps[] = [
  {
    label: 'Accueil',
    to: {
      name: RouteName.Homepage
    }
  },
  {
    label: 'Catalogue',
    links: [
      {
        id: useId(),
        text: 'Catalogue des aides',
        to: {
          name: RouteName.CatalogPrograms
        }
      },
      {
        id: useId(),
        text: 'Catalogue des projets',
        to: {
          name: RouteName.CatalogProjects
        }
      }
    ]
  }
]
</script>
