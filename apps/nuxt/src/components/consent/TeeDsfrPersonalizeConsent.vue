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
              <p
                id="fr-consent-modal-title"
                class="fr-modal__title fr-mb-2w"
              >
                Panneau de gestion des cookies
              </p>
              <div class="fr-consent-manager">
                <div
                  v-for="cookie in Object.values(cookies || {})"
                  :key="cookie.value"
                  class="fr-consent-service"
                >
                  <ConsentElement
                    :cookie="cookie"
                    @update:model-value="(status: boolean) => updateCookieStatus(status, cookie.value)"
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
import { type CookieValue } from '@/types/cookies'
import Cookie from '@/tools/cookies'

const cookies = Cookie.cookies
const allStatus = ref<boolean>(false)

const closePersonalize = () => {
  const modal = document.getElementById('fr-consent-modal')
  if (modal) {
    modal.classList.remove('fr-modal--opened')
  }
}
const closeBaseConsent = () => {
  const element = document.getElementById('tee-consent-popup')
  if (element && !element.classList.contains('fr-hidden')) {
    element.classList.add('fr-hidden')
  }
}

const updateCookieStatus = (status: boolean, cookie: CookieValue) => {
  if (cookies.value) {
    cookies.value[cookie].accepted = status
    allStatus.value = status
  }
}

const saveConsent = () => {
  if (cookies.value) {
    Cookie.saveCookies(cookies.value)
  }
  closePersonalize()
  closeBaseConsent()
}
</script>
