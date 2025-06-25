<template>
  <!-- FOOTER -->
  <div
    class="fr-footer"
    role="contentinfo"
  >
    <div class="fr-container">
      <!-- FOOTER BODY -->
      <div class="fr-footer__body fr-grid-row">
        <div class="fr-footer__brand fr-col-lg-3">
          <p class="fr-logo">
            République
            <br />Française
          </p>
          <a
            class="fr-footer__brand-link"
            href="/"
            title="Retour à l’accueil du site - Transition écologique des entreprises - République Française"
          >
            <img
              class="fr-footer__logo"
              :src="img('/images/logos/ademe.svg', { quality: 70, densities: 1 })"
              alt="logo de l'ADEME - Agence de de la Transition Écologique"
            />
          </a>
        </div>
        <div class="fr-footer__content fr-col-lg-9">
          <p class="fr-footer__content-desc">
            Notre mission : accompagner les TPE et PME dans leur transition écologique en leur donnant les moyens d’identifier leurs projets
            prioritaires, d’accéder aux aides publiques adaptées à leur entreprise et de mobiliser les conseillers pour concrétiser leurs
            démarches.
          </p>
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
                    :src="
                      img(operator.img, {
                        quality: 70,
                        densities: 1,
                        loading: 'lazy',
                        format: operator.format ?? undefined,
                        width: operator.width ?? undefined
                      })
                    "
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
              target="_blank"
              rel="noopener noreferrer"
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

import { Image } from '@/tools/image'
import { partnersAll } from '@/tools/operator'
import Translation from '@/tools/translation'
import { RouteName } from '@/types/routeType'

interface Props {
  stickToBottom?: boolean
}
defineProps<Props>()

const img = Image.getUrl
const sourceCodeHref = 'https://github.com/betagouv/transition-ecologique-entreprises-widget/tree/main'
const mediaKit =
  'https://accelerateur-transition-ecologique-ademe.notion.site/M-dia-Kit-Transition-cologique-des-Entreprises-1826523d57d780e8aa40d6e1a4cb528f?pvs=74'
const licenceHref = 'https://github.com/betagouv/transition-ecologique-entreprises-widget/blob/main/LICENSE'
const licenceName = 'GNU AGPL v.3'
const gouvLinks = [
  {
    label: 'info.gouv.fr',
    href: 'https://info.gouv.fr'
  },
  {
    label: 'service-public.fr',
    href: 'https://service-public.fr'
  },
  {
    label: 'legifrance.gouv.fr',
    href: 'https://legifrance.gouv.fr'
  },
  {
    label: 'data.gouv.fr',
    href: 'https://data.gouv.fr'
  }
]

const mainLinks = [
  {
    // router ok
    label: 'Accessibilité : Non conforme',
    to: { name: RouteName.Accessibility }
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
  },
  {
    label: 'Kit média',
    href: mediaKit
  },
  {
    label: 'Questions fréquentes',
    to: { name: RouteName.Faq }
  }
]

const operators = partnersAll
</script>
