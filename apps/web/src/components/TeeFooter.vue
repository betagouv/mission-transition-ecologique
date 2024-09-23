<template>
  <!-- FOOTER -->
  <div
    :class="`fr-footer ${stickToBottom ? 'tee-footer-bottom' : ''}`"
    class="fr-mt-0v"
  >
    <div class="fr-container--fluid fr-mx-md-20v fr-mx-8v">
      <!-- FOOTER BODY -->
      <div class="fr-footer__body fr-grid-row">
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
      <div class="fr-footer__partners">
        <h4 class="fr-footer__partners-title">Nos partenaires</h4>
        <div class="fr-footer__partners-logos fr-grid-row">
          <div class="fr-footer__partners-main">
            <a
              class="footer__partners-link fr-my-4v fr-mr-4v tee-router-link"
              target="_blank"
              :href="mainPartner.href"
            >
              <img
                class="fr-footer__logo tee-home-step-operator-logo tee-footer-operator-main fr-responsive-img"
                :src="mainPartner.img"
                :alt="mainPartner.label"
              />
            </a>
          </div>
          <div class="fr-footer__partners-sub">
            <ul
              v-for="operator in operators"
              :key="operator.label"
            >
              <li>
                <a
                  class="footer__partners-link tee-router-link fr-my-4v fr-ml-4v"
                  target="_blank"
                  :href="operator.href"
                >
                  <img
                    class="fr-footer__logo tee-home-step-operator-logo tee-footer-operator-img"
                    :src="operator.img"
                    :alt="operator.label"
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
              <span
                v-if="link.icon"
                :class="link.icon"
                class="fr-icon--sm"
              />
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

import Translation from '@/utils/translation'
import { RouteName } from '@/types/routeType'
import operators from '@/utils/operators'

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
    label: 'Ajouter une aide',
    to: { name: RouteName.AddProgram }
  },
  {
    label: 'Échanger avec un conseiller',
    to: { name: RouteName.ChatAdvisor },
    icon: 'fr-icon-chat-3-line'
  }
]
</script>
