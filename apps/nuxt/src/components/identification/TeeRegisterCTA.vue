<template>
  <DsfrButton
    :class="isDataFull ? `fr-btn--tertiary-no-outline` : `fr-btn-bg--blue-agir`"
    class="ignore-modal-click"
    :title="isDataFull ? companyName : undefined"
    @click="openModal"
  >
    <span
      v-if="(!isDataFull && isSmallScreen) || isDataFull"
      :class="isSmallScreen ? 'fr-icon--lg' : 'fr-pr-2w'"
      class="fr-icon-account-circle-fill register-icon-profile ignore-modal-click"
    >
      <span
        :id="isSmallScreen ? 'badge-mobile' : 'base-badge'"
        :class="badgeIcon"
        class="fr-text--blue-900 fr-radius-a--2v ignore-modal-click register-badge"
      >
      </span>
    </span>

    <span
      v-if="!isSmallScreen"
      id="register-text"
      :class="isDataFull ? `` : `ignore-modal-click`"
    >
      {{ isDataFull ? companyName : Translation.t('register.mainTitle') }}
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
const { isDataFull } = storeToRefs(useCompanyDataStore())
const companyName = computed<string | undefined>(() => {
  return registeredData.value[CompanyDataStorageKey.Company]?.denomination || ''
})

const isSmallScreen = computed(() => {
  return Breakpoint.isSmallScreen()
})
const badgeIcon = computed(() => {
  if (isSmallScreen && !isDataFull.value) {
    return 'fr-bg--yellow fr-icon-question-mark'
  } else {
    return 'fr-bg--green fr-icon-check-line'
  }
})

const openModal = () => {
  useNavigationStore().resetFromCtaRegisterModal()
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
