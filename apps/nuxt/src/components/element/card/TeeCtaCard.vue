<template>
  <div class="fr-card fr-card--cta fr-card--horizontal fr-card--grey fr-p-4v">
    <div class="fr-card__body">
      <div class="fr-card__content fr-justify-center">
        <h2
          class="fr-card__title fr-text--blue"
          v-html="resolvedTitle"
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
    />
  </div>
</template>

<script setup lang="ts">
import { Image } from '@/tools/image'
import { computed } from 'vue'
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
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  imageSrc: undefined,
  imageAlt: undefined,
  objectFit: 'cover',
  imgBgColor: undefined,
  ctaBtnTitle: undefined
})

const defaultTitle = 'Accédez aux aides publiques pour votre projet de transition écologique'
const defaultImageSrc = 'images/TEE_computer_home.webp'
const defaultImageAlt = "Image de la page d'accueil de mission transition écologique"

const resolvedTitle = computed(() => props.title || defaultTitle)
const resolvedImageSrc = computed(() =>
  props.imageSrc
    ? img(props.imageSrc, { height: 250, quality: 70, loading: 'lazy' })
    : img(defaultImageSrc, { height: 350, quality: 100, loading: 'lazy' })
)
const resolvedImageAlt = computed(() => props.imageAlt || defaultImageAlt)

const img = Image.getUrl
</script>

<style scoped lang="scss">
@use '@/assets/scss/tool';

.fr-card {
  :hover:not(button, button *) {
    cursor: default !important;
  }
}
</style>
