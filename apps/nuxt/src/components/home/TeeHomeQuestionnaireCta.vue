<template>
  <div class="fr-card fr-bg--blue-france--lightness fr-enlarge-link fr-radius-a--1v fr-card--shadow fr-text-center fr-pt-7v">
    <div class="fr-card__body">
      <div class="fr-card__content">
        <h4 class="fr-card__title fr-text--blue-france fr-my-0">
          Vous ne savez pas<span class="fr-display--block">par où commencer ?</span>
        </h4>
        <p
          class="fr-card__desc fr-text--sm fr-pt-4w fr-pb-2w fr-mt-0"
          v-html="htmlDescription"
        />
        <DsfrButton
          :key="button.label"
          :label="button.label"
          :secondary="button.secondary"
          class="fr-card__desc fr-btn--tertiary-no-outline fr-text--bold fr-text--md"
          :class="{ 'fr-bg--purple--light': button.isHovering.value }"
          @mouseover="button.isHovering.value = true"
          @mouseleave="button.isHovering.value = false"
          @click="toQuestionnaire"
        ></DsfrButton>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouteName } from '@/types'
import { DsfrButtonProps } from '@gouvminint/vue-dsfr/types/components/DsfrButton/DsfrButton.vue'
import Navigation from '@/tools/navigation'
import { useCompanyDataStore } from '@/stores/companyData'
interface Props {
  htmlDescription: string
}

const button: DsfrButtonProps & { isHovering: Ref<boolean> } = {
  label: "J'identifie mes projets prioritaires",
  secondary: true,
  isHovering: ref(false)
}

const router = useRouter()
const { isDataFull } = storeToRefs(useCompanyDataStore())

withDefaults(defineProps<Props>(), {
  htmlDescription:
    'En moins de 2 minutes, répondez à quelques questions pour identifier vos <strong>projets prioritaires</strong>' +
    ' et les <strong>financements</strong> disponibles pour votre entreprise'
})
const toQuestionnaire = async () => {
  if (isDataFull.value) {
    await router.push({
      name: RouteName.QuestionnaireStart
    })
  } else {
    useNavigationStore().setFromQuestionnaireCtaRegisterModal(true)
    Navigation.toggleRegisterModal()
  }
}
</script>
