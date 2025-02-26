<template>
  <TeeContentBlock
    class="fr-bg--blue-france--lightness fr-radius-a--1v fr-card--shadow fr-text-center fr-pt-7w fr-pb-2w fr-px-3w fr-div-fixed-height"
  >
    <template #title>
      <span
        class="title fr-text--bold fr-text--blue-france"
        v-html="htmlTitle"
      />
    </template>
    <template #content>
      <p
        class="fr-text--sm fr-pt-4w fr-pb-2w"
        v-html="htmlDescription"
      />
      <DsfrButton
        :key="button.label"
        :label="button.label"
        :secondary="button.secondary"
        class="fr-btn--tertiary-no-outline fr-mx-1w fr-text--bold"
        :class="{ 'fr-bg--blue-france--light': button.isHovering.value }"
        @mouseover="button.isHovering.value = true"
        @mouseleave="button.isHovering.value = false"
        @click="toQuestionnaire"
      ></DsfrButton>
    </template>
  </TeeContentBlock>
</template>
<script setup lang="ts">
import { RouteName } from '@/types'
import { DsfrButtonProps } from '@gouvminint/vue-dsfr/types/components/DsfrButton/DsfrButton.vue'
import Navigation from '@/tools/navigation'
import { useCompanyDataStore } from '@/stores/companyData'
interface Props {
  htmlTitle: string
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
  htmlTitle: 'Vous ne savez pas</br> par où commencer ?',
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
<style scoped lang="scss">
.title {
  font-size: 1.375rem;
  line-height: 1.75rem;
}
</style>
n
