<template>
  <DsfrCard
    :img-src="`${publicPath}${program.illustration}`"
    :alt-img="`image / ${program.titre}`"
    :no-arrow="true"
    :horizontal="true"
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
import { ProgramAidType, type ProgramData } from '@/types'
import { consolidateAmounts } from '@/utils/helpers'
import Translation from '@/utils/translation'
import { DsfrCard } from '@gouvminint/vue-dsfr'

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
</script>
