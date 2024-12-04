<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { usePokemonStore } from '../store/pokemon'

  const router = useRouter()
  const pokemonList = ref<{ name: string; sprite: string }[]>([])
  const store = usePokemonStore()
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const totalPokemons = ref(0)

  const loadData = () => {
    store.loadFavoritePokemon(currentPage.value, itemsPerPage.value)
    pokemonList.value = store.favoritePokemon.map((pokemon) => ({
      name: pokemon.name,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
    }))
    totalPokemons.value = store.totalFavoritePokemon
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
  <div class="max-w-2xl mx-auto p-5">
    <div class="bg-blue-600 p-5 rounded-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-white">Select a Pokémon:</h2>
      <div class="grid grid-cols-2 gap-4 ml-24 mr-24">
        <div
          v-for="pokemon in pokemonList"
          :key="pokemon.name"
          @click="goToPokemonDetail(pokemon.name)"
          class="cursor-pointer bg-red-600 text-white hover:underline inline-block items-center p-2 rounded-lg shadow-md text-center"
        >
          <img class="m-auto" :src="pokemon.sprite" alt="pokemon" />
          <span class="capitalize">{{ pokemon.name }}</span>
        </div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <button
          data-test="previous"
          @click="goToPreviousPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="text-red-700">
          Page {{ currentPage }} of
          {{ Math.ceil(totalPokemons / itemsPerPage) }}
        </span>
        <button
          @click="goToNextPage()"
          data-test="next"
          :disabled="currentPage >= Math.ceil(totalPokemons / itemsPerPage)"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
</style>
