<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { fetchPokemonList } from '../api/pokemonApi';
import type { PokemonList, Result } from '../interfaces/Pokemon';

const router = useRouter();
const inputValue = ref('');
const pokemonListSearch = ref<Result[]>([]);
const pokemonList = ref<PokemonList>();
const isLoading = ref(false);
let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

onMounted(async () => {
  pokemonList.value = await fetchPokemonList(100000, 0);
});

const goToPokemonDetail = (name: string) => {
  router.push(`/pokemondetail/${name}`);
};

const searchPokemon = async () => {
  isLoading.value = true;
  pokemonListSearch.value =
    pokemonList.value?.results
      ?.filter((pokemon: Result) => pokemon.name.includes(inputValue.value))
      .slice(0, 3) || [];
  isLoading.value = false;
};

watch(inputValue, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    searchPokemon();
  }, 300);
});
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row items-center justify-center p-4">
    <div class="w-full md:w-auto flex flex-col md:flex-row items-center relative">
      <div class="flex items-center w-full md:w-auto focus-within:ring-2 focus-within:ring-blue-500">
        <input v-model="inputValue" type="text" class="flex-1 px-4 py-2 focus:outline-none" placeholder="Search Pokemon..." />
        <button @click="goToPokemonDetail('bulbasaur')" class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
          🔍
        </button>
      </div>
      <ul class="absolute top-full bg-red-700 left-0 mt-1 w-full rounded-lg shadow-lg z-10">
        <li v-if="isLoading" class="p-2">Loading...</li>
        <li v-for="pokemon in pokemonListSearch" :key="pokemon.name" class="p-2 hover:bg-red-900 rounded cursor-pointer" @click="goToPokemonDetail(pokemon.name)">
          {{ pokemon.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
