<template>
  <DsfrButton
    ref="modalOrigin"
    label="Filtrer"
    tertiary
    no-outline
    style="float: right"
    size="sm"
    @click="open()"
  />
  <DsfrModal
    ref="modal"
    :opened="opened"
    title="Filtrer"
    :origin="$refs.modalOrigin"
    size="sm"
    @close="close()"
  >
    <DsfrAccordionsGroup>
      <li
        v-for="filter in filters"
        :key="filter.id"
      >
        <DsfrAccordion
          :title="filter.title"
          :expanded-id="expandedId"
          @expand="expandedId = $event"
        >
          <component :is="filter.component" />
        </DsfrAccordion>
      </li>
    </DsfrAccordionsGroup>
  </DsfrModal>
</template>
<script setup lang="ts">
import { DsfrModal } from '@gouvminint/vue-dsfr'
import { ref } from 'vue'
import ProgramFilterByType from './ProgramFilterByType.vue'

const close = () => {
  opened.value = false
}

const opened = ref<boolean>(false)

const open = () => {
  opened.value = true
}

const expandedId = ref<string>('')

interface FilterItem {
  title: string
  id: string
  component: Component
}

const filters: FilterItem[] = [
  {
    title: "Types d'aides",
    id: 'type-aid',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component: ProgramFilterByType
  }
]
</script>
