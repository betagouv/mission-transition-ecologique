<template>
  <div class="fr-container--fluid">
    <iframe
      ref="iframe"
      v-resize="{ log: false }"
      :src="Contact.iframeSrc"
      class="contact-iframe"
      title="Place des entreprise - france-transition-ecologique"
      sandbox="allow-forms allow-scripts allow-same-origin"
      width="100%"
    />
  </div>
</template>

<script setup lang="ts">
import Contact from '@/tools/contact'
import type { Directive, DirectiveBinding } from 'vue'
import { IFrameOptions, iframeResizer } from 'iframe-resizer'
// To make it global see https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/use_with/vue.md#vue3-with-typescript

interface ResizableHTMLElement extends HTMLElement {
  iFrameResizer?: {
    removeListeners: () => void
  }
}

const vResize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options: IFrameOptions = (binding.value as IFrameOptions) || ({} as IFrameOptions)

    el.addEventListener('load', () => iframeResizer(options, el))
  },
  unmounted(el: HTMLElement) {
    const resizableEl = el as ResizableHTMLElement

    if (resizableEl.iFrameResizer) {
      resizableEl.iFrameResizer.removeListeners()
    }
  }
}
</script>
