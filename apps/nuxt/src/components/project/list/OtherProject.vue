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
interface OtherProjectProps {
  form?: boolean
}

const props = defineProps<OtherProjectProps>()

const otherProjectForm = ref<boolean>(props.form)

const openOtherProjectForm = () => {
  otherProjectForm.value = true
}
</script>
