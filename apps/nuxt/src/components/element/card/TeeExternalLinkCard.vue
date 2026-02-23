<template>
  <a
    class="tee-external-link-card fr-raw-link"
    :href="link"
    rel="noopener noreferrer"
    aria-label="Lien externe"
  >
    <div class="tee-external-link-card-image">
      <img
        :src="img(image, { quality: 70, loading: 'lazy' })"
        :alt="imageAlt"
      />
    </div>

    <div class="tee-external-link-card-content">
      <img
        class="tee-external-link-card-logo"
        :src="img(logo, { quality: 70, loading: 'lazy' })"
        :alt="logoAlt"
      />
      <p class="tee-external-link-card-description">
        {{ description }}
      </p>
    </div>

    <div class="tee-external-link-card-link fr-icon--lg fr-icon-arrow-right-line fr-text--green"></div>
  </a>
</template>

<script setup lang="ts">
import { Image } from '@/tools/image'
const img = Image.getUrl

defineProps<{
  image: string
  imageAlt: string
  logo: string
  logoAlt: string
  link: string
  description: string
}>()
</script>

<style scoped lang="scss">
.tee-external-link-card {
  display: flex;
  border: 1px solid var(--border-default-grey);
  border-radius: 8px;
  overflow: hidden;
  min-height: 12rem;
  max-height: 20rem;
  position: relative;
  height: 100%;

  &-link {
    position: absolute;
    right: 1rem;
    bottom: 0.5rem;
    font-size: 0;
  }

  &:hover &-link {
    transform: translateX(4px);
  }

  &-image {
    flex: 0 0 50%;

    img {
      padding: 1rem;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &-content {
    padding: 1rem 0.5rem;
  }

  &-logo {
    max-width: 70%;
    max-height: 5rem;
    width: auto;
    height: auto;
    object-fit: contain;
    display: block;
  }

  &-description {
    font-size: 0.875rem;
    margin: 1rem 4rem 0 0;
  }
}
</style>
