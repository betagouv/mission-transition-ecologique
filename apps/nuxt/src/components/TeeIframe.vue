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
              <div>
                <img
                  class="fr-responsive-img image-with-gradient"
                  :src="resolvedImageSrc"
                  :alt="resolvedImageAlt"
                />
              </div>
              <img
                class="fr-card__logo"
                src="/images/logos/mission-transition-logo-alone.png"
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
const resolvedImageSrc = computed(() => props.imageSrc || defaultImageSrc)
const resolvedImageAlt = computed(() => props.imageAlt || defaultImageAlt)

const imageResizerChild = () => import('@iframe-resizer/child')
imageResizerChild()
</script>

<style scoped lang="scss">
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
    img {
      max-height: 250px;
    }

    div {
      height: 100%;

      &:first-child::after {
        content: '';
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background: linear-gradient(to bottom right, rgb(255 255 255 / 0%) 70%, rgb(255 255 255 / 100%) 95%) !important;
      }
    }
  }

  .fr-card__logo {
    position: absolute;
    width: 50px;
    bottom: 0;
    height: 50px;
    right: 0;
  }
}
</style>
