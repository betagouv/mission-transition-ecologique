<template>
  <div>
    <TeeDsfrBreadcrumb :links="[{ text: 'Statistiques', to: { name: RouteName.Statistics } }]" />
    <div class="fr-container fr-mb-8w">
      <div class="fr-mb-5w">
        <h1 class="fr-mb-3w">Statistiques d'usage</h1>
        <p>
          Vous trouverez ici les statistiques d'utilisation du site Transition écologique des entreprises. Ces données nous permettent de
          suivre les évolutions d'usage de la plateforme dans le temps mais également de mieux comprendre vos besoins et d'orienter nos
          actions pour améliorer ce service.
        </p>
        <iframe
          src="https://tee-metabase.osc-fr1.scalingo.io/public/dashboard/5c81eab8-2949-45df-a020-7af231f7ab1e"
          width="100%"
          height="3200px"
          title="Les statistiques de transition écologique des entreprises"
        />
      </div>
    </div>
    <ContactMail />
  </div>
</template>

<script setup lang="ts">
import { MetaRobots } from '@/tools/metaRobots'
import { MetaSeo } from '@/tools/metaSeo'
import Navigation from '@/tools/navigation'
import { RouteName } from '@/types'
import { defineWebPage, useSchemaOrg } from '@unhead/schema-org/vue'

const navigation = new Navigation()

definePageMeta({
  path: '/stats',
  name: RouteName.Statistics
})

const description = 'Informations relatives aux statistiques du site Mission Transition écologique des entreprises.'
useSeoMeta(MetaSeo.get('Statistiques', description))
useSchemaOrg(defineWebPage({ description: description }))

useHead({
  link: [
    {
      rel: 'canonical',
      href: navigation.getHrefByRouteName(RouteName.Statistics)
    }
  ],
  ...MetaRobots.indexFollow()
})
</script>

<style scoped>
h1 {
  color: var(--light-background-action-high-blue-france, #000091);
  font-size: 2.5rem;
  font-style: normal;
  line-height: 3rem; /* 120% */
}

p {
  color: #000;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
}
</style>
