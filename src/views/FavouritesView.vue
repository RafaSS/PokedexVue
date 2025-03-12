<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { usePokemonStore } from '../store/pokemon'

  const router = useRouter()
  const pokemonList = ref<{ name: string; sprite: string }[]>([])
  const store = usePokemonStore()
  const currentPage = ref(1)
  const itemsPerPage = ref(12)
  const totalPokemons = ref(0)
  const isLoading = ref(false)

  const loadData = async () => {
    isLoading.value = true
    store.loadFavoritePokemon(currentPage.value, itemsPerPage.value)
    pokemonList.value = store.favoritePokemon.map((pokemon) => ({
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
    }))
    totalPokemons.value = store.totalFavoritePokemon
    isLoading.value = false
  }

  const goToNextPage = () => {
    if (
      currentPage.value < Math.ceil(totalPokemons.value / itemsPerPage.value)
    ) {
      currentPage.value += 1
      loadData()
    }
  }

  const goToPreviousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value -= 1
      loadData()
    }
  }

  onMounted(loadData)

  const goToPokemonDetail = (name: string) => {
    router.push(`/pokemondetail/${name}`)
  }
</script>

<template>
  <div class="max-w-6xl mx-auto p-6">
    <div
      class="bg-gradient-to-br from-blue-700 to-blue-900 p-8 rounded-2xl shadow-xl"
    >
      <h1 class="text-3xl font-bold mb-8 text-white text-center">Favourites</h1>

      <div v-if="isLoading" class="flex justify-center my-12">
        <div
          class="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin"
        ></div>
      </div>

      <div
        v-else-if="pokemonList.length === 0"
        class="flex flex-col items-center justify-center p-8 bg-white/10 rounded-xl text-white text-center my-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-16 h-16 mb-4 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <p class="text-xl">
          No favourites yet. Add some Pokémon to your favourites!
        </p>
      </div>

      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        <div
          v-for="pokemon in pokemonList"
          :key="pokemon.name"
          @click="goToPokemonDetail(pokemon.name)"
          :data-test="`pokemon-${pokemon.name}`"
          class="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group"
        >
          <div
            class="bg-gradient-radial from-white/20 to-transparent p-4 flex justify-center items-center h-40"
          >
            <img
              :src="pokemon.sprite"
              :alt="pokemon.name"
              class="w-32 h-32 object-contain transition-transform duration-300 filter drop-shadow-md group-hover:scale-110"
              loading="lazy"
            />
          </div>
          <div class="p-4 bg-gradient-to-b from-red-600 to-red-700">
            <h3 class="capitalize font-bold text-lg text-white text-center">
              {{ pokemon.name }}
            </h3>
          </div>
        </div>
      </div>

      <div
        v-if="pokemonList.length > 0"
        class="flex justify-between items-center mt-8"
      >
        <button
          data-test="previous"
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium shadow-md hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>
        <span class="text-white font-medium px-4 py-2 bg-black/20 rounded-lg">
          Page {{ currentPage }} of
          {{ Math.ceil(totalPokemons / itemsPerPage) }}
        </span>
        <button
          @click="goToNextPage()"
          data-test="next"
          :disabled="currentPage >= Math.ceil(totalPokemons / itemsPerPage)"
          class="px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium shadow-md hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .bg-gradient-radial {
    background-image: radial-gradient(var(--tw-gradient-stops));
  }
</style>
