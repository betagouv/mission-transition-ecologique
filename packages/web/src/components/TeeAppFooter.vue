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
      <!-- FOOTER BODY -->
      <div
        class="fr-footer__body"
        style="">
        <div class="fr-footer__brand fr-enlarge-link">
          <p class="fr-logo">
            République
            <br>Française
          </p>
          <router-link 
            class="fr-footer__brand-link" 
            to="/" 
            title="Retour à l’accueil du site - Transition Ecologique des entreprises - République Française">
            <img 
            class="fr-footer__logo" 
            style="height:110px;" 
            src="/images/logos/mission-transition-logo-alone.png" 
            alt="Transition Ecologique des entreprises" />
            <!-- L’alternative de l’image (attribut alt) doit impérativement être renseignée et reprendre le texte visible dans l’image -->
        </router-link>
        </div>
        <div class="fr-footer__content">
          <!-- <p class="fr-footer__content-desc">Lorem [...] elit ut.</p> -->
          <ul class="fr-footer__content-list">
            <li 
              v-for="link in gouvLinks"
              :key="link.label"
              class="fr-footer__content-item">
              <a 
                class="fr-footer__content-link"
                target="_blank"
                :href="link.href">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>    
  
      <!-- FOOTER PARTNERS -->
      <div class="fr-footer__partners">
        <h4 class="fr-footer__partners-title">
          Nos partenaires
        </h4>
        <div class="fr-footer__partners-logos">
          <div class="fr-footer__partners-main">
            <a
              class="footer__partners-link" 
              target="_blank"
              style="background-image: none;"
              :href="mainPartner.href">
              <img 
                class="fr-footer__logo" 
                style="height: 5.625rem; width: 10rem;" 
                :src="mainPartner.img" 
                :alt="mainPartner.label">
            </a>
          </div>
          <div class="fr-footer__partners-sub">
            <ul
              v-for="partner in partners"
              :key="partner.label">
              <li>
                <a 
                  class="footer__partners-link" 
                  target="_blank"
                  style="background-image: none;"
                  :href="partner.href">
                <img 
                  class="fr-footer__logo" 
                  style="height: 5.625rem; width: 10rem;" 
                  :src="partner.img" 
                  :alt="partner.label">
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FOOTER BOTTOM -->
      <div 
        class="fr-footer__bottom fr-mt-5v"
        style="box-shadow: none;">
        <ul 
          class="fr-footer__bottom-list">
          <li
            v-for="link in mainLinks"
            :key="link.label"
            class="fr-footer__bottom-item">
            <router-link
              v-if="link.to"
              :to="link.to"
              class="fr-footer__bottom-link">
              {{ link.label }}
            </router-link>
            <a
              v-else
              :href="link.href"
              class="fr-footer__bottom-link">
              {{ link.label }}
            </a>
          </li>
        </ul>

        <!-- LICENCE LINKS -->
        <div class="fr-footer__bottom-copy">
          <p>
            {{ choices.t('footer.thisApplicationAndIts') }}
            <a
              :href="sourceCodeHref"
              class="fr-link-licence no-content-after">
              {{ choices.t('footer.sourceCode') }}
            </a>
            {{ choices.t('footer.areUnderlicence') }}
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


</template>

<script setup lang="ts">

import { choicesStore } from '../stores/choices'

const choices = choicesStore()

const sourceCodeHref = 'https://github.com/betagouv/transition-ecologique-entreprises-widget/tree/main'
const licenceHref = 'https://github.com/betagouv/transition-ecologique-entreprises-widget/blob/main/LICENSE'
const licenceName = 'GNU AGPL v.3'

const gouvLinks = [
  {
    label: 'ecologie.gouv.fr',
    href: 'https://ecologie.gouv.fr'
  },
  {
    label: 'economie.gouv.fr',
    href: 'https://economie.gouv.fr'
  },
  {
    label: 'gouvernement.fr',
    href: 'https://gouvernement.fr'
  },
  {
    label: 'data.gouv.fr',
    href: 'https://data.gouv.fr'
  }
]

const mainPartner =   {
  label: "Place des entreprises",
  img: '/images/logos/place-des-entreprises.svg',
  href: 'https://place-des-entreprises.beta.gouv.fr'
}
// {
//   label: 'Aides-territoires',
//   img: '/images/logos/aides-territoires.png',
//   href: 'https://aides-territoires.beta.gouv.fr/'
// }
const partners = [
  {
    label: 'ADEME',
    img: '/images/logos/ademe.svg',
    href: "https://www.ademe.fr/"
  },
  {
    label: 'Bpifrance',
    img: '/images/logos/bpi-france.svg',
    href: 'https://www.bpifrance.fr/'
  },
  {
    label: 'CCI France',
    img: '/images/logos/cci-france.svg',
    href: 'https://www.cci.fr/'
  },
  {
    label: 'CMA France',
    img: '/images/logos/cma-france.jpg',
    href: 'https://www.artisanat.fr/'
  },
]

const mainLinks = [
  // {
  //   label: 'Plan du site',
  //   to: '/plan-du-site'
  // },
  {
    // router ok
    label: 'Accessibilité',
    to: '/accessibilite'
  },
  {
    // router ok
    label: 'Mentions légales',
    to: '/mentions-legales'
  },
  {
    // router ok
    label: 'Données personnelles',
    to: '/donnees-personnelles'
  },
  {
    label: 'Code source',
    href: sourceCodeHref
  },
  {
    label: 'Statistiques',
    href: 'https://stats.beta.gouv.fr/index.php?module=CoreHome&action=index&idSite=23&period=day&date=yesterday#?period=day&date=yesterday&category=Dashboard_Dashboard&subcategory=1&idSite=23'
  }
]

interface Props {
  stickToBottom?: boolean,
  debug?: boolean,
}
const props = defineProps<Props>()


</script>
