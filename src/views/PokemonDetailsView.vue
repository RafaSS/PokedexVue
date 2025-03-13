<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    fetchPokemonDetails,
    fetchPokemonEvolutionChain,
    fetchPokemonSpecies,
    fetchTypeDetails,
  } from '../api/pokemonApi'

  import PokemonStat from '../components/pokemon/PokemonStat.vue'
  import PokemonType from '../components/pokemon/PokemonType.vue'
  import PokemonNavigation from '../components/pokemon/PokemonNavigation.vue'

  import {
    EvolutionChain,
    PokemonDetails,
    PokemonSpecies,
  } from '../interfaces/Pokemon'
  import { usePokemonStore } from '../store/pokemon'

  const route = useRoute()
  const pokemonDetail = ref<PokemonDetails>()
  const otherArtWork = ref<string[]>([])
  const pokemonEvolution = ref<EvolutionChain>()
  const pokemonSpecies = ref<PokemonSpecies>()
  const isFavorite = ref(false)
  const previousEvolutionDetail = ref<PokemonDetails>()
  const nextEvolutionDetail = ref<PokemonDetails>()
  const selectedImage = ref<string | undefined>(undefined)
  const weaknesses = ref<string[]>([])
  const isLoading = ref(true)

  const mainTypeColor = computed(() => {
    if (!pokemonDetail.value?.types || pokemonDetail.value.types.length === 0) {
      return 'bg-blue-700'
    }

    const type = pokemonDetail.value.types[0].type.name
    const typeColors: Record<string, string> = {
      normal: 'bg-gray-400',
      fire: 'bg-red-600',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-800',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-300',
      psychic: 'bg-pink-500',
      bug: 'bg-green-600',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    }

    return typeColors[type] || 'bg-blue-700'
  })

  const cardAccentColor = computed(() => {
    if (!pokemonDetail.value?.types || pokemonDetail.value.types.length < 2) {
      return 'bg-blue-900'
    }

    const type = pokemonDetail.value.types[1].type.name
    const typeColors: Record<string, string> = {
      normal: 'bg-gray-600',
      fire: 'bg-red-800',
      water: 'bg-blue-700',
      electric: 'bg-yellow-600',
      grass: 'bg-green-700',
      ice: 'bg-blue-400',
      fighting: 'bg-red-900',
      poison: 'bg-purple-700',
      ground: 'bg-yellow-800',
      flying: 'bg-indigo-500',
      psychic: 'bg-pink-700',
      bug: 'bg-green-800',
      rock: 'bg-yellow-900',
      ghost: 'bg-purple-900',
      dragon: 'bg-indigo-800',
      dark: 'bg-gray-900',
      steel: 'bg-gray-700',
      fairy: 'bg-pink-500',
    }

    return typeColors[type] || 'bg-blue-900'
  })

  const loadData = async () => {
    isLoading.value = true
    try {
      pokemonDetail.value = await fetchPokemonDetails(
        route.params.name as string
      )
      pokemonSpecies.value = await fetchPokemonSpecies(
        route.params.name as string
      )
      otherArtWork.value = await getAltArtWork(
        pokemonDetail.value as PokemonDetails
      )
      pokemonEvolution.value = await fetchPokemonEvolutionChain(
        extractEvolutionIdFromUrl(
          pokemonSpecies.value?.evolution_chain.url as string
        )
      )
      isFavorite.value = usePokemonStore().isFavoritePokemon(
        pokemonDetail.value.name as string
      )

      const previousSpecies = findPreviousEvolution(
        pokemonEvolution.value?.chain,
        route.params.name as string
      )

      const halfDamage = new Set<string>()
      const doubleDamage = new Set<string>()

      for (const type of pokemonDetail.value?.types || []) {
        const typeDetails = await fetchTypeDetails(type.type.name)
        for (const damageRelation of typeDetails.damage_relations
          .double_damage_from) {
          doubleDamage.add(damageRelation.name)
        }
        for (const damageRelation of typeDetails.damage_relations
          .half_damage_from) {
          halfDamage.add(damageRelation.name)
        }
        weaknesses.value = Array.from(doubleDamage).filter(
          (type) => !halfDamage.has(type)
        )
      }

      const nextSpecies = findNextEvolution(
        pokemonEvolution.value?.chain,
        route.params.name as string
      )

      if (previousSpecies) {
        previousEvolutionDetail.value =
          await fetchPokemonDetails(previousSpecies)
      } else {
        previousEvolutionDetail.value = undefined
      }
      if (nextSpecies) {
        nextEvolutionDetail.value = await fetchPokemonDetails(nextSpecies)
      } else {
        nextEvolutionDetail.value = undefined
      }

      selectedImage.value =
        pokemonDetail.value?.sprites?.other['official-artwork'].front_default ||
        undefined
    } catch (error) {
      console.error('Error loading Pokemon details:', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadData)
  watch(() => route.params.name, loadData)

  const getAltArtWork = async (pokemon: PokemonDetails) => {
    const otherArtWork: string[] = []
    if (!pokemon?.sprites?.other) return otherArtWork
    for (const key in pokemon.sprites.other) {
      if (key !== 'official-artwork') {
        const artwork =
          pokemon.sprites.other[key as keyof typeof pokemon.sprites.other]
        if (artwork.front_default && !artwork.front_default.endsWith('.jpg')) {
          otherArtWork.push(artwork.front_default)
        }
      }
    }
    if (!pokemon.sprites.versions) return otherArtWork
    for (const key in pokemon.sprites.versions) {
      if (key !== 'generation-viii') {
        const version =
          pokemon.sprites.versions[key as keyof typeof pokemon.sprites.versions]
        for (const subKey in version) {
          if (subKey !== 'icons') {
            const artwork = version[subKey as keyof typeof version] as {
              front_default?: string
            }
            if (
              artwork.front_default &&
              !artwork.front_default.endsWith('.jpg')
            ) {
              otherArtWork.push(artwork.front_default)
            }
          }
        }
      }
    }
    return otherArtWork
  }

  const findPreviousEvolution = (
    chain: any,
    currentName: string
  ): string | null => {
    if (!chain) return null

    if (chain.evolves_to.some((e: any) => e.species.name === currentName)) {
      return chain.species.name
    }
    for (const evolution of chain.evolves_to) {
      const result = findPreviousEvolution(evolution, currentName)
      if (result) return result
    }

    return null
  }

  const findNextEvolution = (
    chain: any,
    currentName: string
  ): string | null => {
    if (!chain) return null
    if (chain.species.name === currentName && chain.evolves_to[0]) {
      return chain.evolves_to[0].species.name
    }
    for (const evolution of chain.evolves_to) {
      const result = findNextEvolution(evolution, currentName)
      if (result) return result
    }
    return null
  }

  const extractEvolutionIdFromUrl = (url: string): number => {
    const match = url.match(/\/(\d+)\/?$/)
    return match ? parseInt(match[1], 10) : 0
  }

  const toggleFavorite = () => {
    const store = usePokemonStore()
    if (isFavorite.value) {
      store.removeFavoritePokemon(pokemonDetail.value?.name as string)
    } else {
      store.saveFavoritePokemon({
        id: pokemonDetail.value?.id as number,
        name: pokemonDetail.value?.name as string,
        url: 'pokemon/' + pokemonDetail.value?.name,
      })
    }
    isFavorite.value = !isFavorite.value
  }

  const updateSelectedImage = (image: string) => {
    selectedImage.value = image
  }
</script>

<template>
  <div class="container mx-auto px-4 py-8 animate-fade-in">
    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="max-w-4xl mx-auto">
      <div class="animate-pulse bg-gray-200 h-96 rounded-xl mb-4"></div>
      <div
        class="animate-pulse bg-gray-200 h-12 rounded-lg mb-4 w-1/3 mx-auto"
      ></div>
      <div
        class="animate-pulse bg-gray-200 h-8 rounded-lg mb-4 w-1/2 mx-auto"
      ></div>
      <div class="flex space-x-4 mb-4">
        <div class="animate-pulse bg-gray-200 h-6 rounded-lg w-1/4"></div>
        <div class="animate-pulse bg-gray-200 h-6 rounded-lg w-1/4"></div>
        <div class="animate-pulse bg-gray-200 h-6 rounded-lg w-1/4"></div>
      </div>
    </div>

    <!-- Pokemon Details Card -->
    <article
      v-else
      :class="[
        'flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)] max-w-4xl mx-auto',
        mainTypeColor,
      ]"
      role="article"
      aria-labelledby="pokemon-name"
    >
      <!-- Header with ID and Pokeball background -->
      <div
        class="relative py-4 px-6 flex justify-between items-center overflow-hidden"
      >
        <span class="text-white/70 font-bold text-xl">
          #{{ pokemonDetail?.id }}
        </span>
        <div
          class="absolute right-0 top-0 w-32 h-32 rounded-full bg-white/10 -mr-10 -mt-10 z-0"
        ></div>
      </div>

      <!-- Main content section -->
      <section
        :class="[
          'relative p-6 w-full rounded-3xl transition-all duration-500',
          cardAccentColor,
        ]"
        aria-label="Pokemon Information"
      >
        <!-- Favorite button -->
        <button
          class="absolute top-4 right-4 cursor-pointer z-10 transform transition-transform duration-300 hover:scale-110"
          @click="toggleFavorite"
          :aria-label="
            isFavorite ? 'Remove from Favorites' : 'Add to Favorites'
          "
        >
          <svg
            class="w-8 h-8"
            :class="
              isFavorite
                ? 'text-yellow-400 animate-favorite-pop'
                : 'text-white/50'
            "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        </button>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Pokemon Image Section -->
          <div
            class="flex flex-col items-center justify-center order-1 md:order-2"
          >
            <div
              class="relative w-full aspect-square bg-white/10 rounded-xl p-4 flex items-center justify-center overflow-hidden"
            >
              <div class="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div
                class="absolute w-40 h-40 rounded-full bg-white/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></div>
              <img
                :src="selectedImage"
                :alt="`${pokemonDetail?.name} artwork`"
                class="object-contain w-3/4 h-3/4 z-10 transition-all duration-500 transform hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Pokemon Info Section -->
          <div class="flex flex-col order-2 md:order-1">
            <h1
              id="pokemon-name"
              class="capitalize text-4xl md:text-5xl font-bold text-white mb-4 text-center md:text-left transition-all duration-300"
            >
              {{ pokemonDetail?.name }}
            </h1>

            <!-- Types -->
            <div class="flex items-center gap-4 mb-4">
              <span class="text-white/90 font-semibold">Types:</span>
              <div class="flex gap-2">
                <PokemonType
                  v-for="type in pokemonDetail?.types"
                  :key="type.type.name"
                  :type="type.type.name"
                  class="transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            <!-- Weaknesses -->
            <div class="flex items-center gap-4 mb-6">
              <span class="text-white/90 font-semibold">Weaknesses:</span>
              <div class="flex flex-wrap gap-2">
                <PokemonType
                  v-for="weakness in weaknesses"
                  :key="weakness"
                  :type="weakness"
                  class="transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-x-6 gap-y-3">
              <PokemonStat
                v-for="(stat, index) in pokemonDetail?.stats"
                :key="index"
                :label="stat.stat.name"
                :value="stat.base_stat"
                class="transition-all duration-300 hover:translate-x-1"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Evolution and image navigation -->
      <div
        class="p-4 w-full transition-all duration-300"
        aria-label="Pokemon navigation"
      >
        <PokemonNavigation
          :previous="previousEvolutionDetail || ''"
          :next="nextEvolutionDetail || ''"
          :other="otherArtWork"
          @selectImage="updateSelectedImage"
          class="transition-all duration-300"
        />
      </div>
    </article>
  </div>
</template>

<style scoped>
  .animate-fade-in {
    animation: fadeIn 0.6s ease-in-out;
  }

  .animate-favorite-pop {
    animation: favoritePop 0.4s ease-in-out;
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

  @keyframes favoritePop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.4);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
