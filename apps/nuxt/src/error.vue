<template>
  <NuxtLayout>
    <div class="fr-container">
      <div class="fr-my-7w fr-mt-md-12w fr-mb-md-10w fr-grid-row fr-grid-row--gutters fr-grid-row--middle fr-grid-row--center">
        <div class="fr-py-0 fr-col-12 fr-col-md-6">
          <h1>Page non trouvée</h1>
          <p class="fr-text--sm fr-mb-3w">{{ `Erreur ${error.statusCode}` }}</p>
          <p class="fr-text--lead fr-mb-3w">{{ leadText }}</p>
          <p class="fr-text--sm fr-mb-5w">{{ errorText }}</p>
          <TeeDsfrButton
            v-if="error.statusCode === 404"
            label="Page d'accueil"
            @click="toHomePage"
          />
          <ContactButton v-else />
        </div>
        <div class="fr-col-12 fr-col-md-3 fr-col-offset-md-1 fr-px-6w fr-px-md-0 fr-py-0">
          <img
            class="fr-footer__logo fr-responsive-img"
            src="/images/tracks/no-results.png"
            alt="illustration page d'erreur"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import { type RouteLocationAsRelativeGeneric } from 'vue-router'
import type { NuxtError } from 'nuxt/app'

export interface Props {
  error: NuxtError
}
const props = defineProps<Props>()

const router = useRouter()

const routeToBaseList: RouteLocationAsRelativeGeneric = {
  name: RouteName.Homepage
}
const toHomePage = async () => {
  await router.push(routeToBaseList)
}
const error404Text =
  "Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n’est peut-être plus disponible. Dans ce cas, pour continuer votre visite vous pouvez consulter notre page d’accueil, ou effectuer une recherche avec notre moteur de recherche en haut de page. Sinon contactez-nous pour que l’on puisse vous rediriger vers la bonne information."
const error500Text = 'Essayez de rafraîchir la page ou bien réessayez plus tard.'

const leadText = computed<string>(() => {
  if (props.error.statusCode === 404) {
    return 'La page que vous cherchez est introuvable. Excusez-nous pour la gène occasionnée.'
  } else {
    return 'Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible'
  }
})
const errorText = computed<string>(() => {
  if (props.error.statusCode === 404) {
    return error404Text
  } else {
    return error500Text
  }
})
</script>
