<script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { fetchPokemonList, fetchTypeDetails } from '../api/pokemonApi'
  import type { Result } from '../interfaces/Pokemon'
  import PokemonCard from '../components/pokemon/PokemonCard.vue'
  import PokemonType from '../components/pokemon/PokemonType.vue'

  const inputValue = ref('')
  const pokemonList = ref<Result[]>([])
  const allPokemonData = ref<Result[]>([])
  const isLoading = ref(false)
  const offset = ref(0)
  const limit = 30
  let debounceTimeout: ReturnType<typeof setTimeout> | undefined
  const selectedTypes = ref<string[]>([])
  const isLoadingMore = ref(false)
  const allPokemonTypes = [
    'normal',
    'fire',
    'water',
    'grass',
    'electric',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ]

  const fetchPokemons = async () => {
    if (isLoading.value || isLoadingMore.value) return

    isLoadingMore.value = true
    const response = await fetchPokemonList(limit, offset.value)
    allPokemonData.value = [...allPokemonData.value, ...response.results]

    // Apply any active filters
    if (selectedTypes.value.length > 0) {
      await applyTypeFilters()
    } else {
      pokemonList.value = [...allPokemonData.value]
    }

    offset.value += limit
    isLoadingMore.value = false
  }

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY
    const scrollThreshold = document.documentElement.scrollHeight * 0.8 // Load when user scrolls to 80% of the page

    // Only fetch more if we're not at the bottom of the page
    if (
      scrollPosition >= scrollThreshold &&
      scrollPosition < document.documentElement.scrollHeight - 10
    ) {
      fetchPokemons()
    }
  }

  onMounted(async () => {
    await fetchPokemons()
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  const searchPokemon = async () => {
    isLoading.value = true
    offset.value = 0
    const response = await fetchPokemonList(10000, 0)
    allPokemonData.value = response.results

    if (selectedTypes.value.length > 0) {
      await applyTypeFilters()
    } else {
      pokemonList.value = allPokemonData.value
        .filter((pokemon: Result) => pokemon.name.includes(inputValue.value))
        .slice(0, limit)
    }

    isLoading.value = false
  }

  const clearSearch = () => {
    inputValue.value = ''
    offset.value = 0
    fetchPokemons()
  }

  watch(inputValue, () => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      if (inputValue.value === '') {
        offset.value = 0
        fetchPokemons()
      } else {
        searchPokemon()
      }
    }, 300)
  })

  // Handle type filtering with "AND" logic
  const applyTypeFilters = async () => {
    if (selectedTypes.value.length === 0) {
      // If no types selected, return to normal (possibly filtered by search)
      pokemonList.value = allPokemonData.value
        .filter((pokemon: Result) =>
          inputValue.value ? pokemon.name.includes(inputValue.value) : true
        )
        .slice(0, offset.value)
      return
    }

    isLoading.value = true

    // Get Pokémon for each selected type
    const typePromises = selectedTypes.value.map((type) =>
      fetchTypeDetails(type)
    )
    const typeResults = await Promise.all(typePromises)

    // Create a map to count how many selected types each Pokémon has
    const pokemonTypeCount = new Map<string, number>()

    // Count occurrences of each Pokémon across all selected types
    typeResults.forEach((typeData) => {
      typeData.pokemon.forEach((p: any) => {
        const pokemonName = p.pokemon.name
        pokemonTypeCount.set(
          pokemonName,
          (pokemonTypeCount.get(pokemonName) || 0) + 1
        )
      })
    })

    // Filter Pokémon that have ALL selected types (equal to the count of selected types)
    const filteredNames = Array.from(pokemonTypeCount.entries())
      .filter(([, count]) => count === selectedTypes.value.length)
      .map(([name]) => name)

    // Apply both type filtering AND search filtering if needed
    pokemonList.value = allPokemonData.value
      .filter(
        (pokemon) =>
          filteredNames.includes(pokemon.name) &&
          (inputValue.value ? pokemon.name.includes(inputValue.value) : true)
      )
      .slice(0, offset.value)

    isLoading.value = false
  }

  // Toggle type selection and apply filters
  const toggleTypeFilter = async (type: string) => {
    const index = selectedTypes.value.indexOf(type)
    if (index === -1) {
      selectedTypes.value.push(type)
    } else {
      selectedTypes.value.splice(index, 1)
    }

    // Reset and reapply filters whenever type selection changes
    offset.value = limit
    await applyTypeFilters()
  }
</script>

<template>
  <div
    class="min-h-screen py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 animate-fade-in"
  >
    <div class="container max-w-7xl mx-auto">
      <div
        class="bg-gradient-to-br from-blue-500 to-indigo-700 rounded-3xl p-8 shadow-2xl transition-all duration-500 transform hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden relative"
      >
        <!-- Decorative elements -->
        <div
          class="absolute right-0 top-0 w-48 h-48 rounded-full bg-white/10 -mr-16 -mt-16 z-0"
        ></div>
        <div
          class="absolute left-0 bottom-0 w-32 h-32 rounded-full bg-white/10 -ml-10 -mb-10 z-0"
        ></div>

        <div class="relative z-10">
          <h2
            class="text-3xl md:text-4xl font-bold text-white mb-6 text-center animate-title-slide"
          >
            Pokédex Explorer
          </h2>

          <!-- Search input -->
          <div class="flex justify-center mb-8">
            <div
              class="flex items-center w-full max-w-xl bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg transition-all duration-300 focus-within:shadow-blue-300 focus-within:ring-2 focus-within:ring-blue-400 transform hover:scale-[1.01]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-blue-600 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                v-model="inputValue"
                type="text"
                placeholder="Search Pokémon by name..."
                class="flex-1 border-none text-base bg-transparent text-gray-800 py-2 focus:outline-none"
                aria-label="Search Pokémon"
              />
              <button
                v-if="inputValue"
                @click="clearSearch"
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Type filters -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-white/90 mb-4 text-center">
              Filter by Type
            </h3>
            <div class="flex flex-wrap justify-center gap-2">
              <button
                v-for="type in allPokemonTypes"
                :key="type"
                @click="toggleTypeFilter(type)"
                class="transition-all duration-300 transform hover:scale-110 focus:outline-none"
                :class="[
                  selectedTypes.includes(type)
                    ? 'ring-2 ring-white scale-110'
                    : '',
                  selectedTypes.length > 0 && !selectedTypes.includes(type)
                    ? 'opacity-70'
                    : '',
                ]"
              >
                <PokemonType :type="type" />
              </button>
            </div>
          </div>

          <!-- Pokemon grid with transition effects -->
          <transition-group
            name="pokemon-grid"
            tag="div"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
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

          <!-- Empty state -->
          <div
            v-if="pokemonList.length === 0 && !isLoading"
            class="flex flex-col items-center justify-center p-10 bg-white/10 backdrop-blur-sm rounded-2xl text-white text-center my-12 shadow-inner"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-24 h-24 mb-6 text-white/80 animate-pulse-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-2xl mb-2">No Pokémon found</p>
            <p class="text-lg text-white/70">
              Try a different search term or filter
            </p>
          </div>

          <!-- Loading state -->
          <div
            v-if="isLoading || isLoadingMore"
            class="flex flex-col items-center justify-center p-8 text-white text-center my-8"
          >
            <div
              class="w-20 h-20 rounded-full border-4 border-white/30 border-t-white animate-spin shadow-lg"
            ></div>
            <p class="mt-6 font-medium text-lg">Loading Pokémon...</p>
          </div>

          <!-- Selected filters display -->
          <div v-if="selectedTypes.length > 0" class="my-4 text-center">
            <p class="text-white/90 mb-2">Active filters:</p>
            <div class="flex flex-wrap justify-center gap-2">
              <div
                v-for="type in selectedTypes"
                :key="type"
                class="px-3 py-1 bg-white/20 rounded-full text-white text-sm flex items-center"
              >
                <span class="mr-1">{{ type }}</span>
                <button
                  @click="toggleTypeFilter(type)"
                  class="text-white/80 hover:text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Scroll indicator -->
          <div
            v-if="!isLoading && !isLoadingMore && pokemonList.length > 0"
            class="flex flex-col items-center mt-10 text-white/80"
            ref="scrollIndicator"
          >
            <p class="font-medium mb-2">Scroll down for more</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
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
