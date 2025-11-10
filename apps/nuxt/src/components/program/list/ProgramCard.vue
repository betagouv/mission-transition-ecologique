<template>
  <DsfrCard
    class="fr-card--program"
    :title="program.titre"
    :end-detail="getCostInfos()"
    end-detail-icon="fr-icon-money-euro-circle-line fr-text--blue"
    :description="program.promesse"
    :img-src="img(`/${program.illustration}`, { height: 320, quality: 70, loading: 'lazy' })"
    :alt-img="`image / ${program.titre}`"
    :horizontal="true"
    :no-arrow="true"
    :link="getRouteToProgramDetail()"
    :badges="[{ label: program['nature de l\'aide'], noIcon: true, small: true }]"
    :title-tag="titleTag"
  >
  </DsfrCard>
</template>

<script setup lang="ts">
import { Image } from '@/tools/image'
import Navigation from '@/tools/navigation'
import { ProgramAidType, ProgramTypeForFront, ProjectType, RouteName } from '@/types'
import { consolidateAmounts } from '@/tools/helpers'
import Translation from '@/tools/translation'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'

interface Props {
  program: ProgramTypeForFront
  project?: ProjectType
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
const { program, project = undefined, titleTag = 'h2' } = defineProps<Props>()

const navigationStore = useNavigationStore()
const navigation = new Navigation()
const isCatalog = navigation.isCatalogPrograms()
const img = Image.getUrl

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

const getRouteName = () => {
  if (isCatalog) {
    return RouteName.CatalogProgramDetail
  } else if (navigation.isByRouteName(RouteName.ProjectResultDetail)) {
    return RouteName.ProgramFromProjectResultDetail
  } else if (navigation.isCatalogProjectDetail()) {
    return RouteName.CatalogProgramFromCatalogProjectDetail
  }
  return RouteName.ProgramResultDetail
}

const getRouteToProgramDetail = (): RouteLocationRaw => {
  const params = navigation.isProjectDetail() && project ? { programId: program.id, projectSlug: project.slug } : { programId: program.id }
  return {
    name: getRouteName(),
    params: params,
    query: navigationStore.query
  }
}
</script>
