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
      </div>
      <iframe
        src="https://tee-metabase.osc-fr1.scalingo.io/public/dashboard/43b192d5-087a-40d6-8f3e-382318768bd9"
        width="100%"
        height="1900px"
        :style="{ border: 'none' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types'

definePageMeta({
  path: '/stats',
  name: RouteName.Statistics
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
