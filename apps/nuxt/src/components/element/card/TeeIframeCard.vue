<template>
  <div class="fr-container fr-px-0">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <div class="fr-card fr-card--cta fr-enlarge-link fr-card--horizontal fr-card--icon-link fr-card--grey fr-p-4v fr-card--no-border">
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
          <TeeHeaderLogoCard
            :image-src="imageSrc"
            :image-alt="imageAlt"
            :img-bg-color="imgBgColor"
            :object-fit="objectFit"
          />
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
  imageSrc?: string
  imageAlt?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  imgBgColor?: Color
}

const props = withDefaults(defineProps<Props>(), {
  link: undefined,
  title: undefined,
  imageSrc: undefined,
  imageAlt: undefined,
  objectFit: 'cover',
  imgBgColor: undefined
})

const router = useRouter()

const defaultLink = router.resolve({ name: RouteName.Homepage }).href
const defaultTitle = 'Accédez aux aides publiques pour votre projet de transition écologique'
const defaultImageSrc = 'images/TEE_computer_home.webp'
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
}
</style>
