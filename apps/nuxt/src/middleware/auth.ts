export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin/') || to.path === '/admin/login') return

  try {
    await $fetch('/api/auth/me')
  } catch {
    return navigateTo('/admin/login')
  }
})
