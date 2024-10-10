<template>
  <TeeDsfrButton
    class="fr-text--yellow fr-hidden fr-unhidden-sm"
    label="Vous êtes...?"
  />
  <TeeDsfrButton
    id="register-mobile-cta"
    class="fr-icon-account-circle-fill fr-btn--lg fr-btn--tertiary-no-outline fr-hidden-sm"
  >
    <template #badge>
      <span>?</span>
    </template>
  </TeeDsfrButton>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
#register-mobile-cta ::after {
  --icon-size: 1rem;
  background-color: currentColor;
  content: '?';
  display: inline-block;
  flex: 0 0 auto;
  height: 1rem;
  height: var(--icon-size);
  margin: -0.5rem;
  mask-size: 100% 100%;
  position: absolute;
  right: 0;
  top: 4px;
  vertical-align: calc(0.375em - 0.5rem);
  vertical-align: calc((0.75em - var(--icon-size)) * 0.5);
  width: 1rem;
  color: var(--text-action-high-blue-france);
  width: var(--icon-size);
}
</style>
