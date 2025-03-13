<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import Analytics from '@/tools/analytic/analytics'
// import Analytics from '@/tools/analytic/analytics'
import { RouteName } from '@/types'

definePageMeta({
  layout: 'iframe',
  middleware: [MiddlewareName.hasProject]
})

const imageResizerChild = () => import('@iframe-resizer/child')
imageResizerChild()

const { currentProject } = storeToRefs(useProjectStore())
const title = currentProject.value?.title?.toLowerCase() || ''
const router = useRouter()
const href = router.resolve({ name: RouteName.CatalogProjectDetail, params: { projectSlug: currentProject.value?.slug } }).href

if (import.meta.client) {
  const params = new URLSearchParams(window.location.search)
  const parentUrl = params.get('parent_url')
  Analytics.sendEvent('iframe_view', {
    type: 'project',
    title: title,
    referrer_url: parentUrl
  })
}
</script>

<template>
  <div class="fr-container fr-px-0">
    <div class="fr-grid-row">
      <div class="fr-col-12">
        <div class="fr-card fr-enlarge-link fr-card--horizontal fr-card--icon-link fr-card--grey fr-p-4v fr-card--no-border">
          <div class="fr-card__body">
            <div class="fr-card__content">
              <h3 class="fr-card__title">
                <a
                  :href="href"
                  target="_blank"
                  rel="noopener external"
                >
                  Accédez aux aides publiques pour votre projet de {{ title }}
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
                  :src="currentProject?.image"
                  :alt="`image / ${currentProject?.title}`"
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
