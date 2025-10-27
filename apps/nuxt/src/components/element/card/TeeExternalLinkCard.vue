<template>
  <div class="tee-external-link-card">
    <div class="tee-external-link-card-image">
      <img
        :src="image"
        :alt="imageAlt"
      />
    </div>

    <div class="tee-external-link-card-content">
      <img
        class="tee-external-link-card-logo"
        :src="logo"
        :alt="logoAlt"
      />
      <p class="tee-external-link-card-description">
        {{ description }}
      </p>
    </div>

    <a
      class="tee-external-link-card-link fr-icon--lg fr-icon-arrow-right-line fr-text--green"
      :href="link"
      rel="noopener noreferrer"
      aria-label="Lien externe"
    >
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  imageAlt: string
  logo: string
  logoAlt: string
  link: string
  description: string
}>()
</script>

<style scoped>
.tee-external-link-card {
  display: flex;
  border: 1px solid var(--border-default-grey);
  border-radius: 8px;
  overflow: hidden;
  min-height: 12rem;
  max-height: 20rem;
  position: relative;
}

.tee-external-link-card-image {
  flex: 0 0 50%;
}

.tee-external-link-card-image img {
  padding: 1rem;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tee-external-link-card-content {
  padding: 1rem 0.5rem;
}

.tee-external-link-card-logo {
  max-width: 70%;
  max-height: 5rem;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}

.tee-external-link-card-description {
  font-size: 0.875rem;
  color: var(--text-default-grey);
  margin: 1rem 4rem 0 0;
}

.tee-external-link-card-link {
  position: absolute;
  right: 1rem;
  bottom: 0.5rem;
  text-decoration: none;
  font-size: 0rem;
}

.tee-external-link-card-link:hover {
  transform: translateX(4px);
}
</style>
