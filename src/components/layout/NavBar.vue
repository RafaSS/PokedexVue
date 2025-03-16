<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { ref, onMounted, computed } from 'vue'
  import { authService } from '../../service/authService'

  const router = useRouter()
  const { locale, t } = useI18n()
  const currentLanguage = computed(() => locale.value)
  const isLoggedIn = ref(false)

  onMounted(() => {
    authService.isAuthenticated().then((isAuthenticated) => {
      isLoggedIn.value = isAuthenticated
    })
  })

  const toggleLanguage = () => {
    const newLocale = currentLanguage.value === 'en' ? 'pt' : 'en'
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  function navigateHome() {
    router.push('/')
  }

  function navigateFavorites() {
    router.push('/favorites')
  }

  function navigateLogin() {
    router.push('/login')
  }

  function navigateLogout() {
    authService.signOut().then(() => {
      isLoggedIn.value = false
      router.push('/')
    })
  }
</script>

<template>
  <nav
    class="bg-gradient-to-r from-red-600 to-red-700 p-5 text-white flex justify-between items-center shadow-lg sticky top-0 z-50"
  >
    <h1
      class="text-2xl font-bold cursor-pointer flex items-center transition-transform duration-300 transform hover:scale-110"
      @click="navigateHome"
    >
      <img
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
        alt="Pokeball"
        class="mr-2 h-8"
      />
      Pokédex
    </h1>
    <div class="flex space-x-4">
      <button
        class="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded-full shadow-md transition-all duration-300 flex items-center"
        @click="navigateHome"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        {{ t('nav.home') }}
      </button>
      <button
        class="bg-yellow-500 hover:bg-yellow-400 text-white px-5 py-2 rounded-full shadow-md transition-all duration-300 flex items-center"
        @click="navigateFavorites"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
        {{ t('nav.favorites') }}
      </button>
      <button
        v-if="!isLoggedIn"
        class="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-full shadow-md transition-all duration-300 flex items-center"
        @click="navigateLogin"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        {{ t('nav.login') }}
      </button>
      <button
        v-if="isLoggedIn"
        class="bg-red-500 hover:bg-red-400 text-white px-5 py-2 rounded-full shadow-md transition-all duration-300 flex items-center"
        @click="navigateLogout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        {{ t('nav.logout') }}
      </button>
      <div class="language-selector ml-2">
        <button
          @click="toggleLanguage"
          class="flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white p-2 shadow transition-all"
        >
          <span class="text-sm font-medium">
            {{ currentLanguage === 'en' ? '🇺🇸' : '🇧🇷' }}
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

  nav {
    font-family: 'Poppins', sans-serif;
  }

  button {
    font-weight: 600;
  }
</style>
