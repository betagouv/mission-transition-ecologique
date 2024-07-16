<template>
  <div class="fr-table fr-table--no-caption">
    <table>
      <caption>
        Caption tableau des cookies
      </caption>
      <thead>
        <tr>
          <th scope="col">Catégorie de cookie</th>
          <th scope="col">Nom du cookie</th>
          <th scope="col">Durée de conservation</th>
          <th scope="col">Finalités</th>
          <th scope="col">Éditeur</th>
          <th scope="col">Destination</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(cookie, index) in cookies"
          :key="`${index}-thirdParty`"
        >
          <td>{{ cookie.category }}</td>
          <td>{{ cookie.name }}</td>
          <td>{{ cookie.expiration }}</td>
          <td>{{ cookie.finalities }}</td>
          <td>{{ cookie.editor }}</td>
          <td>{{ cookie.destination }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PrivacyPolicyPropsWithCookiesAsArray } from '@incubateur-ademe/legal-pages-markdown'
import { defineProps } from 'vue'

defineProps<PrivacyPolicyPropsWithCookiesAsArray>()
</script>

<style scoped lang="scss"></style>
