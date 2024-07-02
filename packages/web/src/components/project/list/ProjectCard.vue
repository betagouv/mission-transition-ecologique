<template>
  <DsfrCard
    :title="project.title"
    :description="project.shortDescription"
    :img-src="`${publicPath}${project.image}`"
    :alt-img="`image / ${project.title}`"
    :no-arrow="true"
  >
    <template
      v-if="isPriorityProject"
      #start-details
    >
      <div
        v-if="!isUniquePriority"
        class="fr-card__header--priority fr-hidden fr-unhidden-lg"
      >
        {{ priorityOrder }}
      </div>
      <div class="fr-mb-1v">
        <DsfrBadge
          :label="priorityTag"
          :no-icon="true"
          class="fr-badge--success"
        />
      </div>
    </template>
  </DsfrCard>
</template>

<script setup lang="ts">
import { Project } from '@tee/common/src/project/types'
import Config from '@/config'
import { DsfrCard } from '@gouvminint/vue-dsfr'

const publicPath = Config.publicPath

interface Props {
  project: Project
  isPriorityProject?: boolean
  isUniquePriority?: boolean
  priorityOrder?: number
}

withDefaults(defineProps<Props>(), {
  isPriorityProject: false
})

const priorityTag: string = 'A FAIRE EN PRIORITÉ'
</script>
