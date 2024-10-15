<template>
  <DsfrButton
    :class="isIdentified ? 'fr-btn--tertiary-no-outline' : 'fr-text--yellow'"
    class="fr-hidden fr-unhidden-lg"
    @click="openModal"
  >
    <template #default>
      <span
        v-if="isIdentified"
        class="fr-icon-account-circle-fill register-icon-profile"
      >
        <span
          id="base-badge"
          class="fr-text--blue-france fr-radius-a--2v fr-bg--green fr-icon-check-line register-badge"
        />
      </span>

      <span
        id="register-text"
        class="fr-pl-2v"
        >{{ isIdentified ? companyName : 'Vous êtes...?' }}
      </span>
    </template>
  </DsfrButton>
  <TeeDsfrButton
    class="register-icon-profile fr-icon-account-circle-fill fr-p-0 fr-btn--lg fr-btn--tertiary-no-outline fr-hidden-lg"
    @click="openModal"
  >
    <template #badge>
      <span
        id="badge-mobile"
        :class="isIdentified ? 'fr-bg--green fr-icon-check-line' : 'fr-bg--yellow fr-icon-question-mark'"
        class="fr-text--blue-france fr-radius-a--2v register-badge"
      />
    </template>
  </TeeDsfrButton>
  <RegisterModal />
</template>
<script setup lang="ts">
const isIdentified = ref<boolean>(false)
const modalStatus = ref<boolean>(false)
const openModal = () => {
  modalStatus.value = !modalStatus.value
  isIdentified.value = !isIdentified.value
}
const companyName = 'La meilleure entreprise de France'
</script>
<style lang="scss" scoped>
.register-icon-profile {
  position: relative;
  float: left;
}

#register-text {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 150px;
  font-size: 0.875rem;
  display: inherit;
  white-space: nowrap;
}

.register-badge {
  display: flex;
  height: 1rem;
  width: 1rem;
  padding: 0.1rem;
  position: absolute;
  align-items: center;
}

.register-badge::before {
  width: 0.8rem;
}

#badge-mobile {
  right: 12px;
  top: 2px;
}

#base-badge {
  bottom: 16px;
  left: 13px;
}
</style>
