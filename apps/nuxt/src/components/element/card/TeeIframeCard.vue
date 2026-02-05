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
                  {{ title }}
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
import { computed } from 'vue'
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
  title: 'Accédez aux aides publiques pour votre projet de transition écologique',
  imageSrc: undefined,
  imageAlt: undefined,
  objectFit: 'cover',
  imgBgColor: undefined
})

const router = useRouter()

const defaultLink = router.resolve({ name: RouteName.Homepage }).href
const resolvedLink = computed(() => props.link || defaultLink)

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
}
</style>
