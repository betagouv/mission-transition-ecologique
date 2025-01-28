<template>
  <DsfrButton
    v-if="hasData"
    class="fr-btn--tertiary-no-outline ignore-modal-click"
    :title="companyName"
    @click="openModal"
  >
    <span
      :class="isSmallScreen ? 'fr-icon--lg' : 'fr-pr-2w'"
      class="fr-icon-account-circle-fill register-icon-profile ignore-modal-click"
    >
      <span
        :id="isSmallScreen ? 'badge-mobile' : 'base-badge'"
        :class="badgeIcon"
        class="fr-text--blue-france fr-radius-a--2v ignore-modal-click register-badge"
      >
      </span>
    </span>

    <span
      v-if="!isSmallScreen"
      id="register-text"
      >{{ companyName }}
    </span>
  </DsfrButton>
  <DsfrButton
    v-if="!hasData"
    class="ignore-modal-click"
    @click="openModal"
  >
    <span
      v-if="isSmallScreen"
      :class="isSmallScreen ? 'fr-icon--lg' : 'fr-pr-2w'"
      class="fr-icon-account-circle-fill register-icon-profile ignore-modal-click"
    >
      <span
        :id="isSmallScreen ? 'badge-mobile' : 'base-badge'"
        :class="badgeIcon"
        class="fr-text--blue-france fr-radius-a--2v register-badge ignore-modal-click"
      >
      </span>
    </span>

    <span
      v-if="!isSmallScreen"
      id="register-text"
      class="fr-text--yellow ignore-modal-click"
    >
      {{ Translation.t('register.mainTitle') }}
    </span>
  </DsfrButton>
</template>
<script setup lang="ts">
import Navigation from '@/tools/navigation'
import { CompanyDataStorageKey } from '@/types'
import Breakpoint from '@/tools/breakpoints'
import { CompanyDataStorage } from '@/tools/companyData'
import Translation from '@/tools/translation'

const registeredData = CompanyDataStorage.getData()
const companyName = computed<string | undefined>(() => {
  return registeredData.value[CompanyDataStorageKey.Company]?.denomination || ''
})
const hasData = computed<boolean>(() => {
  return !!registeredData.value[CompanyDataStorageKey.Company]
})

const isSmallScreen = computed(() => {
  return Breakpoint.isSmallScreen()
})
const badgeIcon = computed(() => {
  if (isSmallScreen && !hasData.value) {
    return 'fr-bg--yellow fr-icon-question-mark'
  } else {
    return 'fr-bg--green fr-icon-check-line'
  }
})

const openModal = () => {
  Navigation.toggleRegisterModal()
}
</script>
<style lang="scss" scoped>
.register-icon-profile {
  position: relative;
  float: left;
}

#register-text {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 180px;
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
  height: 0.8rem;
}

#badge-mobile {
  right: -0.2px;
  top: -4px;
}

#base-badge {
  bottom: 16px;
  left: 13px;
}
</style>
