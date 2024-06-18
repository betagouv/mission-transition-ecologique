<template>
  <DsfrCard
    :class="'fr-radius-a--1v fr-card--shadow'"
    :title="project.title"
    :description="project.shortDescription"
    :img-src="`${publicPath}${project.image}`"
    :alt-img="`image / ${project.title}`"
    :no-arrow="true"
  ></DsfrCard>
</template>

<script setup lang="ts">
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { Project } from '@tee/common/src/project/types'
import Config from '@/config'

const publicPath = Config.publicPath

interface Props {
  project: Project
}

defineProps<Props>()
</script>
