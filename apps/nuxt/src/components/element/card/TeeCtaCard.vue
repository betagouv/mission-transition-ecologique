<template>
  <div class="fr-container fr-px-0">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <div
          class="fr-card fr-enlarge-link fr-card--horizontal fr-card--grey fr-p-4v fr-card--no-border"
          :class="{ 'fr-card--no-icon': target === '_self' }"
        >
          <div class="fr-card__body">
            <div class="fr-card__content fr-justify-center">
              <component
                :is="titleTag"
                class="fr-card__title"
              >
                <a
                  v-if="onClick"
                  href="#"
                  :target="target"
                  :rel="target === '_blank' ? 'noopener external' : 'noopener'"
                  @click.prevent="onClick()"
                  v-html="resolvedTitle"
                />
                <a
                  v-else
                  :href="resolvedLink"
                  :target="target"
                  :rel="target === '_blank' ? 'noopener external' : 'noopener'"
                  v-html="resolvedTitle"
                />
              </component>
              <p
                class="fr-card__desc fr-text--md"
                v-html="resolvedDescription"
              />
              <div
                v-if="ctaBtnTitle"
                class="fr-card__end"
              >
                <TeeDsfrButton class="inline-flex fr-text--yellow fr-text--bold fr-btn-align-center">
                  <template #default>
                    {{ ctaBtnTitle }}
                  </template>
                </TeeDsfrButton>
              </div>
            </div>
          </div>
          <div class="fr-card__header">
            <div
              class="fr-card__img"
              :class="[bgColor ? `fr-bg--${bgColor}` : '', objectFit === 'contain' ? 'fr-card__img--contain' : '']"
            >
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
import { Color, RouteName } from '@/types'

interface Props {
  link?: string
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  bgColor?: Color
  ctaBtnTitle?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  onClick?: CallableFunction
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  withIframeResizer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  link: undefined,
  title: undefined,
  imageSrc: undefined,
  imageAlt: undefined,
  objectFit: 'cover',
  bgColor: undefined,
  ctaBtnTitle: undefined,
  target: '_blank',
  onClick: undefined,
  titleTag: 'h3',
  withIframeResizer: true
})

const router = useRouter()

const defaultLink = router.resolve({ name: RouteName.Homepage }).href
const defaultTitle = 'Accédez aux aides publiques pour votre projet de transition écologique'
const defaultImageSrc = 'images/TEE_iframe_transparent.webp'
const defaultImageAlt = "Image de la page d'accueil de mission transition écologique"

const resolvedLink = computed(() => props.link || defaultLink)
const resolvedTitle = computed(() => props.title || defaultTitle)
const resolvedDescription = computed(
  () =>
    props.description ||
    'Le service public <strong>Transition écologique des entreprises</strong> vous permet de trouver les aides, accompagnements' +
      "et ressources issues de l'ensemble des acteurs publics pour vous aider à réaliser votre projet de transition écologique" +
      '(ADEME, CCI, CMA, Bpifrance, DGFiP, etc.)'
)
const resolvedImageSrc = computed(() =>
  props.imageSrc
    ? img(props.imageSrc, { height: 250, quality: 70, loading: 'lazy' })
    : img(defaultImageSrc, { height: 350, quality: 100, loading: 'lazy' })
)
const resolvedImageAlt = computed(() => props.imageAlt || defaultImageAlt)

const img = Image.getUrl

if (props.withIframeResizer) {
  const imageResizerChild = () => import('@iframe-resizer/child')
  imageResizerChild()
}
</script>

<style scoped lang="scss">
@use '@/assets/scss/tool';

.fr-card {
  .fr-card--no-icon {
    a::after {
      display: none !important;
    }
  }

  .fr-card__title {
    a {
      background-image: none;
      outline-width: 0;

      &::after {
        display: inline-block !important;
      }
    }
  }

  @include tool.media-query-respond-from(md) {
    .fr-card__header {
      flex-basis: 30%;
    }
  }

  @include tool.media-query-respond-from(lg) {
    .fr-card__header {
      flex-basis: 25%;
    }
  }

  .fr-card__header {
    align-content: center;
  }

  @include tool.media-query-respond-from(md) {
    .fr-card__img {
      max-height: 250px;
    }
  }

  .fr-card__img {
    position: relative;

    img {
      max-height: 250px;
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
