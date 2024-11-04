<template>
  <Transition
    name="fade"
    mode="out-in"
  >
    <TeeDsfrButton
      v-if="hasData"
      class="fr-btn--tertiary-no-outline"
      @click="openModal"
    >
      <span
        v-if="hasData || Breakpoint.isSmallScreen()"
        :class="Breakpoint.isSmallScreen() ? 'fr-icon--lg' : 'fr-pr-2w'"
        class="fr-icon-account-circle-fill register-icon-profile"
      >
        <span
          :id="Breakpoint.isSmallScreen() ? 'badge-mobile' : 'base-badge'"
          :class="badgeIcon"
          class="fr-text--blue-france fr-radius-a--2v register-badge"
        >
        </span>
      </span>

      <span
        v-if="!Breakpoint.isSmallScreen()"
        id="register-text"
        >{{ companyName }}
      </span>
    </TeeDsfrButton>
    <TeeDsfrButton
      v-else
      @click="openModal"
    >
      <span
        v-if="Breakpoint.isSmallScreen()"
        :class="Breakpoint.isSmallScreen() ? 'fr-icon--lg' : 'fr-pr-2w'"
        class="fr-icon-account-circle-fill register-icon-profile"
      >
        <span
          :id="Breakpoint.isSmallScreen() ? 'badge-mobile' : 'base-badge'"
          :class="badgeIcon"
          class="fr-text--blue-france fr-radius-a--2v register-badge"
        >
        </span>
      </span>

      <span
        v-if="!Breakpoint.isSmallScreen()"
        id="register-text"
        class="fr-text--yellow"
      >
        {{ Translation.t('register.mainTitle') }}
      </span>
    </TeeDsfrButton>
  </Transition>
</template>
<script setup lang="ts">
import { CompanyDataStorageKey } from '@/types'
import Breakpoint from '@/utils/breakpoints'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import Translation from '@/utils/translation'

const registeredData = CompanyDataStorage.getData()
const toggleRegisterModal = inject<(v?: boolean) => void>('toggleRegisterModal')

watch(
  registeredData,
  (newRegisteredData) => {
    registeredData.value = newRegisteredData
  },
  { deep: true }
)

const companyName = computed<string | undefined>(() => {
  return registeredData.value[CompanyDataStorageKey.Company]?.denomination || ''
})
const hasData = computed<boolean>(() => {
  return !!registeredData.value[CompanyDataStorageKey.Company]
})
const openModal = () => {
  if (toggleRegisterModal) {
    toggleRegisterModal()
  }
}

const badgeIcon = computed(() => {
  if (Breakpoint.isSmallScreen() && !hasData.value) {
    return 'fr-bg--yellow fr-icon-question-mark'
  } else {
    return 'fr-bg--green fr-icon-check-line'
  }
})
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
  right: -0.2px;
  top: -4px;
}

#base-badge {
  bottom: 16px;
  left: 13px;
}
</style>
