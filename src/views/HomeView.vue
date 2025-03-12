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
  const limit = 12
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
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight
    if (bottom) {
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
    const response = await fetchPokemonList(1000, 0)
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
  <div class="pokedex-home">
    <div class="home-container">
      <div class="search-section">
        <div class="search-header">
          <h2 class="search-title">Find Your Pokémon</h2>
          <div class="search-bar-container">
            <div class="search-bar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="search-icon"
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
                class="search-input"
                aria-label="Search Pokémon"
              />
              <button
                v-if="inputValue"
                @click="clearSearch"
                class="clear-button"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="clear-icon"
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

        <transition-group name="pokemon-list" tag="div" class="pokemon-grid">
          <div
            v-for="pokemon in pokemonList"
            :key="pokemon.name"
            class="pokemon-card"
            @click="goToPokemonDetail(pokemon.name)"
          >
            <div class="pokemon-image-container">
              <img
                :src="getPokemonImageUrl(getPokemonIdFromUrl(pokemon.url))"
                :alt="pokemon.name"
                class="pokemon-image"
                loading="lazy"
              />
            </div>
            <div class="pokemon-info">
              <span class="pokemon-id">
                #{{ getPokemonIdFromUrl(pokemon.url) }}
              </span>
              <h3 class="pokemon-name">{{ pokemon.name }}</h3>
            </div>
          </div>
        </transition-group>

        <div v-if="pokemonList.length === 0 && !isLoading" class="no-results">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="no-results-icon"
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

        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading Pokémon...</p>
        </div>

        <div
          v-if="!isLoading && pokemonList.length > 0"
          class="scroll-indicator"
          ref="scrollIndicator"
        >
          <p>Scroll down for more</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="scroll-arrow"
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

<style scoped>
  .pokedex-home {
    min-height: 100vh;
    padding: 1rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .home-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .search-section {
    background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
  }

  .search-header {
    margin-bottom: 1.5rem;
  }

  .search-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .search-bar-container {
    display: flex;
    justify-content: center;
  }

  .search-bar {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 600px;
    background-color: white;
    border-radius: 9999px;
    padding: 0.5rem 1rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }

  .search-bar:focus-within {
    box-shadow:
      0 0 0 3px rgba(66, 153, 225, 0.5),
      0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .search-icon {
    width: 1.5rem;
    height: 1.5rem;
    color: #6b7280;
    margin-right: 0.75rem;
  }

  .search-input {
    flex: 1;
    border: none;
    font-size: 1rem;
    background: transparent;
    color: #1f2937;
    padding: 0.5rem 0;
  }

  .search-input:focus {
    outline: none;
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .clear-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    margin-left: 0.5rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clear-button:hover {
    background-color: #f3f4f6;
  }

  .clear-icon {
    width: 1.25rem;
    height: 1.25rem;
    color: #6b7280;
  }

  .pokemon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .pokemon-list-enter-active,
  .pokemon-list-leave-active {
    transition: all 0.3s ease;
  }

  .pokemon-list-enter-from,
  .pokemon-list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .pokemon-card {
    background-color: #ef4444;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .pokemon-card:hover {
    transform: translateY(-5px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .pokemon-card:hover .pokemon-image {
    transform: scale(1.1);
  }

  .pokemon-image-container {
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 120px;
  }

  .pokemon-image {
    width: 80px;
    height: 80px;
    object-fit: contain;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .pokemon-info {
    background-color: #fff;
    padding: 0.75rem;
    position: relative;
  }

  .pokemon-id {
    position: absolute;
    top: -20px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-weight: bold;
  }

  .pokemon-name {
    text-transform: capitalize;
    font-weight: 600;
    font-size: 1rem;
    color: #111827;
    text-align: center;
    margin: 0;
  }

  .no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: white;
    text-align: center;
    margin-top: 2rem;
  }

  .no-results-icon {
    width: 3rem;
    height: 3rem;
    margin-bottom: 1rem;
    color: white;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: white;
    text-align: center;
    margin-top: 2rem;
  }

  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: 0.25rem solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-text {
    margin-top: 1rem;
    font-weight: 500;
  }

  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.5rem;
    color: white;
    opacity: 0.7;
    animation: bounce 2s infinite;
  }

  .scroll-arrow {
    width: 1.5rem;
    height: 1.5rem;
    margin-top: 0.5rem;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
</style>
