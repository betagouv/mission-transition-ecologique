<template>
  <DsfrButton
    :label="linkCopied ? 'Lien copié' : 'Copier le lien'"
    :size="size"
    :tertiary="tertiary"
    :no-outline="noOutline"
    class="fr-radius-a--2v"
    :class="`${linkCopied ? copyClass : ''} ${textClass}`"
    icon="fr-icon-link"
    @click="copyUrl"
  />
</template>
<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  noOutline?: boolean
  tertiary?: boolean
  copyClass?: string
  textClass?: string
}
withDefaults(defineProps<Props>(), {
  size: 'sm',
  noOutline: false,
  tertiary: false,
  copyClass: 'fr-bg--green',
  textClass: ''
})
const linkCopied = ref<boolean>(false)

const copyUrl = async () => {
  const pageUrl = window.location.href
  await navigator.clipboard.writeText(pageUrl)
  linkCopied.value = true
  setTimeout(() => {
    linkCopied.value = false
  }, 2000)
}
</script>
