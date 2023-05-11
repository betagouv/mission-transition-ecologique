import { defineCustomElement as VueDefineCustomElement, h, createApp, getCurrentInstance } from 'vue'

// @ts-ignore
import type { Plugin, Comp } from '@/types/index'

// cf : https://stackblitz.com/edit/vue3-custom-elements-with-plugins?file=src%2FdefineCustomElementWithStyles.js,src%2Fmain.js
// cf: https://stackblitz.com/edit/vue3-custom-elements-with-plugins?file=src%2Fmain.js,src%2FdefineCustomElementWithStyles.js,src%2FApp.ce.vue

const getNearestElementParent = (el: any) => {
  // console.log('getNearestElementParent > el (1):', el)
  while (el?.nodeType !== 1 /* ELEMENT */) {
    // console.log('getNearestElementParent > el (2a):', el)
    // console.log('getNearestElementParent > el.nodeType (2b):', el.nodeType)
    // console.log('getNearestElementParent > el.parentElement (2c):', el.parentElement)
    el = el.parentElement
  }
  // console.log('getNearestElementParent > el (3):', el)
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
              // console.log('mounted > this.$el :', this.$el)
              // console.log('mounted > this.__style.innerText :', this.__style.innerText)
              const parent = getNearestElementParent(this.$el)
              // console.log('mounted > parent :', parent)
              parent?.prepend(this.__style)
            }
          }

          // load own styles
          // console.log('mounted > this.$', this.$)
          insertStyles(this.$?.type.styles)

          // load styles of child components
          if (this.$options.components) {
            // console.log('mounted > this.$options.components', this.$options.components)
            for (const comp of Object.values(this.$options.components)) {
              // console.log('mounted > comp', comp)
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

// export default defineCustomElement