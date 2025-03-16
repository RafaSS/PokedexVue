<template>
  <transition name="fade">
    <div
      v-if="showConsent"
      class="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg z-50 border-t border-gray-200"
    >
      <div
        class="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between"
      >
        <div class="mb-4 sm:mb-0 pr-4">
          <p class="text-sm text-gray-700">
            <span class="font-bold">🍪 {{ t('common.cookieConsent') }}</span>
          </p>
        </div>
        <div class="flex space-x-2">
          <button
            @click="acceptCookies"
            class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {{ t('common.accept') }}
          </button>
          <button
            @click="declineCookies"
            class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {{ t('common.decline') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { cookieService } from '../service/cookieService'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const showConsent = ref(false)

  const acceptCookies = () => {
    cookieService.setCookieConsent(true)
    showConsent.value = false
    // This is a good place to generate a temporary user ID
    cookieService.getTempUserId()
  }

  const declineCookies = () => {
    cookieService.setCookieConsent(false)
    showConsent.value = false
  }

  onMounted(() => {
    // Check if user has already given consent
    if (!cookieService.hasCookieConsent()) {
      // Show consent popup after a slight delay
      setTimeout(() => {
        showConsent.value = true
      }, 1000)
    } else {
      // If they've already consented, make sure we have a temp user ID
      cookieService.getTempUserId()
    }
  })
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
