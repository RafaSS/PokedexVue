<template>
  <div class="max-w-3xl mx-auto p-5">
    <h1 class="text-3xl font-bold mb-4 text-center text-red-500">Pokédex</h1>

    <!-- Pokémon List -->
    <div class="mb-8 bg-black p-4 rounded">
      <h2 class="text-xl font-semibold mb-3 text-red-500">Select a Pokémon:</h2>
      <ul class="space-y-2">
        <li
          v-for="pokemon in pokemonList"
          :key="pokemon.name"
          @click="selectPokemon(pokemon.name)"
          class="cursor-pointer text-red-500 hover:underline"
        >
          {{ pokemon.name }}
        </li>
      </ul>
    </div>

    <!-- Pokémon Details -->
    <div
      v-if="selectedPokemonDetail"
      class="p-5 border border-red-500 rounded-lg shadow-md bg-black text-red-500"
    >
      <h2 class="text-2xl font-bold mb-4">{{ selectedPokemonDetail.name }}</h2>
      <div class="flex flex-col items-center">
        <img
          :src="selectedPokemonDetail.sprites.front_default"
          alt="Pokemon Image"
          class="mb-4"
        />
        <p><strong>Height:</strong> {{ selectedPokemonDetail.height }}</p>
        <p><strong>Weight:</strong> {{ selectedPokemonDetail.weight }}</p>
        <p>
          <strong>Base Experience:</strong>
          {{ selectedPokemonDetail.base_experience }}
        </p>
        <p><strong>Abilities:</strong></p>
        <ul>
          <li
            v-for="ability in selectedPokemonDetail.abilities"
            :key="ability.ability.name"
          >
            {{ ability.ability.name }}
          </li>
        </ul>
      </div>

      <!-- Evolution Navigation Buttons -->
      <div class="flex space-x-2 mt-4">
        <button
          v-if="selectedPokemonDetail.species?.url"
          @click="goToEvolution('previous')"
          class="px-4 py-2 bg-red-500 text-black hover:bg-red-600"
        >
          ← Previous Evolution
        </button>
        <button
          v-if="selectedPokemonDetail.species?.url"
          @click="goToEvolution('next')"
          class="px-4 py-2 bg-red-500 text-black hover:bg-red-600"
        >
          Next Evolution →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  fetchPokemonList,
  fetchPokemonDetails,
  fetchPokemonEvolutionChain,
  fetchPokemonSpecies,
} from '../api/pokemonApi';
import type {
  PokemonDetails,
  EvolutionChain,
  PokemonSpecies,
} from '@/interfaces/Pokemon';

const router = useRouter();
const pokemonList = ref<{ name: string; url: string }[]>([]);
const selectedPokemonDetail = ref<PokemonDetails | null>(null);
const pokemonEvotion = ref<EvolutionChain | null>(null);
const pokemonSpecies = ref<PokemonSpecies | null>(null);

// Fetch list of Pokémon
onMounted(async () => {
  const response = await fetchPokemonList(20, 0);
  pokemonList.value = response.results;
});

// Select Pokémon and load details
const selectPokemon = async (name: string) => {
  selectedPokemonDetail.value = await fetchPokemonDetails(name);
  pokemonSpecies.value = await fetchPokemonSpecies(name);
  pokemonEvotion.value = await fetchPokemonEvolutionChain(
    extractEvolutionIdFromUrl(
      pokemonSpecies.value?.evolution_chain.url as string,
    ),
  );
};

// Evolution navigation logic
const goToEvolution = async (direction: 'next' | 'previous') => {
  if (!pokemonEvotion.value) return;

  if (direction === 'next') {
    if (pokemonEvotion.value.chain.evolves_to[0]) {
      const nextSpecies = findNextEvolution(
        pokemonEvotion.value.chain,
        selectedPokemonDetail.value?.name as string,
      );
      if (nextSpecies) selectPokemon(nextSpecies);
    }
  } else if (direction === 'previous') {
    const previousSpecies = findPreviousEvolution(
      pokemonEvotion.value.chain,
      selectedPokemonDetail.value?.name as string,
    );
    if (previousSpecies) selectPokemon(previousSpecies);
  }
};

// Helper functions for evolution navigation
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