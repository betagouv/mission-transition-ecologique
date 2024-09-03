<template>
  <dialog
    id="fr-consent-modal"
    class="fr-modal"
    role="dialog"
    aria-labelledby="fr-consent-modal-title"
  >
    <div class="fr-container fr-container--fluid fr-container-md">
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-col-12 fr-col-md-10 fr-col-lg-8">
          <div class="fr-modal__body">
            <div class="fr-modal__header">
              <button
                class="fr-btn--close fr-btn"
                aria-controls="fr-consent-modal"
                title="Fermer"
              >
                Fermer
              </button>
            </div>
            <div class="fr-modal__content">
              <h1
                id="fr-consent-modal-title"
                class="fr-modal__title"
              >
                Panneau de gestion des cookies
              </h1>
              <div class="fr-consent-manager">
                <!-- Finalités -->
                <div class="fr-consent-service fr-consent-manager__header">
                  <fieldset class="fr-fieldset fr-fieldset--inline">
                    <legend
                      id="finality-legend"
                      class="fr-consent-service__title"
                    >
                      Préférences pour tous les services. <a :href="RouteName.PersonalData">Données personnelles et cookies</a>
                    </legend>
                    <div class="fr-consent-service__radios">
                      <div class="fr-radio-group">
                        <input
                          id="consent-all-accept"
                          type="radio"
                          name="consent-all"
                        />
                        <label
                          class="fr-label"
                          for="consent-all-accept"
                        >
                          Tout accepter
                        </label>
                      </div>
                      <div class="fr-radio-group">
                        <input
                          id="consent-all-refuse"
                          type="radio"
                          name="consent-all"
                        />
                        <label
                          class="fr-label"
                          for="consent-all-refuse"
                        >
                          Tout refuser
                        </label>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div
                  v-for="cookie in cookies"
                  :key="cookie.value"
                  class="fr-consent-service"
                >
                  <fieldset
                    aria-labelledby="finality-1-legend finality-1-desc"
                    role="group"
                    class="fr-fieldset fr-fieldset--inline"
                  >
                    <legend
                      id="finality-1-legend"
                      class="fr-consent-service__title"
                    >
                      {{ cookie.name }}
                    </legend>
                    <div class="fr-consent-service__radios">
                      <div class="fr-radio-group">
                        <input
                          id="consent-finality-1-accept"
                          type="radio"
                          name="consent-finality-1"
                        />
                        <label
                          class="fr-label"
                          for="consent-finality-1-accept"
                        >
                          Accepter
                        </label>
                      </div>
                      <div class="fr-radio-group">
                        <input
                          id="consent-finality-1-refuse"
                          type="radio"
                          name="consent-finality-1"
                        />
                        <label
                          class="fr-label"
                          for="consent-finality-1-refuse"
                        >
                          Refuser
                        </label>
                      </div>
                    </div>
                    <p
                      id="finality-1-desc"
                      class="fr-consent-service__desc"
                    >
                      Ces cookies fournissent des informations statistiques sur notre site. Ils permettent de mesurer l'audience et les
                      performances du site de manière anonyme afin d'en améliorer le fonctionnement.
                    </p>
                  </fieldset>
                </div>
                <!-- Bouton de confirmation/fermeture -->
                <ul class="fr-consent-manager__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-sm">
                  <li>
                    <button class="fr-btn">Confirmer mes choix</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>
<script lang="ts" setup>
import { RouteName } from '@/types'
import { useNavigationStore } from '@/stores/navigation'
import { CookieManager } from '@/types/navigation'

const cookies = ref<CookieManager[]>(useNavigationStore().cookies)
</script>
