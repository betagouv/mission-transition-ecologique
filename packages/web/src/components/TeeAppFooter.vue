<template>
  <!-- DEBUGGING -->
  <div
    v-if="debug"
    class="vue-debug" 
    >
    <h5>DEBUG - TeeAppFooter</h5>
    <div 
      v-if="true"
      class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-3">
        <h6 class="fr-mb-1v"> choices.lang : <code>{{ choices.lang }} </code></h6>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div 
    :class="`fr-footer ${stickToBottom ? 'tee-footer-bottom' : ''}`">
    <div class="fr-container--fluid fr-mx-20v">
      <div
        class="fr-footer__body"
        style="">
        <div class="fr-footer__brand fr-enlarge-link">
          <p class="fr-logo">
            République
            <br>Française
          </p>
          <a class="fr-footer__brand-link" href="/" title="Retour à l’accueil du site - Mission Transition - République Française">
            <img class="fr-footer__logo" style="height:110px;" src="@public/images/logos/mission-transition-logo.png" alt="mission transition" />
            <!-- L’alternative de l’image (attribut alt) doit impérativement être renseignée et reprendre le texte visible dans l’image -->
          </a>
        </div>
        <div class="fr-footer__content">
          <!-- <p class="fr-footer__content-desc">Lorem [...] elit ut.</p> -->
          <ul class="fr-footer__content-list">
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" target="_blank" href="https://ecologie.gouv.fr">ecologie.gouv.fr</a>
            </li>
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" target="_blank" href="https://economie.gouv.fr">economie.gouv.fr</a>
            </li>
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" target="_blank" href="https://gouvernement.fr">gouvernement.fr</a>
            </li>
            <li class="fr-footer__content-item">
              <a class="fr-footer__content-link" target="_blank" href="https://data.gouv.fr">data.gouv.fr</a>
            </li>
          </ul>
        </div>
        <!-- PARTNERS LINKS -->
        <!-- <div 
          class="fr-footer__content fr-ml-0 fr-mt-5v"
          style="justify-content: center; flex-basis: 100%">
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
        </div> -->

        <!-- SOURCES LINKS -->
        <div 
          class="fr-footer__bottom fr-mt-5v"
          style="box-shadow: none;">
          <ul 
            class="fr-footer__bottom-list">
            <li
              v-for="link in mainLinks"
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
              &nbsp;
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
  </div>


</template>

<script setup lang="ts">

import { choicesStore } from '../stores/choices'

const choices = choicesStore()

const licenceHref = 'https://github.com/betagouv/transition-ecologique-entreprises-widget/blob/main/LICENSE'
const licenceName = 'GNU AGPL v.3'

// const ecosystemLinks = [
//   {
//     label: 'ADEME',
//     href: 'https://ademe.fr'
//   },
//   {
//     label: "BPI",
//     href: "https://www.bpifrance.fr/"
//   },
//   {
//     label: 'CGDD',
//     href: 'https://www.ecologie.gouv.fr/commissariat-general-au-developpement-durable-cgdd'
//   },
//   {
//     label: 'DGE',
//     href: 'https://www.economie.gouv.fr/direction-generale-des-entreprises-dge'
//   },
//   {
//     label: 'DILA',
//     href: 'https://www.dila.premier-ministre.gouv.fr/'
//   },
//   {
//     label: 'DINUM',
//     href: "https://www.numerique.gouv.fr/dinum/"
//   },
// ]

const mainLinks = [
  {
    label: 'Plan du site',
    href: '/plan-du-site'
  },
  {
    label: 'Accessibilité',
    href: '/accessibilite'
  },
  {
    label: 'Mentions légales',
    href: '/mentions-legales'
  },
  {
    label: 'Données personnelles',
    href: '/donnees-personnelles'
  },
  {
    label: 'Gestion des cookies',
    href: '/gestion-des-cookies'
  },
]

interface Props {
  stickToBottom?: boolean,
  debug?: boolean,
}
const props = defineProps<Props>()


</script>
