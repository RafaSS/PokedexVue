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
} from '@/interfaces/Pokemon';

const route = useRoute();
const router = useRouter();
const pokemonDetail = ref<PokemonDetails>();
const pokemonEvotion = ref<EvolutionChain>();
const pokemonSpecies = ref<PokemonSpecies>();

const loadData = async () => {
  pokemonDetail.value = await fetchPokemonDetails(route.params.name as string);
  pokemonSpecies.value = await fetchPokemonSpecies(route.params.name as string);
  pokemonEvotion.value = await fetchPokemonEvolutionChain(
    extractEvolutionIdFromUrl(
      pokemonSpecies.value?.evolution_chain.url as string,
    ),
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
        router.push(`/pokemondetail/${nextSpecies}`);
      }
    }
  } else if (direction === 'previous') {
    const previousSpecies = findPreviousEvolution(
      pokemonEvotion.value?.chain,
      route.params.name as string,
    );
    if (previousSpecies) {
      router.push(`/pokemondetail/${previousSpecies}`);
    }
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
  console.log("aqui");
  return null;
};

const extractEvolutionIdFromUrl = (url: string): number => {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
};
</script>

<template>
  <div
    class="max-w-md mx-auto p-5 border border-gray-300 rounded-lg shadow-md bg-red-500"
  >
    <h1 class="text-2xl font-bold mb-4">{{ pokemonDetail?.name }}</h1>
    <div class="flex flex-col items-center">
      <img
        :src="pokemonDetail?.sprites?.front_default"
        alt="Pokemon Image"
        class="mb-4"
      />
      <p><strong>Height:</strong> {{ pokemonDetail?.height }}</p>
      <p><strong>Weight:</strong> {{ pokemonDetail?.weight }}</p>
      <p>
        <strong>Base Experience:</strong> {{ pokemonDetail?.base_experience }}
      </p>
      <p><strong>Abilities:</strong></p>
      <ul>
        <li
          v-for="ability in pokemonDetail?.abilities"
          :key="ability.ability.name"
        >
          {{ ability.ability.name }}
        </li>
      </ul>
      <div class="flex space-x-2">
        <button
          v-if="pokemonDetail?.species?.url"
          @click="goToEvolution('previous')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        >
          ← Previous Evolution
        </button>
        <button
          v-if="pokemonDetail?.species?.url"
          @click="goToEvolution('next')"
          class="mt-4 px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        >
          Go to Evolution →
        </button>
      </div>
    </div>
  </div>
</template>
