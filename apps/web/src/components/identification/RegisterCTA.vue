<template>
  <TeeDsfrButton
    class="fr-text--yellow fr-hidden fr-unhidden-md"
    label="Vous êtes...?"
  />
  <TeeDsfrButton
    id="register-mobile-button"
    class="fr-icon-account-circle-fill fr-p-0 fr-btn--lg fr-btn--tertiary-no-outline fr-hidden-md"
  >
    <template #badge>
      <span
        id="register-mobile-badge"
        :class="isIdentified ? 'fr-bg--green fr-icon-check-line' : 'fr-bg--yellow fr-icon-question-mark'"
        class="fr-text--blue-france fr-icon--sm fr-radius-a--2v"
      />
    </template>
  </TeeDsfrButton>
</template>
<script setup lang="ts">
const isIdentified = computed(() => {
  return true
})
</script>
<style lang="scss" scoped>
#register-mobile-button {
  position: relative;
}

#register-mobile-badge {
  display: flex;
  height: 1rem;
  width: 1rem;
  position: absolute;
  right: 8px;
  align-items: center;
  top: 3px;
}
</style>
