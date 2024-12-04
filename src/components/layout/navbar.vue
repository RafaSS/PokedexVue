<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()

  function navigateHome() {
    router.push('/')
  }

  function navigateFavorites() {
    router.push('/favorites')
  }
</script>

<template>
  <nav class="bg-red-600 p-4 text-white flex justify-between items-center">
    <h1 class="text-lg font-bold cursor-pointer" @click="navigateHome">
      Pokedex
    </h1>
    <div class="flex space-x-4">
      <button
        class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-100"
        @click="navigateHome"
      >
        Home
      </button>
      <button
        class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-100"
        @click="navigateFavorites"
      >
        Favorites
      </button>
    </div>
  </nav>
</template>

<style scoped></style>
