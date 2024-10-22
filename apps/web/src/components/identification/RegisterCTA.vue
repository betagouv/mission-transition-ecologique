<template>
  <TeeDsfrButton
    :class="registrationStatus ? 'fr-btn--tertiary-no-outline' : ''"
    @click="emit('click')"
  >
    <template #text>
      <span
        v-if="registrationStatus || Breakpoint.isSmallScreen()"
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
        :class="registrationStatus ? '' : 'fr-text--yellow'"
        >{{ registrationStatus ? companyName : 'Vous êtes...?' }}
      </span>
    </template>
  </TeeDsfrButton>
  <RegisterModal v-show="modalStatus" />
</template>
<script setup lang="ts">
import Breakpoint from '@/utils/breakpoints'

interface Props {
  registrationStatus: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['click'])

const badgeIcon = computed(() => {
  if (Breakpoint.isSmallScreen() && !props.registrationStatus) {
    return 'fr-bg--yellow fr-icon-question-mark'
  } else {
    return 'fr-bg--green fr-icon-check-line'
  }
})
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
  right: -0.2px;
  top: -4px;
}

#base-badge {
  bottom: 16px;
  left: 13px;
}
</style>
