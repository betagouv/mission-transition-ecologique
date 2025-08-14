// import type { Directive } from 'vue'

// export default defineNuxtPlugin((nuxtApp) => {
//   const vSticky: Directive = {
//     mounted(el: HTMLElement) {
//       const observer = new IntersectionObserver(
//         ([entry]) => {
//           console.log('in the observer')
//           if (entry.intersectionRatio < 1) {
//             console.log('should add class to ', el)
//             el.classList.add('is-stuck')
//           } else {
//             el.classList.remove('is-stuck')
//             console.log('should remove class to ', el)
//           }
//         },
//         { threshold: [1] }
//       )

//       observer.observe(el)
//       ;(el as any)._stickyObserver = observer
//     },
//     unmounted(el: HTMLElement) {
//       ;(el as any)._stickyObserver?.disconnect()
//     }
//   }

//   nuxtApp.vueApp.directive('sticky', vSticky)
// })

import type { Directive } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const vSticky: Directive = {
    mounted(el: HTMLElement, binding) {
      const isFixed = binding.value?.fixed ?? false

      let stuckAt: number | null = null
      let placeholder: HTMLElement | null = null
      let lastScrollY = window.scrollY
      let ticking = false

      const update = () => {
        const rect = el.getBoundingClientRect()
        const currentScrollY = window.scrollY
        const scrollingDown = currentScrollY > lastScrollY
        const scrollingUp = currentScrollY < lastScrollY

        if (scrollingDown && stuckAt === null && rect.top <= 0) {
          if (isFixed && !placeholder) {
            placeholder = document.createElement('div')
            placeholder.style.width = rect.width + 'px'
            placeholder.style.height = rect.height + 'px'
            el.parentNode?.insertBefore(placeholder, el)
          }
          stuckAt = currentScrollY
          el.classList.add('is-stuck')
        } else if (scrollingUp && stuckAt !== null && currentScrollY < stuckAt) {
          if (isFixed && placeholder) {
            placeholder.parentNode?.removeChild(placeholder)
            placeholder = null
          }
          stuckAt = null
          el.classList.remove('is-stuck')
        }

        lastScrollY = currentScrollY
        ticking = false
      }

      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(update)
          ticking = true
        }
      }

      window.addEventListener('scroll', onScroll)
      ;(el as any)._onScroll = onScroll
    },

    unmounted(el: HTMLElement) {
      if ((el as any)._onScroll) {
        window.removeEventListener('scroll', (el as any)._onScroll)
      }
    }
  }

  nuxtApp.vueApp.directive('sticky', vSticky)
})
