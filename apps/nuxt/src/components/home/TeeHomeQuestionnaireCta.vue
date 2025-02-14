<template>
  <DsfrCard
    :title="title"
    :description="description"
    :no-arrow="true"
    :buttons="buttons"
    class="fr-bg--blue-france--lightness fr-radius-a--1v fr-card--shadow fr-text-center"
  >
  </DsfrCard>
</template>
<script setup lang="ts">
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { RouteName } from '@/types'
import { DsfrButtonProps } from '@gouvminint/vue-dsfr/types/components/DsfrButton/DsfrButton.vue'
interface Props {
  title: string
  description: string
}

const buttons: DsfrButtonProps[] = [
  {
    label: "J'identifie mes projets prioritaires",
    secondary: true,
    onClick: (event: MouseEvent) => {
      event.preventDefault()
      toQuestionnaire()
    }
  }
]

const router = useRouter()

withDefaults(defineProps<Props>(), {
  title: 'Vous ne savez pas par où commencer ?',
  description:
    'Complétez le profil de votre entreprise\n' +
    ' et accédez à des propositions d’actions et de financements pour vous aider à réduire votre impact environnemental.'
})

const toQuestionnaire = async () => {
  return await router.push({
    name: RouteName.QuestionnaireStart
  })
}

// const launchQuestionnaire = async () => {
//   usedTrackStore.resetUsedTracks()
//   await usedTrackStore.updateByTrackIdAndValue(TrackId.QuestionnaireRoute, QuestionnaireRoute.SpecificGoal)
//   await router.push(navigationStore.routeByTrackId(TrackId.Siret))
// }
</script>
<style scoped lang="scss">
@use '@/assets/scss/setting';
:deep(.fr-card__title) {
  color: setting.$blue-france;
}
:deep(.fr-card__content) {
  padding: 3rem 1rem;
}
:deep(.fr-card__footer button span) {
  font-weight: bold;
}
</style>
n
