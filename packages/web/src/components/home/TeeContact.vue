<template>
  <div class="fr-follow">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-follow__newsletter">
            <div>
              <h5 class="fr-h5 fr-follow__title">
                Vous souhaitez contacter un conseiller ?
              </h5>
              <p class="fr-text--sm fr-follow__desc">
                Vous ne trouvez pas ce que vous recherchez ?
                écrivez-vous, nous vous mettrons en relation
                avec le bon interlocuteur pour répondre à votre question. 
              </p>
            </div>
            <div>
              <button
                class="fr-button fr-btn--secondary fr-btn--lg  fr-btn--icon-right fr-icon-mail-line"
                @click="sendEmail">
                Nous contacter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeContact > FUNCTION_NAME > MSG_OR_VALUE :`)

// @ts-ignore
const metaEnv = import.meta.env
const contactEmail: string = metaEnv.VITE_CONTACT_EMAIL || 'france-transition@beta.gouv.fr'

const sendEmail = () => {
  window.location.assign(`mailto:${contactEmail}`)
}
</script>