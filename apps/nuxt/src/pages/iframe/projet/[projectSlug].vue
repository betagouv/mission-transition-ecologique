<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
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
              <p class="fr-card__desc">
                Le service public Transition écologique des entreprises vous permet de trouver les aides, accompagnements et ressources
                issues de l'ensemble des acteurs publics pour vous aider à réaliser votre projet de transition écologique (ADEME, CCI, CMA,
                Bpifrance, DGFiP, etc.)
              </p>
              <div class="fr-card__start"></div>
            </div>
          </div>
          <div class="fr-card__header">
            <div class="fr-card__img">
              <img
                class="fr-responsive-img"
                :src="currentProject?.image"
                :alt="`image / ${currentProject?.title}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fr-card__img img {
  max-height: 250px;
}
</style>
