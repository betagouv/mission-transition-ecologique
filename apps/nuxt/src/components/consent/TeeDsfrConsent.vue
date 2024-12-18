<template>
  <div
    id="tee-consent-popup"
    ref="$el"
    class="fr-consent-banner"
  >
    <div class="fr-consent-banner__content">
      <p class="fr-text--sm">
        Bienvenue ! Nous utilisons des cookies pour améliorer votre expérience et les services disponibles sur ce site. Pour en savoir plus,
        visitez la page
        <router-link :to="{ name: RouteName.PersonalData }"> Données personnelles et cookies </router-link>. Vous pouvez, à tout moment,
        avoir le contrôle sur les cookies que vous souhaitez activer.
      </p>
    </div>
    <ul class="fr-consent-banner__buttons fr-btns-group fr-btns-group--right fr-btns-group--inline-reverse fr-btns-group--inline-sm">
      <li>
        <TeeDsfrButton
          label="Accepter"
          @click="onAcceptAll"
        />
      </li>
      <li>
        <TeeDsfrButton
          label="Refuser"
          @click="onRefuseAll"
        />
      </li>
      <li>
        <TeeDsfrButton
          label="Personnaliser"
          secondary
          @click="openCustomize"
        />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import Cookie from '@/tools/cookies'
import { RouteName } from '@/types'

const $el = ref<HTMLElement | null>(null)

const onAcceptAll = () => {
  Cookie.acceptAllCookies()
  closeCustomize()
}
const onRefuseAll = () => {
  Cookie.refuseAllCookies()
  closeCustomize()
}
const openCustomize = () => {
  const modal = document.getElementById('fr-consent-modal')
  if (modal) {
    modal.classList.add('fr-modal--opened')
  }
}
const closeCustomize = () => {
  $el.value?.classList.add('fr-hidden')
}

onMounted(() => {
  if (Cookie.areCookiesSet()) {
    closeCustomize()
  }
})
</script>
