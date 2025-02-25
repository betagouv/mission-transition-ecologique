export default defineNuxtPlugin((nuxtApp) => {
  const app = nuxtApp.vueApp
  // check if default component is loaded
  if (!app.component('default')) {
    console.error('Default component is missing')
  }
})
