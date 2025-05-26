<template>
  <div class="fr-container fr-px-0">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <div class="fr-card fr-enlarge-link fr-card--horizontal fr-card--icon-link fr-card--grey fr-p-4v fr-card--no-border">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-card__title">
                <a
                  :href="resolvedLink"
                  target="_blank"
                  rel="noopener external"
                >
                  {{ resolvedTitle }}
                </a>
              </h3>
              <p class="fr-card__desc fr-text--md">
                Le service public <strong>Transition écologique des entreprises</strong> vous permet de trouver les aides, accompagnements
                et ressources issues de l'ensemble des acteurs publics pour vous aider à réaliser votre projet de transition écologique
                (ADEME, CCI, CMA, Bpifrance, DGFiP, etc.)
              </p>
              <div class="fr-card__start"></div>
            </div>
          </div>
          <div class="fr-card__header">
            <div class="fr-card__img">
              <img
                class="fr-responsive-img"
                :src="resolvedImageSrc"
                :alt="resolvedImageAlt"
              />
              <img
                class="fr-card__logo"
                :src="img('/images/logos/mission-transition-logo-alone.png', { height: 50, width: 50, quality: 100, loading: 'lazy' })"
                alt="Transition Ecologique des Entreprises - ADEME"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Image } from '@/tools/image'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { RouteName } from '@/types'

const props = defineProps<{
  link?: string
  title?: string
  imageSrc?: string
  imageAlt?: string
}>()

const router = useRouter()

const defaultLink = router.resolve({ name: RouteName.Homepage }).href
const defaultTitle = 'Accédez aux aides publiques pour votre projet de transition écologique'
const defaultImageSrc = 'images/TEE_iframe.webp'
const defaultImageAlt = "Image de la page d'accueil de mission transition écologique"

const resolvedLink = computed(() => props.link || defaultLink)
const resolvedTitle = computed(() => props.title || defaultTitle)
const resolvedImageSrc = computed(() =>
  props.imageSrc
    ? img(props.imageSrc, { height: 250, quality: 70, loading: 'lazy' })
    : img(defaultImageSrc, { height: 350, quality: 100, loading: 'lazy' })
)
const resolvedImageAlt = computed(() => props.imageAlt || defaultImageAlt)

const img = Image.getUrl

const imageResizerChild = () => import('@iframe-resizer/child')
imageResizerChild()
</script>

<style scoped lang="scss">
@use '@/assets/scss/tool';

.fr-card {
  .fr-card__title {
    a::after {
      display: inline-block !important;
    }
  }

  .fr-card__header {
    flex-basis: 25%;
  }

  .fr-card__img {
    position: relative;

    img {
      max-height: 250px;
    }

    @include tool.media-query-respond-from(md) {
      img {
        max-height: 350px;
      }
    }

    &::after {
      content: '';
      position: absolute;
      z-index: 0; // Lower layer
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(to bottom right, rgb(255 255 255 / 0%) 70%, rgb(255 255 255 / 100%) 95%) !important;
    }

    .fr-card__logo {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 50px;
      height: 50px;
      z-index: 1; // Higher than the gradient
    }
  }
}
</style>
