<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { usePokemonStore } from '../store/pokemon'
  import PokemonCard from '../components/pokemon/PokemonCard.vue'

  const pokemonList = ref<{ name: string; sprite: string; id: number }[]>([])
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
      id: pokemon.id,
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
</script>

<template>
  <div class="container mx-auto px-4 py-8 animate-fade-in">
    <div
      class="bg-gradient-to-br from-blue-600 to-blue-900 p-8 rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-500 transform hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
    >
      <!-- Decorative pokeball background -->
      <div
        class="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/5 -mr-16 -mt-16 z-0"
      ></div>
      <div
        class="absolute left-0 bottom-0 w-32 h-32 rounded-full bg-white/5 -ml-10 -mb-10 z-0"
      ></div>

      <h1 class="text-4xl font-bold mb-8 text-white text-center relative z-10">
        <span class="inline-block animate-title-slide">My Favorites</span>
      </h1>

      <div v-if="isLoading" class="flex justify-center my-12">
        <div
          class="w-20 h-20 rounded-full border-4 border-white/30 border-t-white animate-spin shadow-lg"
        ></div>
      </div>

      <div
        v-else-if="pokemonList.length === 0"
        class="flex flex-col items-center justify-center p-10 bg-white/10 backdrop-blur-sm rounded-2xl text-white text-center my-12 shadow-inner transform transition-all duration-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-24 h-24 mb-6 text-white opacity-80 animate-pulse-slow"
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
        <p class="text-2xl mb-2">No favorites yet</p>
        <p class="text-lg text-white/70">
          Add some Pokemon to your favorites by clicking the star icon on any
          Pokemon card!
        </p>
      </div>

      <transition-group
        name="pokemon-grid"
        tag="div"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        <PokemonCard
          v-for="pokemon in pokemonList"
          :key="pokemon.name"
          :pokemon="pokemon"
          :showFavoriteButton="true"
          :showId="true"
          class="transition-all duration-300 transform hover:scale-105"
        />
      </transition-group>

      <div
        v-if="pokemonList.length > 0"
        class="flex justify-between items-center mt-10 relative z-10"
      >
        <button
          data-test="previous"
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="px-5 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105 active:scale-95"
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
        <span
          class="text-white font-medium px-6 py-3 bg-black/20 backdrop-blur-sm rounded-xl shadow-inner"
        >
          Page {{ currentPage }} of
          {{ Math.ceil(totalPokemons / itemsPerPage) }}
        </span>
        <button
          @click="goToNextPage()"
          data-test="next"
          :disabled="currentPage >= Math.ceil(totalPokemons / itemsPerPage)"
          class="px-5 py-3 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center transform hover:scale-105 active:scale-95"
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
  .animate-fade-in {
    animation: fadeIn 0.6s ease-in-out;
  }

  .animate-title-slide {
    animation: titleSlide 0.8s ease-out;
  }

  .animate-pulse-slow {
    animation: pulseSlow 3s infinite ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes titleSlide {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pulseSlow {
    0% {
      opacity: 0.6;
      transform: scale(0.95);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.6;
      transform: scale(0.95);
    }
  }

  .pokemon-grid-enter-active,
  .pokemon-grid-leave-active {
    transition: all 0.5s ease;
  }

  .pokemon-grid-enter-from,
  .pokemon-grid-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .pokemon-grid-leave-active {
    position: absolute;
  }
</style>
