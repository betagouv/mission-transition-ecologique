<template>
  <TeeContentBlock
    id="activation"
    :title="Translation.t('program.programActivation')"
    container-from="md"
    class="fr-py-5v fr-border-t--grey--light"
    title-class="fr-h4"
  >
    <template #content>
      <ol class="fr-order-list">
        <li
          v-if="!isDataFull && showRegistrationStep"
          class="fr-mb-4v fr-mb-md-2v"
        >
          <div class="fr-mb-0 fr-ml-0">{{ Translation.t('program.programActivationRegistration') }}</div>
          <DsfrButton
            primary
            class="fr-my-1v"
            @click="openModal"
          >
            {{ Translation.t('results.eligibilityCheckCTA') }}
          </DsfrButton>
        </li>
        <li
          v-for="(content, idx) in program?.objectifs"
          :key="`description-paragraph-${idx}`"
          class="fr-mb-4v fr-mb-md-2v"
        >
          <div class="fr-mb-0 fr-ml-0">
            <div
              class="fr-tee-description-paragraph-content"
              v-html="Marked.toHtml(content.description)"
            />
          </div>
          <div v-if="content.liens">
            <template
              v-for="(link, linkId) in content.liens"
              :key="`link-${idx}-${linkId}`"
            >
              <TeeButtonExternalLink
                v-if="`lien` in link && link.lien"
                :href="link.lien"
                class="fr-my-1v fr-mr-md-2v"
              >
                {{ link.texte }}
              </TeeButtonExternalLink>
              <DsfrButton
                v-if="`formulaire` in link && link.formulaire && isFormVisible"
                secondary
                icon="fr-icon-mail-line"
                size="md"
                class="fr-my-1v fr-mr-md-2v overwrite-button-style"
                :on-click="() => scrollToForm()"
              >
                {{ Translation.t('program.ctaForm') }}
              </DsfrButton>
            </template>
          </div>
        </li>
      </ol>
    </template>
  </TeeContentBlock>
</template>

<script setup lang="ts">
import AbstractProgram from '@/tools/program/abstractProgram'
import Translation from '@/tools/translation'
import { Marked } from '@/tools/marked'
import Navigation from '@/tools/navigation'

interface Props {
  scrollToForm: () => void
  isFormVisible: boolean
  showRegistrationStep?: boolean
}

withDefaults(defineProps<Props>(), {
  showRegistrationStep: true
})

const { isDataFull } = storeToRefs(useCompanyDataStore())
const program = AbstractProgram.getCurrent()

const openModal = () => {
  useNavigationStore().resetFromCtaRegisterModal()
  Navigation.toggleRegisterModal()
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/setting';

.overwrite-button-style {
  box-shadow: inset 0 0 0 1px setting.$purple;
  color: setting.$purple !important;
  text-align: center;
  font-size: 0.875rem;
}
</style>
