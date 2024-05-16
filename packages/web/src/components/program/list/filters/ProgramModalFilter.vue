<template>
  <DsfrButton
    label="Filtrer"
    tertiary
    no-outline
    size="sm"
    @click="open()"
  />
  <DsfrModal
    ref="modal"
    :opened="opened"
    title=""
    size="sm"
    @close="close()"
  >
    <template #default>
      <div class="fr-h5 tee-text-blue fr-text-center">Filtrer</div>
      <DsfrAccordionsGroup>
        <li
          v-for="filter in filters"
          :key="filter.id"
        >
          <DsfrAccordion
            class="fr-accordion-colored-background"
            :title="filter.title"
            :expanded-id="expandedId"
            @expand="expandFilter"
          >
            <component
              :is="filter.component"
              class="fr-ml-5w"
              legend=""
            />
          </DsfrAccordion>
        </li>
      </DsfrAccordionsGroup>
    </template>
  </DsfrModal>
</template>
<script setup lang="ts">
import { DsfrModal } from '@gouvminint/vue-dsfr'
import { ref } from 'vue'
import ProgramFilterByAidType from './ProgramFilterByAidType.vue'

const close = () => {
  opened.value = false
}

const opened = ref<boolean>(false)

const open = () => {
  opened.value = true
}

const expandedId = ref<string | undefined>()

const expandFilter = (id: string | undefined) => {
  expandedId.value = id
}

interface FilterItem {
  title: string
  id: string
  component: unknown
}

const filters: FilterItem[] = [
  {
    title: "Types d'aides",
    id: 'type-aid',
    component: ProgramFilterByAidType
  }
]
</script>
