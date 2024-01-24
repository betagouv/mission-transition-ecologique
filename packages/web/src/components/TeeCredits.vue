<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug"
  >
    <h5>DEBUG - TeeStepper</h5>
    <div
      v-if="true"
      class="fr-grid-row fr-grid-row--gutters"
    >
      <div class="fr-col-3">
        <h6 class="fr-mb-1v">
          Translation.lang : <code>{{ Translation.lang }} </code>
        </h6>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div :class="`fr-footer fr-pt-0 fr-mt-30v ${stickToBottom ? 'tee-footer-bottom' : ''}`">
    <div
      class="fr-footer__body"
      style="justify-content: center"
    >
      <!-- PARTNERS LINKS -->
      <div
        class="fr-footer__content fr-ml-0 fr-mt-5v"
        style="justify-content: center; flex-basis: 100%"
      >
        <ul class="fr-footer__content-list">
          <li
            v-for="link in ecosystemLinks"
            :key="link.href"
            class="fr-footer__content-item fr-mx-5v"
          >
            <span
              class="fr-icon-external-link-line fr-mr-1v"
              aria-hidden="true"
            ></span>
            <a
              :href="link.href"
              class="fr-footer__content-link"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- SOURCES LINKS -->
      <div
        class="fr-footer__bottom fr-mt-5v"
        style="justify-content: center"
      >
        <ul
          class="fr-footer__bottom-list"
          style="display: flex; justify-content: center"
        >
          <li
            v-for="link in projectLinks"
            :key="link.href"
            class="fr-footer__bottom-item"
          >
            <router-link
              v-if="link.to"
              :to="link.to"
              class="fr-footer__bottom-link"
            >
              {{ link.label }}
            </router-link>
            <a
              v-else
              :href="link.href"
              class="fr-footer__bottom-link"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
        <!-- LICENCE LINKS -->
        <div class="fr-footer__bottom-copy">
          <p>
            {{ Translation.t('licence') }}
            &nbsp;
            <a
              :href="licenceHref"
              class="fr-link-licence no-content-after"
            >
              {{ licenceName }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeCredits > FUNCTION_NAME > MSG_OR_VALUE :`)

import Translation from '../utils/translation'
import { RouteName } from '@/types/routeType'

const licenceHref = 'https://github.com/betagouv/transition-ecologique-entreprises-widget/blob/main/LICENSE'
const licenceName = 'GNU AGPL v.3'

const ecosystemLinks = [
  {
    label: 'ADEME',
    href: 'https://ademe.fr'
  },
  {
    label: 'BPI',
    href: 'https://www.bpifrance.fr/'
  },
  {
    label: 'CGDD',
    href: 'https://www.ecologie.gouv.fr/commissariat-general-au-developpement-durable-cgdd'
  },
  {
    label: 'DGE',
    href: 'https://www.economie.gouv.fr/direction-generale-des-entreprises-dge'
  },
  {
    label: 'DILA',
    href: 'https://www.dila.premier-ministre.gouv.fr/'
  },
  {
    label: 'DINUM',
    href: 'https://www.numerique.gouv.fr/dinum/'
  }
]

const projectLinks = [
  {
    label: 'Mission Transition',
    to: { name: RouteName.Homepage }
  },
  {
    label: "Startup d'Etat Transition Ecologique des Entreprises",
    href: 'https://beta.gouv.fr/startups/transition-ecologique-des-entreprises.html'
  },
  {
    label: 'Mentions légales',
    to: { name: RouteName.Legal }
  },
  {
    label: 'Code source Mission Transition',
    href: 'https://github.com/MTES-MCT/mission-transition'
  },
  {
    label: 'Code source widget',
    href: 'https://github.com/betagouv/transition-ecologique-entreprises-widget'
  }
]

interface Props {
  stickToBottom?: boolean
  debug?: boolean
}
defineProps<Props>()
</script>
