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
const otherProjectForm = ref<boolean>(false)

const openOtherProjectForm = () => {
  otherProjectForm.value = true
}
</script>
