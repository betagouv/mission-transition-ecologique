<script lang="ts" setup>
import { Identity } from '@/tools/identity'
import { Image } from '@/tools/image'
import { computed } from 'vue'
import { Color } from '@/types'

interface Props {
  imageSrc?: string
  imageAlt?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  imgBgColor?: Color
  withLogo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  imageSrc: undefined,
  imageAlt: "Image de la page d'accueil de mission transition écologique",
  objectFit: 'cover',
  imgBgColor: undefined,
  withLogo: true
})

const defaultImageSrc = 'images/TEE_computer_home.webp'

const resolvedImageSrc = computed(() =>
  props.imageSrc
    ? img(props.imageSrc, { height: 250, quality: 70, loading: 'lazy' })
    : img(defaultImageSrc, { height: 350, quality: 100, loading: 'lazy' })
)

const img = Image.getUrl
</script>

<template>
  <div class="fr-card__header">
    <div
      class="fr-card__img"
      :class="[imgBgColor ? `fr-bg--${imgBgColor}` : '', objectFit === 'contain' ? 'fr-card__img--contain' : '']"
    >
      <img
        class="fr-responsive-img"
        :src="resolvedImageSrc"
        :alt="imageAlt"
      />
      <img
        v-if="withLogo"
        class="fr-card__logo"
        :src="Identity.logoPath"
        alt="Transition écologique des entreprises - ADEME"
      />
    </div>
  </div>
</template>
