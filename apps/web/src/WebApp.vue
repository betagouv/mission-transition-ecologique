<template>
  <TeeDsfrConsent />
  <TeeDsfrPersonalizeConsent />
  <div>
    <TeeHeader />
    <TeeRegisterModal v-if="registerModal" />
    <TeeMatomo />
    <router-view v-if="isReady" />
    <template v-else>
      <div class="fr-grid-row--center fr-my-10v">
        <div class="fr-col-12">
          <div class="fr-text-center">
            <TeeSpinner scale="6" />
          </div>
        </div>
      </div>
    </template>

    <div class="fr-mt-0v">
      <TeeFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
//console.log(`WebApp > FUNCTION_NAME > MSG_OR_VALUE :`)

import { onBeforeMount, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNavigationStore } from './stores/navigation'

import TeeFooter from './components/TeeFooter.vue'
import Translation from './utils/translation'
import Cookie from './utils/cookies'
import CompanyDataStorage from './utils/storage/companyDataStorage'

const navigationStore = useNavigationStore()
const router = useRouter()
const route = useRoute()
const registerModal = ref<boolean>(false)
const isReady = computed<boolean>(() => {
  return navigationStore.isReady
})

const toggleRegisterModal = (forceStatus: boolean | undefined) => {
  registerModal.value = forceStatus || !registerModal.value
  document.body.style.overflow = registerModal.value ? 'hidden' : ''
  if (registerModal.value) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}
provide('toggleRegisterModal', toggleRegisterModal)

onBeforeMount(() => {
  Translation.setLocale('fr')
  Cookie.setCookies()
  CompanyDataStorage.updateData()
})

onMounted(async () => {
  // cf: https://stackoverflow.com/questions/69495211/vue3-route-query-empty
  await router.isReady()
  navigationStore.setRouter(router)
  navigationStore.setRoute(route)
})

useHead({
  title: 'Transition écologique - Aides et financements TPE & PME',
  meta: [
    {
      name: 'description',
      content:
        'Service public pour les entreprises : Accédez simplement aux aides, accompagnements et financements pour réduire votre impact environnemental.'
    }
  ]
})
</script>
