import { defineCustomElement as VueDefineCustomElement, h, createApp, getCurrentInstance, type Component } from 'vue'
import type { Plugin, Comp } from '@/types/index'

// cf : https://stackblitz.com/edit/vue3-custom-elements-with-plugins?file=src%2FdefineCustomElementWithStyles.js,src%2Fmain.js
// cf: https://stackblitz.com/edit/vue3-custom-elements-with-plugins?file=src%2Fmain.js,src%2FdefineCustomElementWithStyles.js,src%2FApp.ce.vue

const getNearestElementParent = (el: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  while (el?.nodeType !== 1 /* ELEMENT */) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    el = el.parentElement
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return el
}

export const defineCustomElement = (component: Component, { plugins = <Plugin[]>[], comps = <Comp[]>[] }) =>
  VueDefineCustomElement({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    render: () => h(component),
    setup() {
      const app = createApp(component)

      // install plugins
      plugins.forEach((obj) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        app.use(obj.plugin, obj.options)
      })

      comps.forEach((obj) => {
        app.component(obj.name, obj.comp)
      })

      app.mixin({
        mounted() {
          const insertStyles = (styles: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (styles?.length) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              this.__style = document.createElement('style')
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
              this.__style.innerText = styles.join().replace(/\n/g, '')
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
              const parent = getNearestElementParent(this.$el)
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
              parent?.prepend(this.__style)
            }
          }

          // load own styles
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          insertStyles(this.$?.type.styles)

          // load styles of child components
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (this.$options.components) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            for (const comp of Object.values(this.$options.components)) {
              // console.log('mounted > comp', comp)
              insertStyles((comp as Record<string, unknown>).styles)
            }
          }
        },
        unmounted() {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
          this.__style?.remove()
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const inst = <any>getCurrentInstance()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      Object.assign(inst.appContext, app._context)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      Object.assign(inst.provides, app._context.provides)
    }
  })

// export default defineCustomElement
