<template>
  <Transition
    name="fade"
    mode="out-in"
  >
    <OtherProjectCta
      v-if="!otherProjectForm"
      @click="openOtherProjectForm"
    />
    <OtherProjectForm v-else />
  </Transition>
</template>
<script setup lang="ts">
import { Theme } from '@/tools/theme'

const theme = Theme.getThemeFromSelectedTheme()

const otherProjectForm = ref<boolean>(false)

const openOtherProjectForm = () => {
  otherProjectForm.value = true
}

watch(
  () => theme.value,
  () => {
    otherProjectForm.value = false
  }
)
</script>
