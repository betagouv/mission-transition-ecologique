<template>
  <DsfrCard
    :title="project.title"
    :horizontal="horizontal"
    :description="project.shortDescription"
    :img-src="project.image"
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
import { DsfrCard } from '@gouvminint/vue-dsfr'
import { Project } from '@/types'

interface Props {
  project: Project
  isPriorityProject?: boolean
  horizontal?: boolean
  isUniquePriority?: boolean
  priorityOrder?: number
}

withDefaults(defineProps<Props>(), {
  isPriorityProject: false,
  priorityOrder: undefined,
  horizontal: false
})

const priorityTag: string = 'A FAIRE EN PRIORITÉ'
</script>
