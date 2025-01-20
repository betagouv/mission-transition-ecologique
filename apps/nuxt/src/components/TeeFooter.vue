<template>
  <!-- FOOTER -->
  <div :class="`fr-footer fr-pt-md-0 ${stickToBottom ? 'tee-footer-bottom' : ''}`">
    <div class="fr-container--fluid fr-mx-md-20v fr-mx-8v">
      <!-- FOOTER BODY -->
      <div class="fr-footer__body fr-hidden-sm fr-grid-row">
        <div class="fr-footer__brand fr-col-lg-3">
          <p class="fr-logo">
            République
            <br />Française
          </p>
        </div>
        <div class="fr-footer__content fr-col-lg-9">
          <ul class="fr-footer__content-list">
            <li
              v-for="link in gouvLinks"
              :key="link.label"
              class="fr-footer__content-item"
            >
              <a
                class="fr-footer__content-link"
                target="_blank"
                :href="link.href"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- FOOTER PARTNERS -->
      <div class="fr-footer__partners fr-hidden-sm">
        <h4 class="fr-footer__partners-title">Nos partenaires</h4>
        <div class="fr-footer__partners-logos fr-grid-row">
          <div class="fr-footer__partners-main">
            <a
              class="footer__partners-link fr-my-4v fr-mr-4v fr-bg--none"
              target="_blank"
              :href="mainPartner.href"
            >
              <img
                class="fr-footer__logo fr-responsive-img"
                :src="mainPartner.img"
                :alt="mainPartner.label"
              />
            </a>
          </div>
          <div class="fr-footer__partners-sub">
            <ul>
              <li
                v-for="operator in operators"
                :key="operator.label"
              >
                <a
                  class="footer__partners-link fr-bg--none fr-my-4v fr-ml-4v"
                  target="_blank"
                  :href="operator.href"
                  rel="noopener noreferrer"
                >
                  <img
                    class="fr-footer__logo fr-responsive-img"
                    :src="operator.img"
                    :alt="operator.label"
                    :width="operator.width ?? undefined"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- FOOTER BOTTOM -->
      <div class="fr-footer__bottom fr-mt-5v">
        <ul class="fr-footer__bottom-list">
          <li
            v-for="link in mainLinks"
            :key="link.label"
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
          <TeeFooterCookiesButton />
        </ul>

        <!-- LICENCE LINKS -->
        <div class="fr-footer__bottom-copy">
          <p>
            {{ Translation.t('footer.thisApplicationAndIts') }}
            <a
              :href="sourceCodeHref"
              class="fr-link-licence no-content-after"
            >
              {{ Translation.t('footer.sourceCode') }}
            </a>
            {{ Translation.t('footer.areUnderlicence') }}
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
// console.log(`TeeAppFooter > FUNCTION_NAME > MSG_OR_VALUE :`)

import Translation from '@/tools/translation'
import { RouteName } from '@/types/routeType'

interface Props {
  stickToBottom?: boolean
}
defineProps<Props>()

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

const mainPartner = {
  label: 'Service public',
  img: '/images/logos/service-public.fr.svg',
  href: 'https://conseillers-entreprises.service-public.fr/'
}

const mainLinks = [
  {
    // router ok
    label: 'Accessibilité : Non conforme',
    to: '/accessibilite'
  },
  {
    // router ok
    label: 'Mentions légales',
    to: { name: RouteName.Legal }
  },
  {
    // router ok
    label: 'Données personnelles',
    to: { name: RouteName.PersonalData }
  },
  {
    label: 'Code source',
    href: sourceCodeHref
  },
  {
    label: 'Statistiques',
    to: { name: RouteName.Statistics }
  },
  {
    label: 'Budget',
    to: { name: RouteName.Budget }
  },
  {
    label: 'Ajouter une aide',
    to: { name: RouteName.AddProgram }
  }
]

const operators = [
  {
    label: 'ADEME',
    img: '/images/logos/ademe.svg',
    href: 'https://www.ademe.fr/'
  },
  {
    label: 'Bpifrance',
    img: '/images/logos/bpi-france.svg',
    href: 'https://www.bpifrance.fr/'
  },
  {
    label: 'CCI France',
    img: '/images/logos/cci-france.svg',
    href: 'https://www.cci.fr/',
    width: '130px'
  },
  {
    label: 'CMA France',
    img: '/images/logos/cma-france.png',
    href: 'https://www.artisanat.fr/'
  },
  {
    label: 'Office français de la biodiversité',
    img: '/images/logos/logo-ofb.webp',
    href: ' https://ofb.gouv.fr'
  }
]
</script>
