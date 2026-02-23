<template>
  <DsfrCard
    class="fr-card--program fr-card--external"
    :class="getOperator && getOperator?.color ? `fr-card-header-bg--${getOperator?.color}` : ''"
    :title="program.titre || 'Programme externe'"
    end-detail-icon="fr-icon-money-euro-circle-line fr-text--blue"
    :description="program.promesse || (program['description courte'] as string) || ''"
    :img-src="getImage()"
    :alt-img="program.titre ? `image / ${program.titre}` : 'image du programme'"
    :horizontal="true"
    :no-arrow="true"
    :link="getRouteToExternalProgramDetail()"
    :badges="program['nature de l\'aide'] ? [{ label: program['nature de l\'aide'], noIcon: true, small: true }] : []"
    :title-tag="titleTag"
    :title-link-attrs="{}"
  >
  </DsfrCard>
</template>

<script setup lang="ts">
import { Image } from '@/tools/image'
import { AbstractProgramTypeForFront, RouteName } from '@/types'
import { DsfrCard } from '@gouvminint/vue-dsfr'
import type { RouteLocationRaw } from 'vue-router'
import { useNavigationStore } from '@/stores/navigation'
import { Operator } from '@/tools/operator'

interface Props {
  program: AbstractProgramTypeForFront
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
const { program, titleTag = 'h2' } = defineProps<Props>()

const navigationStore = useNavigationStore()
const img = Image.getUrl

const getOperator = computed(() => {
  if (program['opérateur de contact']) {
    return new Operator().getOneByName(program['opérateur de contact'])
  }
  return undefined
})

const getImage = () => {
  const operator = getOperator.value
  return operator?.imagePath
    ? img(operator?.imagePath, { height: 320, quality: 100, loading: 'lazy' })
    : img(`/${program.illustration}`, { height: 320, quality: 70, loading: 'lazy' })
}

const getRouteToExternalProgramDetail = (): RouteLocationRaw => {
  return {
    name: RouteName.CatalogProgramDetail,
    params: { programId: program.id },
    query: navigationStore.query
  }
}
</script>
