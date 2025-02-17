<template>
  <div
    v-if="navigationStore.hasSpinner"
    class="fr-col-12 fr-text-center fr-pt-3v"
  >
    <TeeSpinner />
  </div>
  <div v-else-if="hasError">
    <TeeListNoResults :has-error="hasError" />
  </div>
  <div
    v-for="opt in options"
    v-else
    :key="opt.value"
    class="fr-col-4 fr-col-sm-6 fr-col-md-4 fr-col-xs-12 fr-p-1v fr-pt-3v"
    @click="selectOption(opt.value)"
    @keydown.enter="selectOption(opt.value)"
  >
    <TrackThemeCard :option="opt" />
  </div>
</template>
<script setup lang="ts">
import { TrackThemeOptionProps } from '@/components/questionnaire/track/form/theme/TrackThemeCard.vue'
import { useTrackStore } from '@/stores/track'
import { useUsedTrackStore } from '@/stores/usedTrack'
import { ProjectManager } from '@/tools/project/projectManager'
import ProjectFilter from '@/tools/project/projectFilter'
import type { TrackOptionItem } from '@/types'
import { computed } from 'vue'
import { Theme } from '@/tools/theme'
import { ProjectType } from '@tee/data'
import { useProjectStore } from '@/stores/project'
import { useNavigationStore } from '@/stores/navigation'

await new ProjectManager().getProjects()

const currentTrack = useTrackStore().current
const emit = defineEmits(['updateSelection'])
const { projects, hasError } = storeToRefs(useProjectStore())
const navigationStore = useNavigationStore()

const options = computed<TrackThemeOptionProps[]>(() => {
  const options: TrackThemeOptionProps[] = []
  if (!currentTrack?.options) {
    return options
  }
  for (const option of currentTrack.options) {
    const theme = Theme.getById(option.questionnaireData?.priority_objective)
    if (theme && projects.value) {
      const themeProjects = ProjectFilter.getProjectsByTheme(projects.value, theme.id)
      const projectsInfos: { projects: ProjectType[]; moreThanThree: boolean } = Theme.getPriorityProjects(themeProjects)
      options.push({
        value: option.questionnaireData?.priority_objective,
        title: theme.title,
        color: theme.color,
        imgSrc: theme.image,
        altImg: theme.tagLabel,
        highlightProjects: projectsInfos.projects,
        moreThanThree: projectsInfos.moreThanThree
      })
    }
  }
  return options
})

const selectOption = (opt: string | undefined) => {
  const selectedOptionIndex = currentTrack?.options?.findIndex((option) => option.value === opt)
  const selectedOption =
    selectedOptionIndex !== undefined && selectedOptionIndex !== -1 ? currentTrack?.options?.[selectedOptionIndex] : undefined
  if (selectedOption) {
    useUsedTrackStore().setCurrentSelectedOptions([selectedOption])
  }
  const data = {
    option: selectedOption,
    index: selectedOptionIndex,
    remove: selectedOption === undefined
  } as TrackOptionItem

  emit('updateSelection', data)
}
</script>
