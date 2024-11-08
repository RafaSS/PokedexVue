<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const inputValue = ref('')

const goToPokemonDetail = () => {
  router.push('/pokemondetail')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <input 
      v-model="inputValue"
      type="text"
      class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="Enter text here..."
    >
    <button
      @click="goToPokemonDetail"
      class="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      View Pokemon Details
    </button>
  </div>
</template>
