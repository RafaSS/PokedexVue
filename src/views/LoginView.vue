<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { authService } from '../service/authService'
  import { cookieService } from '../service/cookieService'

  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')

  const handleLogin = async () => {
    try {
      loading.value = true
      error.value = ''

      const { data: authData, error: loginError } = await authService.signIn(
        email.value,
        password.value
      )

      if (loginError) {
        error.value = loginError.message || 'Failed to log in'
        return
      }

      // If successfully logged in and we have a temporary user ID, we should migrate favorites
      const tempUserId = cookieService.getTempUserId()
      if (authData?.user?.id && tempUserId) {
        console.log('goy 😊')
        await authService.migrateTempFavorites(tempUserId, authData.user.id)
        cookieService.clearTempUserId()
      }

      router.push('/')
    } catch (err) {
      error.value = 'An unexpected error occurred'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const handleOAuthLogin = async (
    provider: 'google' | 'github' | 'facebook'
  ) => {
    try {
      loading.value = true
      error.value = ''

      const { error: oauthError } = await authService.signInWithOAuth(provider)

      if (oauthError) {
        error.value = oauthError.message || `Failed to log in with ${provider}`
        return
      }

      // OAuth redirects to provider, so no need to navigate
    } catch (err) {
      error.value = 'An unexpected error occurred'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center text-red-600 mb-8">
        Pokédex Login
      </h2>

      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {{ loading ? 'Logging in...' : 'Log in' }}
          </button>
        </div>
      </form>

      <div class="mt-6">
        <p class="text-center text-sm text-gray-600">
          Don't have an account?
          <router-link
            to="/signup"
            class="font-medium text-red-600 hover:text-red-500"
          >
            Sign up
          </router-link>
        </p>
      </div>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            @click="handleOAuthLogin('google')"
            type="button"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Google
          </button>
          <button
            @click="handleOAuthLogin('github')"
            type="button"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            GitHub
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
