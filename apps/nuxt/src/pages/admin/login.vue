<template>
  <div class="fr-container fr-py-6w">
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-6">
        <h1 class="fr-h2 fr-mb-4w">Connexion administration</h1>

        <div
          v-if="errorMessage"
          class="fr-alert fr-alert--error fr-mb-3w"
        >
          <p class="fr-alert__title">{{ errorMessage }}</p>
        </div>

        <form @submit.prevent="handleLogin">
          <div class="fr-input-group fr-mb-3w">
            <label
              class="fr-label"
              for="username"
            >Identifiant</label>
            <input
              id="username"
              v-model="username"
              class="fr-input"
              type="text"
              autocomplete="username"
              required
            />
          </div>

          <div class="fr-input-group fr-mb-4w">
            <label
              class="fr-label"
              for="password"
            >Mot de passe</label>
            <input
              id="password"
              v-model="password"
              class="fr-input"
              type="password"
              autocomplete="current-password"
              required
            />
          </div>

          <button
            class="fr-btn"
            type="submit"
            :disabled="loading"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false, middleware: [] })

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { username: username.value, password: password.value } })
    await navigateTo('/admin/priorities')
  } catch {
    errorMessage.value = 'Identifiant ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>
