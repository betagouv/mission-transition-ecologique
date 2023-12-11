<template>
  <div class="fr-follow">
    <div class="fr-container">
      <div class="fr-grid-row">
        <div class="fr-col-12">
          <div class="fr-follow__newsletter">
            <div>
              <h5 class="fr-h5 fr-follow__title">
                Nous avons besoin de vous !
              </h5>
              <p class="fr-text--sm fr-follow__desc">
                Une aide financière qui manque sur la plateforme ?
                Des bugs que vous aimeriez remonter ?
                Faites-nous vos retours pour nous aider à améliorer
                notre outil.
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
<script setup lang='ts'>
import ContactButton from '@/components/button/ContactButton.vue'
</script>
