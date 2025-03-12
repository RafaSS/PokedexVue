<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { fetchPokemonList } from '../api/pokemonApi'
  import type { Result } from '../interfaces/Pokemon'

  const router = useRouter()
  const inputValue = ref('')
  const pokemonList = ref<Result[]>([])
  const isLoading = ref(false)
  const offset = ref(0)
  const limit = 30
  let debounceTimeout: ReturnType<typeof setTimeout> | undefined

  const fetchPokemons = async () => {
    if (isLoading.value) return

    isLoading.value = true
    const response = await fetchPokemonList(limit, offset.value)
    pokemonList.value = [...pokemonList.value, ...response.results]
    offset.value += limit
    isLoading.value = false
  }

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY
    const scrollThreshold = document.documentElement.scrollHeight * 0.8 // Load when user scrolls to 80% of the page

    if (scrollPosition >= scrollThreshold) {
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

  const getPokemonImageUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`

  const getPokemonIdFromUrl = (url: string) => {
    const urlParts = url.split('/')
    return parseInt(urlParts[urlParts.length - 2])
  }

  const goToPokemonDetail = (name: string) => {
    router.push(`/pokemondetail/${name}`)
  }

  const searchPokemon = async () => {
    isLoading.value = true
    offset.value = 0
    const response = await fetchPokemonList(10000, 0)
    pokemonList.value = response.results
      .filter((pokemon: Result) => pokemon.name.includes(inputValue.value))
      .slice(0, limit)
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
</script>

<template>
  <div
    class="min-h-screen p-4 bg-gradient-to-br from-gray-100 to-blue-100 flex flex-col items-center"
  >
    <div class="w-full max-w-7xl mx-auto">
      <div
        class="bg-gradient-to-b from-blue-500 to-blue-700 rounded-2xl p-6 shadow-lg mb-8"
      >
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-4 text-center shadow-sm">
            Find Your Pokémon
          </h2>
          <div class="flex justify-center">
            <div
              class="flex items-center w-full max-w-xl bg-white rounded-full px-4 py-2 shadow-md transition-all duration-300 focus-within:shadow-blue-300 focus-within:ring-2 focus-within:ring-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-gray-500 mr-3"
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
                placeholder="Search by name..."
                class="flex-1 border-none text-base bg-transparent text-gray-800 py-2 focus:outline-none"
                aria-label="Search Pokémon"
              />
              <button
                v-if="inputValue"
                @click="clearSearch"
                class="p-1 rounded-full hover:bg-gray-100"
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
        </div>

        <transition-group
          name="pokemon-list"
          tag="div"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6"
        >
          <div
            v-for="pokemon in pokemonList"
            :key="pokemon.name"
            class="bg-red-500 rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative"
            @click="goToPokemonDetail(pokemon.name)"
          >
            <div
              class="bg-gradient-radial from-white/30 to-black/10 p-4 flex justify-center items-center h-30"
            >
              <img
                :src="getPokemonImageUrl(getPokemonIdFromUrl(pokemon.url))"
                :alt="pokemon.name"
                class="w-20 h-20 object-contain transition-transform duration-300 filter drop-shadow-md hover:scale-110"
                loading="lazy"
              />
            </div>
            <div class="bg-white p-3 relative">
              <span
                class="absolute -top-5 right-2.5 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-bold"
              >
                #{{ getPokemonIdFromUrl(pokemon.url) }}
              </span>
              <h3
                class="capitalize font-semibold text-base text-gray-900 text-center m-0"
              >
                {{ pokemon.name }}
              </h3>
            </div>
          </div>
        </transition-group>

        <div
          v-if="pokemonList.length === 0 && !isLoading"
          class="flex flex-col items-center justify-center p-8 bg-white/10 rounded-xl text-white text-center mt-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-12 h-12 mb-4 text-white"
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
          <p>No Pokémon found. Try a different search.</p>
        </div>

        <div
          v-if="isLoading"
          class="flex flex-col items-center justify-center p-8 text-white text-center mt-8"
        >
          <div
            class="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin"
          ></div>
          <p class="mt-4 font-medium">Loading Pokémon...</p>
        </div>

        <div
          v-if="!isLoading && pokemonList.length > 0"
          class="flex flex-col items-center mt-6 text-white opacity-70 animate-bounce"
          ref="scrollIndicator"
        >
          <p>Scroll down for more</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 mt-2"
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
</template>
