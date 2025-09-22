<template>
  <TeeDsfrHeader
    id="tee-header"
    service-title="Transition écologique des entreprises"
    service-description="Allier écologie avec économies !"
    home-to="/"
    :quick-links="quickLinks"
    logo-text="RÉPUBLIQUE<br>FRANÇAISE"
    :show-search="false"
    :operator-img-src="Identity.logoPath"
    operator-img-alt="Transition écologique des entreprises - ADEME"
    operator-img-style="width:3.5rem;"
  />
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeHeader > FUNCTION_NAME > MSG_OR_VALUE :`)

import { TeeDsfrHeaderMenuLinkProps } from '@/components/element/vueDsfr/dsfrHeader/TeeDsfrHeaderMenuLinks.vue'
import { Identity } from '@/tools/Identity'
import { RouteName } from '@/types/routeType'

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
