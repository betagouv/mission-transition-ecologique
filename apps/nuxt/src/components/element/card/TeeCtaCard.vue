<template>
  <div class="fr-card fr-card--cta fr-card--horizontal fr-card--grey fr-p-4v">
    <div class="fr-card__body">
      <div class="fr-card__content fr-justify-center">
        <h2
          class="fr-card__title fr-text--blue"
          v-html="title"
        />
        <p
          class="fr-card__desc fr-text--md"
          v-html="description"
        />
        <div
          v-if="ctaBtnTitle"
          class="fr-card__end"
        >
          <TeeDsfrButton
            class="inline-flex fr-text--yellow fr-text--bold fr-btn-align-center"
            @click.prevent="onClick()"
          >
            <template #default>
              {{ ctaBtnTitle }}
            </template>
          </TeeDsfrButton>
        </div>
      </div>
    </div>
    <TeeHeaderLogoCard
      :image-src="imageSrc"
      :image-alt="imageAlt"
      :img-bg-color="imgBgColor"
      :object-fit="objectFit"
      :with-logo="withLogo"
    />
  </div>
</template>

<script setup lang="ts">
import { Color } from '@/types'

interface Props {
  title?: string
  description: string
  imageSrc?: string
  imageAlt?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  imgBgColor?: Color
  ctaBtnTitle?: string
  onClick: CallableFunction
  withLogo: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Accédez aux aides publiques pour votre projet de transition écologique',
  imageSrc: undefined,
  imageAlt: undefined,
  objectFit: 'cover',
  imgBgColor: undefined,
  ctaBtnTitle: undefined,
  withLogo: true
})
</script>

<style scoped lang="scss">
@use '@/assets/scss/tool';

.fr-card {
  :hover:not(button, button *) {
    cursor: default !important;
  }
}
</style>
