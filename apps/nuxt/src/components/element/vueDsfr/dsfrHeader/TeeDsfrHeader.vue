<template>
  <header
    role="banner"
    class="fr-header"
    :class="navigation.isHomepage() ? 'fr-sticky' : ''"
  >
    <div class="fr-header__body">
      <div class="fr-container width-inherit">
        <div class="fr-header__body-row">
          <div class="fr-header__brand fr-enlarge-link">
            <div class="fr-header__brand-top">
              <div class="fr-header__logo">
                <RouterLink
                  :to="homeTo"
                  :title
                >
                  <DsfrLogo
                    :logo-text="logoText"
                    data-testid="header-logo"
                  />
                </RouterLink>
              </div>
              <div
                v-if="showSearch || isWithSlotNav || quickLinks?.length"
                class="fr-header__navbar"
              >
                <button
                  v-if="showSearch"
                  class="fr-btn fr-btn--search"
                  aria-controls="header-search"
                  :aria-label="showSearchLabel"
                  :title="showSearchLabel"
                  :data-fr-opened="searchModalOpened"
                  @click.prevent.stop="showSearchModal()"
                />
                <div class="fr-hidden-lg">
                  <TeeRegisterCTA />
                </div>
                <button
                  v-if="isWithSlotNav || quickLinks?.length"
                  id="button-menu"
                  class="fr-btn--menu fr-btn"
                  :data-fr-opened="showMenu"
                  aria-controls="header-navigation"
                  aria-haspopup="dialog"
                  :aria-label="menuLabel"
                  :title="menuLabel"
                  data-testid="open-menu-btn"
                  @click.prevent.stop="showMenu()"
                />
              </div>
            </div>
            <div
              v-if="serviceTitle"
              class="fr-header__service"
            >
              <RouterLink
                :to="homeTo"
                :title
                v-bind="$attrs"
              >
                <div class="fr-header__service-title">
                  <img src="/images/logos/ademe.svg" />
                  <img src="/images/logos/mission-transition-ecologique-logo-texte.svg" />
                  <img src="/images/logos/agir.svg" />
                </div>
              </RouterLink>
            </div>
            <div
              v-if="!serviceTitle && showBeta"
              class="fr-header__service"
            >
              <p class="fr-header__service-title">
                <span class="fr-badge fr-badge--sm fr-badge--green-emeraude">BETA</span>
              </p>
            </div>
          </div>
          <div class="fr-header__tools">
            <div
              v-if="quickLinks?.length || languageSelector"
              class="fr-header__tools-links"
            >
              <slot name="before-quick-links" />
              <TeeDsfrHeaderMenuLinks
                v-if="!menuOpened"
                :links="quickLinks"
                :nav-aria-label="quickLinksAriaLabel"
              />
              <slot name="after-quick-links" />
              <template v-if="languageSelector">
                <DsfrLanguageSelector
                  v-bind="languageSelector"
                  @select="emit('languageSelect', $event)"
                />
              </template>
            </div>
            <div class="fr-my-auto fr-px-4v fr-hidden fr-unhidden-lg">
              <TeeRegisterCTA />
            </div>
            <div
              v-if="showSearch"
              class="fr-header__search fr-modal"
            >
              <DsfrSearchBar
                :id="searchbarId"
                :label="searchLabel"
                :model-value="modelValue"
                :placeholder="placeholder"
                style="justify-content: flex-end"
                @update:model-value="emit('update:modelValue', $event)"
                @search="emit('search', $event)"
              />
            </div>
          </div>
        </div>
        <div
          v-if="showSearch || isWithSlotNav || (quickLinks && quickLinks.length) || languageSelector"
          id="header-navigation"
          class="fr-header__menu fr-modal"
          :class="{ 'fr-modal--opened': modalOpened }"
          :aria-label="menuModalLabel"
          role="dialog"
          aria-modal="true"
        >
          <div class="fr-container">
            <button
              id="close-button"
              class="fr-btn fr-btn--close"
              aria-controls="header-navigation"
              data-testid="close-modal-btn"
              @click.prevent.stop="hideModal()"
            >
              {{ closeMenuModalLabel }}
            </button>
            <div class="fr-header__menu-links">
              <template v-if="languageSelector">
                <DsfrLanguageSelector
                  v-bind="languageSelector"
                  @select="languageSelector.currentLanguage = $event.codeIso"
                />
              </template>
              <slot name="before-quick-links" />
              <nav role="navigation">
                <TeeDsfrHeaderMenuLinks
                  v-if="menuOpened"
                  role="navigation"
                  :links="quickLinks"
                  :nav-aria-label="quickLinksAriaLabel"
                  @link-click="onQuickLinkClick"
                />
              </nav>
              <slot name="after-quick-links" />
            </div>

            <template v-if="modalOpened">
              <slot
                name="mainnav"
                :hidemodal="hideModal"
              />
            </template>
            <div
              v-if="searchModalOpened"
              class="flex justify-center items-center"
            >
              <DsfrSearchBar
                :searchbar-id="searchbarId"
                :model-value="modelValue"
                :placeholder="placeholder"
                @update:model-value="emit('update:modelValue', $event)"
                @search="emit('search', $event)"
              />
            </div>
          </div>
        </div>
        <!-- @slot Slot par défaut pour le contenu du fieldset (sera dans `<div class="fr-header__body-row">`) -->
        <slot />
      </div>
    </div>
    <div class="fr-header__menu fr-modal">
      <div
        v-if="isWithSlotNav && !modalOpened"
        class="fr-container"
      >
        <!-- @slot Slot nommé mainnav pour le menu de navigation principal -->
        <slot
          name="mainnav"
          :hidemodal="hideModal"
        />
      </div>
    </div>
  </header>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, toRef, useSlots } from 'vue'
import { DsfrLanguageSelector, DsfrLogo, DsfrSearchBar, registerNavigationLinkKey } from '@gouvminint/vue-dsfr'
import type { DsfrLanguageSelectorElement } from '@gouvminint/vue-dsfr/types/components/DsfrLanguageSelector/DsfrLanguageSelector.vue'
import type { DsfrHeaderProps } from '@gouvminint/vue-dsfr/types/components/DsfrHeader/DsfrHeader.vue'
import Navigation from '@/tools/navigation'

const props = withDefaults(defineProps<DsfrHeaderProps>(), {
  searchbarId: 'searchbar-header',
  languageSelector: undefined,
  serviceTitle: undefined,
  serviceDescription: undefined,
  homeTo: '/',
  logoText: () => 'Gouvernement',
  modelValue: '',
  operatorImgAlt: '',
  operatorImgSrc: '',
  operatorImgStyle: () => ({}),
  placeholder: 'Rechercher...',
  quickLinks: () => [],
  searchLabel: 'Recherche',
  quickLinksAriaLabel: 'Menu secondaire',
  showSearchLabel: 'Recherche',
  menuLabel: 'Menu',
  menuModalLabel: 'Menu',
  closeMenuModalLabel: 'Fermer',
  homeLabel: 'Accueil'
})

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string): void
  (e: 'search', payload: string): void
  (e: 'languageSelect', payload: DsfrLanguageSelectorElement): void
}>()

const navigation = new Navigation()
const languageSelector = toRef(props, 'languageSelector')

const menuOpened = ref(false)
const searchModalOpened = ref(false)
const modalOpened = ref(false)

const hideModal = () => {
  modalOpened.value = false
  menuOpened.value = false
  searchModalOpened.value = false
  document.getElementById('button-menu')?.focus()
}
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    hideModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})

const showMenu = () => {
  modalOpened.value = true
  menuOpened.value = true
  searchModalOpened.value = false
  // Sans le setTimeout, le focus n'est pas fait
  setTimeout(() => {
    document.getElementById('close-button')?.focus()
  })
}
const showSearchModal = () => {
  modalOpened.value = true
  menuOpened.value = false
  searchModalOpened.value = true
}
const onQuickLinkClick = hideModal

const title = computed(() => [props.homeLabel, props.serviceTitle].filter((x) => x).join(' - '))

const slots = useSlots()
const isWithSlotOperator = computed(() => Boolean(slots.operator?.().length) || !!props.operatorImgSrc)
const isWithSlotNav = computed(() => Boolean(slots.mainnav))
provide(registerNavigationLinkKey, () => {
  return hideModal
})
</script>

<style scoped>
.fr-header__service-title {
  display: flex;
  align-items: center; /* vertically align images */
  gap: 1rem; /* horizontal spacing */
  height: 60px; /* set the desired header height */
}

.fr-header__service-title img {
  height: 100%; /* image height matches the div */
  width: auto; /* preserve aspect ratio */
  object-fit: contain; /* ensure logos scale nicely */
}
</style>
