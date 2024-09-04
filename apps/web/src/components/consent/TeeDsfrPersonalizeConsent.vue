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
              <TeeDsfrButton
                label="Fermer"
                size="sm"
                class="fr-btn--close"
                @click="closePersonalize()"
              />
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
                      Préférences pour tous les services. <a :href="RouteName.PersonalData">Données personnelles</a>
                    </legend>
                    <div class="fr-consent-service__radios">
                      <DsfrButtonGroup
                        :buttons="allButtons"
                        inline-layout-when="medium"
                        align="right"
                      />
                    </div>
                  </fieldset>
                </div>
                <div
                  v-for="cookie in Object.values(cookies)"
                  :key="cookie.value"
                  class="fr-consent-service"
                >
                  <ConsentElement
                    :cookie="cookie"
                    @update:model-value="(status) => updateCookieStatus(status, cookie.value)"
                  />
                </div>
                <!-- Bouton de confirmation/fermeture -->
                <ul class="fr-consent-manager__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-sm">
                  <li>
                    <TeeDsfrButton
                      label="Confirmer mes choix"
                      size="sm"
                      @click="saveConsent()"
                    />
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
import { type Cookies, type CookieValue } from '@/types/cookies'
import Cookie from '@/utils/cookies'
import { DsfrButtonGroupProps } from '@gouvminint/vue-dsfr/types'

const cookies = ref<Cookies>(useNavigationStore().cookies)
const allStatus = ref<boolean>(false)
const allButtons: DsfrButtonGroupProps['buttons'] = [
  { label: 'Tout accepter', onClick: () => updateAllStatus(true) },
  { label: 'Tout refuser', onClick: () => updateAllStatus(false), secondary: true }
]

const closePersonalize = () => {
  const modal = document.getElementById('fr-consent-modal')
  if (modal) {
    modal.classList.remove('fr-modal--opened')
  }
}

const updateAllStatus = (status: boolean) => {
  if (status) {
    Cookie.acceptAllCookies()
  } else {
    Cookie.refuseAllCookies()
  }
  closePersonalize()
}

const updateCookieStatus = (status: boolean, cookie: CookieValue) => {
  cookies.value[cookie].accepted = status
  allStatus.value = status
}

const saveConsent = () => {
  Cookie.saveCookies(cookies.value)
  closePersonalize()
}
</script>
