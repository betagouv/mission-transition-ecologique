<template>
  <DsfrCard
    :img-src="`${publicPath}${program.illustration}`"
    :alt-img="`image / ${program.titre}`"
    :horizontal="true"
    :no-arrow="true"
    :link="getRouteToProgramDetail(program.id)"
  >
    <template #start-details>
      <!-- HEADER BADGE -->
      <div class="fr-mb-1v">
        <DsfrBadge
          :label="program['nature de l\'aide']"
          :no-icon="true"
          class="tee-program-badge-image"
        />
      </div>
      <!-- TITLE -->
      <p class="fr-text--purple fr-h6 fr-text--bold">
        {{ program.titre }}
      </p>
      <!-- CONTENT -->
      <div class="fr-card__title">
        <h2 class="fr-text--blue-france fr-h3">
          {{ program.promesse }}
        </h2>
      </div>
      <!-- END -->
      <p class="fr-mb-0 tee-program-info">
        <span
          class="fr-icon-money-euro-circle-line"
          aria-hidden="true"
        />
        {{ getCostInfos() }}
      </p>
    </template>
  </DsfrCard>
</template>

<script setup lang="ts">
import Config from '@/config'
import { ProgramAidType, type ProgramData, RouteName } from '@/types'
import { consolidateAmounts } from '@/utils/helpers'
import Translation from '@/utils/translation'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'

const { program } = defineProps<{ program: ProgramData }>()

const publicPath = Config.publicPath

const getCostInfos = () => {
  let prefix: string = ''
  let text: string | undefined = ''

  switch (program["nature de l'aide"]) {
    case ProgramAidType.study:
      if (program["coût de l'accompagnement"]) {
        text = program["coût de l'accompagnement"]
        prefix = 'programCosts.costPrefix'
      } else {
        prefix = 'programCosts.aidPrefix'
        text = program['montant du financement']
      }
      break
    case ProgramAidType.train:
      prefix = 'programCosts.costPrefix'
      text = program["coût de l'accompagnement"]
      break
    case ProgramAidType.fund:
      prefix = 'programCosts.aidPrefix'
      text = program['montant du financement']
      break
    case ProgramAidType.loan:
      prefix = 'programCosts.loan'
      text = program['montant du prêt']
      break
    case ProgramAidType.tax:
      prefix = 'programCosts.taxAdvantage'
      text = program["montant de l'avantage fiscal"]
      break
  }
  // Translate prefix
  prefix = Translation.t(prefix)

  text = consolidateAmounts(text)

  return `${prefix} : ${text}`
}

const navigationStore = useNavigationStore()

const isCatalog = navigationStore.isCatalogPrograms()

const getRouteToProgramDetail = (programId: string): RouteLocationRaw => {
  return {
    name: isCatalog ? RouteName.CatalogProgramDetail : RouteName.QuestionnaireResultDetail,
    params: { programId },
    query: isCatalog ? undefined : navigationStore.query
  }
}
</script>
<style lang="scss" scoped>
.tee-program-badge-image {
  /* modifications en attendant la montée de version du vue-dsfr vers la v 6.0.0.*/
  position: absolute;
  top: 1rem;
  left: 1rem;
}
:deep(.fr-card__title a::after) {
  display: none !important;
}
</style>
