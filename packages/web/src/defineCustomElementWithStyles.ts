// CONSOLE LOG TEMPLATE
// console.log(`defineCustomElementWithStyles > FUNCTION_NAME > MSG_OR_VALUE :`)

import { defineCustomElement as VueDefineCustomElement, h, createApp, getCurrentInstance } from 'vue'

// @ts-ignore
import type { Plugin, Comp } from '@/types/index'

// cf : https://stackblitz.com/edit/vue3-custom-elements-with-plugins?file=src%2FdefineCustomElementWithStyles.js,src%2Fmain.js
// cf: https://stackblitz.com/edit/vue3-custom-elements-with-plugins?file=src%2Fmain.js,src%2FdefineCustomElementWithStyles.js,src%2FApp.ce.vue

const getNearestElementParent = (el: any) => {
  while (el?.nodeType !== 1 /* ELEMENT */) {
    el = el.parentElement
  }
  return el
}

export const defineCustomElement = (component: any, { plugins = <Plugin[]>[], comps = <Comp[]>[] }) =>
  VueDefineCustomElement({
    render: () => h(component),
    setup() {
      // @ts-ignore
      const app = createApp()

      // install plugins
      plugins.forEach((obj) => {
        app.use(obj.plugin, obj.options)
      })

      comps.forEach((obj) => {
        app.component(obj.name, obj.comp)
      })

      app.mixin({
        mounted() {
          const insertStyles = (styles: any) => {
            if (styles && styles.length) {
              this.__style = document.createElement('style')
              this.__style.innerText = styles.join().replace(/\n/g, '')
              const parent = getNearestElementParent(this.$el)
              parent?.prepend(this.__style)
            }
          }

          // load own styles
          insertStyles(this.$?.type.styles)

          // load styles of child components
          if (this.$options.components) {
            for (const comp of Object.values(this.$options.components)) {
              // @ts-ignore
              insertStyles(comp.styles)
            }
          }
        },
        unmounted() {
          this.__style?.remove()
        },
      })

      const inst = <any>getCurrentInstance()
      Object.assign(inst.appContext, app._context)
      Object.assign(inst.provides, app._context.provides)
    },
  })
