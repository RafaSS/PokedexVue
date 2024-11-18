<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchPokemonDetails,
  fetchPokemonEvolutionChain,
  fetchPokemonSpecies,
} from '../api/pokemonApi';
import {
  EvolutionChain,
  PokemonDetails,
  PokemonSpecies,
} from '../interfaces/Pokemon';
import { usePokemonStore } from '../store/pokemon';

const route = useRoute();
const router = useRouter();
const pokemonDetail = ref<PokemonDetails>();
const pokemonEvotion = ref<EvolutionChain>();
const pokemonSpecies = ref<PokemonSpecies>();
const isFavorite = ref(false);
const currentPage = ref(1); // Added for pagination

const loadData = async () => {
  pokemonDetail.value = await fetchPokemonDetails(route.params.name as string);
  pokemonSpecies.value = await fetchPokemonSpecies(route.params.name as string);
  pokemonEvotion.value = await fetchPokemonEvolutionChain(
    extractEvolutionIdFromUrl(
      pokemonSpecies.value?.evolution_chain.url as string,
    ),
  );
  isFavorite.value = await usePokemonStore().isFavoritePokemon(
    pokemonDetail.value.name as string,
  );
};

// Call loadData on component mount
onMounted(loadData);

// Watch for changes in route parameter and reload data when it changes
watch(() => route.params.name, loadData);

const goToEvolution = async (direction: 'next' | 'previous') => {
  if (direction === 'next') {
    if (pokemonEvotion.value?.chain.evolves_to[0]) {
      const nextSpecies = findNextEvolution(
        pokemonEvotion.value?.chain,
        route.params.name as string,
      );
      if (nextSpecies) {
        router.push(
          `/pokemondetail/${nextSpecies}?page=${currentPage.value + 1}`,
        );
      }
    }
  } else if (direction === 'previous') {
    const previousSpecies = findPreviousEvolution(
      pokemonEvotion.value?.chain,
      route.params.name as string,
    );
    if (previousSpecies) {
      router.push(
        `/pokemondetail/${previousSpecies}?page=${currentPage.value - 1}`,
      );
    }
  }
};

const toggleFavorite = async () => {
  isFavorite.value = !isFavorite.value;
  if (isFavorite.value) {
    if (pokemonDetail.value) {
      usePokemonStore().saveFavoritePokemon({
        name: pokemonDetail.value.name,
        url: pokemonDetail.value.species.url,
      });
    }
  } else {
    usePokemonStore().removeFavoritePokemon(
      pokemonDetail.value?.name as string,
    );
  }
};

// Helper functions remain the same

const findPreviousEvolution = (
  chain: any,
  currentName: string,
): string | null => {
  if (!chain) return null;

  if (chain.evolves_to.some((e: any) => e.species.name === currentName)) {
    return chain.species.name;
  }
  for (const evolution of chain.evolves_to) {
    const result = findPreviousEvolution(evolution, currentName);
    if (result) return result;
  }

  return null;
};

const findNextEvolution = (chain: any, currentName: string): string | null => {
  if (!chain) return null;
  if (chain.species.name === currentName && chain.evolves_to[0]) {
    return chain.evolves_to[0].species.name;
  }
  for (const evolution of chain.evolves_to) {
    const result = findNextEvolution(evolution, currentName);
    if (result) return result;
  }
  return null;
};

const extractEvolutionIdFromUrl = (url: string): number => {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
};
</script>

<template>
  <nav class="bg-gradient-to-r from-red-500 to-yellow-500 p-4 text-white flex justify-between items-center">
    <h1 class="text-lg font-bold cursor-pointer" @click="goToEvolution('previous')">
      Pokedex
    </h1>
    <div class="flex space-x-4">
      <button class="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-200" @click="router.push('/')">
        Home
      </button>
      <button class="bg-white text-red-500 px-3 py-1 rounded hover:bg-gray-200
      " @click="router.push('/favourites')">
        Favorites
      </button>
    </div>
  </nav>
  <div class="relative max-w-md mx-auto p-5 border border-gray-300 rounded-lg shadow-md bg-red-500">
    <h1 class="text-2xl font-bold mb-4">{{ pokemonDetail?.name }}</h1>
    <div class="absolute top-2 right-2" @click="toggleFavorite">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6"
        :class="{ 'text-yellow-400': isFavorite, 'text-gray-400': !isFavorite }" fill="currentColor" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.455a1 1 0 00-1.175 0l-3.37 2.455c-.784.57-1.838-.197-1.54-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.98 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
      </svg>
    </div>
    <div class="flex flex-col items-center">
      <img :src="pokemonDetail?.sprites?.front_default" alt="Pokemon Image" class="mb-4" />
      <p><strong>Height:</strong> {{ pokemonDetail?.height }}</p>
      <p><strong>Weight:</strong> {{ pokemonDetail?.weight }}</p>
      <p>
        <strong>Base Experience:</strong> {{ pokemonDetail?.base_experience }}
      </p>
      <p><strong>Abilities:</strong></p>
      <ul>
        <li v-for="ability in pokemonDetail?.abilities" :key="ability.ability.name">
          {{ ability.ability.name }}
        </li>
      </ul>
      <div class="flex space-x-2">
        <button v-if="pokemonDetail?.species?.url" @click="goToEvolution('previous')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
          ← Previous Evolution
        </button>
        <button v-if="pokemonDetail?.species?.url" @click="goToEvolution('next')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
          Go to Evolution →
        </button>
      </div>
    </div>
  </div>
</template>
