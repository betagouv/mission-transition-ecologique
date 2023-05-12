<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug" 
    >
    <h5>DEBUG - TeeStepper</h5>
    <div 
      v-if="true"
      class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> choices.lang : <code>{{ choices.lang }} </code></h6>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="fr-footer fr-pt-0 fr-mt-30v">
    <div
      class="fr-footer__body"
      style="justify-content: center;">

      <!-- PARTNERS LINKS -->
      <div 
        class="fr-footer__content fr-ml-0 fr-mt-5v"
        style="justify-content: center;">
        <ul 
          class="fr-footer__content-list">
          <li
            v-for="link in ecosystemLinks"
            :key="link.href"
            class="fr-footer__content-item fr-mx-5v">
            <span class="fr-icon-external-link-line fr-mr-1v" aria-hidden="true"></span>
            <a 
              :href="link.href"
              class="fr-footer__content-link">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- SOURCES LINKS -->
      <div 
        class="fr-footer__bottom fr-mt-5v"
        style="justify-content: center;">
        <ul 
          class="fr-footer__bottom-list"
          style="display: flex; justify-content: center;">
          <li
            v-for="link in projectLinks"
            :key="link.href"
            class="fr-footer__bottom-item">
            <a 
              :href="link.href"
              class="fr-footer__bottom-link">
              {{ link.label }}
            </a>
          </li>
        </ul>
        <!-- LICENCE LINKS -->
        <div class="fr-footer__bottom-copy">
          <p>
            {{ choices.t('licence') }}
            <a
              :href="licenceHref"
              class="fr-link-licence no-content-after">
              {{ licenceName }}
            </a>
          </p>
        </div>
      </div>
      
    </div>
  </div>


</template>

<script setup lang="ts">

import { choicesStore } from '../stores/choices'

const choices = choicesStore()

const licenceHref = 'https://github.com/betagouv/transition-ecologique-entreprises-widget/blob/main/LICENSE'
const licenceName = 'GNU AGPL v.3'

const ecosystemLinks = [
  {
    label: 'ademe.fr',
    href: 'https://ademe.fr'
  },
  {
    label: 'dinum.gouv.fr',
    href: "https://www.numerique.gouv.fr/dinum/"
  },
  {
    label: "bpifrance.fr",
    href: "https://www.bpifrance.fr/"
  },
]

const projectLinks = [
  {
    label: 'Mission Transition',
    href: 'http://mission-transition.beta.gouv.fr'
  },
  {
    label: "Startup d'Etat Transition Ecologique des Entreprises",
    href: 'https://beta.gouv.fr/startups/transition-ecologique-des-entreprises.html'
  },
  {
    label: 'Code source Mission Transition',
    href: 'https://github.com/MTES-MCT/mission-transition'
  },
  {
    label: 'Code source widget',
    href: 'https://github.com/betagouv/transition-ecologique-entreprises-widget'
  },
]

interface Props {
  debug?: boolean,
}
const props = defineProps<Props>()


</script>
