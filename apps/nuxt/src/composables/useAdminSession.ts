const INACTIVITY_TIMEOUT = 30 * 60 * 1000
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll']

export const useAdminSession = () => {
  const currentUser = ref('')
  let inactivityTimer: ReturnType<typeof setTimeout>

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/admin/login')
  }

  const resetTimer = () => {
    clearTimeout(inactivityTimer)
    inactivityTimer = setTimeout(logout, INACTIVITY_TIMEOUT)
  }

  onMounted(async () => {
    const me = await $fetch<{ username: string }>('/api/auth/me')
    currentUser.value = me.username
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, resetTimer))
    resetTimer()
  })

  onUnmounted(() => {
    ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, resetTimer))
    clearTimeout(inactivityTimer)
  })

  return { currentUser, logout }
}
