<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { fetchPokemonList } from '../api/pokemonApi';
import type { PokemonList, Result } from '../interfaces/Pokemon';

const router = useRouter();
const inputValue = ref('');
const pokemonListSearch = ref<Result[]>([]);
const pokemonList = ref<PokemonList>();

onMounted(async () => {
  pokemonList.value = await fetchPokemonList(100000, 0);
});

const goToPokemonDetail = (name: string) => {
  router.push(`/pokemondetail/${name}`);
};

const searchPokemon = async () => {
  pokemonListSearch.value = pokemonList.value?.results?.filter((pokemon: Result) =>
    pokemon.name.includes(inputValue.value),
  ).slice(0, 3) || [];
};
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row items-center justify-center p-4">
    <div class="w-full md:w-auto">
      <input
        v-model="inputValue"
        @input="searchPokemon"
        type="text"
        class="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Search Pokemon..."
      />
      <ul class="mt-2">
        <li 
          v-for="pokemon in pokemonListSearch" 
          :key="pokemon.name"
          class="p-2 hover:bg-red-900 rounded"
          @click="goToPokemonDetail(pokemon.name)"
        >
          {{ pokemon.name }}
        </li>
      </ul>
    </div>
    <button
      @click="goToPokemonDetail('bulbasaur')"
      class="mt-4 md:mt-0 md:ml-4 px-4 py-2 w-full md:w-auto bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      🔍
    </button>
  </div>
</template>
