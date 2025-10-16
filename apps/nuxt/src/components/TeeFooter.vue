<template>
  <!-- FOOTER -->
  <div
    class="fr-footer fr-pt-0-5v"
    role="contentinfo"
  >
    <div class="fr-follow">
      <div class="fr-container">
        <div class="fr-grid-row">
          <div class="fr-col-12 fr-col-md-8">
            <Feedback
              title="Merci de nous aider à améliorer ce service"
              title-class="fr-h6"
              :position="FeedbackButtonPosition.Footer"
            />
          </div>
          <div class="fr-col-12 fr-col-md-4">
            <div class="fr-follow__social">
              <p class="fr-h6">Liens utiles</p>
              <ul class="">
                <li
                  v-for="link in utilLinks"
                  :key="link.label"
                  class="fr-footer__content-item"
                >
                  <router-link
                    v-if="link.to"
                    :to="link.to"
                    class="fr-footer__content-link"
                  >
                    {{ link.label }}
                  </router-link>
                  <a
                    v-else
                    :href="link.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="fr-footer__content-link"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="fr-container fr-pt-4w">
      <!-- FOOTER BODY -->
      <div class="fr-footer__body">
        <div class="fr-footer__brand fr-enlarge-link">
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
              class="fr-footer__logo ademe-logo"
              :src="img('/images/logos/ademe.svg')"
              alt="logo de l'ADEME - Agence de de la Transition Écologique"
            />
            <img
              class="fr-footer__logo"
              :src="img('/images/logos/mission-transition-ecologique-logo-texte.svg')"
              alt="logo de la Transition Écologique des Entreprises"
            />
          </a>
        </div>
        <div class="fr-footer__content">
          <p class="fr-footer__content-desc">
            <strong>Notre mission :</strong> accompagner les TPE et PME dans leur transition écologique en leur donnant les moyens
            d’identifier leurs projets prioritaires, d’accéder aux aides publiques adaptées à leur entreprise et de mobiliser les
            conseillers pour concrétiser leurs démarches.
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
            <TeeFooterCookiesButton v-if="link.label === 'cookies'" />
            <router-link
              v-else-if="link.to"
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
        </ul>

        <!-- LICENCE LINKS -->
        <div class="fr-footer__bottom-copy">
          <p>
            {{ Translation.t('footer.thisApplicationAndIts') }}
            <a
              :href="sourceCodeHref"
              class="fr-link-licence no-content-after"
              target="_blank"
            >
              {{ Translation.t('footer.sourceCode') }}
            </a>
            {{ Translation.t('footer.areUnderlicence') }}
            &nbsp;
            <a
              :href="licenceHref"
              class="fr-link-licence no-content-after"
              target="_blank"
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
import { FeedbackButtonPosition } from '@/tools/feedback/feedbackType'
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
const openData = 'https://www.data.gouv.fr/fr/datasets/catalogue-des-aides-a-la-transition-ecologique-pour-les-entreprises/'
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
    label: 'Accessibilité : Non conforme',
    to: { name: RouteName.Accessibility }
  },
  {
    label: 'Mentions légales',
    to: { name: RouteName.Legal }
  },
  {
    label: 'Données personnelles',
    to: { name: RouteName.PersonalData }
  },
  {
    label: 'cookies'
  },
  {
    label: 'Statistiques',
    to: { name: RouteName.Statistics }
  },
  {
    label: 'Données ouvertes',
    href: openData
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

const utilLinks = [
  {
    label: 'Questions fréquentes',
    to: { name: RouteName.Faq }
  },
  {
    label: 'Kit média',
    href: mediaKit
  }
]

const operators = partnersAll
</script>

<style scoped lang="scss">
.ademe-logo {
  height: 7.2rem;
}
</style>
