<template>
  <div class="fr-follow">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-follow__newsletter">
            <div>
              <h5 class="fr-h5 fr-follow__title">Une question sur notre service ?</h5>
              <p class="fr-text--sm fr-follow__desc">
                Vous êtes un acteur public ou un média et souhaitez en savoir plus sur notre service ? Notre équipe est à votre disposition
                pour répondre à toutes vos questions.
              </p>
            </div>
            <div>
              <ContactButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContactButton from '@/components/contact/ContactButton.vue'
</script>
