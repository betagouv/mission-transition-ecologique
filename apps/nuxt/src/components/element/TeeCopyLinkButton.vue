<template>
  <DsfrButton
    :label="linkCopied ? 'Lien copié' : 'Copier le lien'"
    :size="size"
    :tertiary="tertiary"
    :no-outline="noOutline"
    class="fr-radius-a--2v fr-px-4v"
    :class="`${linkCopied ? copyClass : ''} ${textClass}`"
    icon="fr-icon-links-line"
    @click="copyUrl"
  />
</template>
<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  noOutline: boolean
  tertiary?: boolean
  copyClass?: string
  textClass?: string
}
withDefaults(defineProps<Props>(), {
  size: 'sm',
  noOutline: false,
  tertiary: true,
  copyClass: 'fr-bg--green',
  textClass: ''
})
const linkCopied = ref<boolean>(false)

const copyUrl = async () => {
  if (import.meta.client) {
    const pageUrl = window.location.href
    await navigator.clipboard.writeText(pageUrl)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 2000)
  }
}
</script>
