<template>
  <div class="fr-table fr-table--no-caption">
    <table>
      <caption>
        Caption tableau des sous-traitants
      </caption>
      <thead>
        <tr>
          <th scope="col">Partenaire</th>
          <th scope="col">Pays destinataire</th>
          <th scope="col">Pays d’hébergement</th>
          <th scope="col">Traitement réalisé</th>
          <th scope="col">Garantie</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(thirdParty, index) in thirdParties"
          :key="`${index}-thirdParty`"
        >
          <td>{{ thirdParty.name }}</td>
          <td>{{ thirdParty.country }}</td>
          <td>{{ thirdParty.hostingCountry }}</td>
          <td>{{ thirdParty.serviceType }}</td>
          <td>
            <a
              :href="thirdParty.policyUrl"
              rel="noopener noreferrer"
              target="_blank"
            >
              {{ thirdParty.policyUrl }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { PrivacyPolicyPropsWithThirdPartiesAsArray } from '@incubateur-ademe/legal-pages-markdown'
import { defineProps } from 'vue'

defineProps<PrivacyPolicyPropsWithThirdPartiesAsArray>()
</script>
