<template>
  <ClientOnly fallback-tag="div">
    <template #fallback>
      <div class="fr-container">
        <div class="fr-col-12 fr-col--middle fr-col-justify--center">
          <TeeSpinner />
        </div>
      </div>
    </template>
    <TeeDsfrTabs
      ref="tabs"
      v-model="tabSelectedOnList"
      class="fr-col-12"
      tab-list-name="Liste d’onglet"
      :tab-titles="titles"
    >
      <template #tab-content-header>
        <ResultThemeFiltersAndCard
          id="tab-content-header"
          :has-error="hasErrorProjects && hasErrorPrograms"
        />
      </template>
      <DsfrTabContent
        class="fr-p-0"
        :panel-id="titles[0].panelId"
        :tab-id="titles[0].tabId"
      >
        <template #fallback>
          <TeeSpinner />
        </template>
        <ResultProjectList
          :filtered-projects="sortedProjects"
          :has-error="hasErrorProjects"
        />
      </DsfrTabContent>

      <DsfrTabContent
        class="fr-p-0"
        :panel-id="titles[1].panelId"
        :tab-id="titles[1].tabId"
      >
        <ResultProgramList
          :filtered-programs="filteredPrograms"
          :has-error="hasErrorPrograms"
        />
      </DsfrTabContent>
    </TeeDsfrTabs>
  </ClientOnly>
</template>

<script setup lang="ts">
import { TeeDsfrTabsProps } from '@/components/element/vueDsfr/dsfrTabs/TeeDsfrTabs.vue'
import { useNavigationStore } from '@/stores/navigation'
import { useProgramStore } from '@/stores/program'
import { ProgramManager } from '@/tools/program/programManager'
import ProjectFilter from '@/tools/project/projectFilter'
import { ProjectManager } from '@/tools/project/projectManager'
import { BreakpointNameType } from '@/types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useProjectStore } from '@/stores/project'
import { Theme } from '@/tools/theme'

const navigationStore = useNavigationStore()
const programStore = useProgramStore()
const { projects, hasError: hasErrorProjects } = storeToRefs(useProjectStore())
const { programs, hasError: hasErrorPrograms } = storeToRefs(programStore)
const { tabSelectedOnList } = storeToRefs(navigationStore)

onNuxtReady(async () => {
  await new ProjectManager().getProjects()
  await new ProgramManager().getFiltered()
})

const titles: TeeDsfrTabsProps['tabTitles'] = [
  {
    title: [{ title: "Des idées d'actions à mettre en place", size: BreakpointNameType.sm }, { title: "Idées d'actions" }],
    tabId: 'tab-0',
    panelId: 'tab-content-0'
  },
  {
    title: [{ title: 'Vos aides financières', size: BreakpointNameType.sm }, { title: 'Aides financières' }],
    tabId: 'tab-1',
    panelId: 'tab-content-1'
  }
]

const filteredPrograms = computed(() => {
  return programs.value ? programStore.getProgramsByFilters(programs.value) : undefined
})
const filteredProjects = computed(() => {
  return ProjectFilter.getProjectsByTheme(projects.value, Theme.getThemeFromSelectedOrPriorityTheme().value)
})

const sortedProjects = computed(() => {
  if (!filteredProjects.value) {
    return []
  }

  return filteredProjects.value
})
</script>
