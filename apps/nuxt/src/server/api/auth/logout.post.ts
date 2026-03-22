export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_token', { path: '/' })
  return { success: true }
})
