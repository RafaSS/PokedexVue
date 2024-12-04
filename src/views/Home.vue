<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { fetchPokemonList } from '../api/pokemonApi';
import type { Result } from '../interfaces/Pokemon';

const router = useRouter();
const inputValue = ref('');
const pokemonListSearch = ref<Result[]>([]);
const pokemonList = ref<Result[]>([]);
const isLoading = ref(false);
const offset = ref(0);
const limit = 12;
let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

const fetchPokemons = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  const response = await fetchPokemonList(limit, offset.value);
  pokemonList.value = [...pokemonList.value, ...response.results];
  offset.value += limit;
  isLoading.value = false;
};

const handleScroll = () => {
  const bottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight;
  if (bottom) {
    fetchPokemons();
  }
};

onMounted(async () => {
  await fetchPokemons();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const getPokemonImageUrl = (id: number) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const getPokemonIdFromUrl = (url: string) => {
  const urlParts = url.split('/');
  return parseInt(urlParts[urlParts.length - 2]);
};

const goToPokemonDetail = (name: string) => {
  router.push(`/pokemondetail/${name}`);
};

const searchPokemon = async () => {
  isLoading.value = true;
  // Reset offset and update main list with filtered results
  offset.value = 0;
  const response = await fetchPokemonList(1000, 0); // Get all pokemons
  pokemonList.value = response.results
    .filter((pokemon: Result) => pokemon.name.includes(inputValue.value))
    .slice(0, limit);

  isLoading.value = false;
};

watch(inputValue, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    if (inputValue.value === '') {
      offset.value = 0;
      fetchPokemons();
    } else {
      searchPokemon();
    }
  }, 300);
});

</script>

<template>
  <div class="min-h-screen flex flex-col items-center p-4">
    <div class="max-w-4xl w-full">
      <div class="bg-blue-600 p-5 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4 text-white">Search Pokémon:</h2>
        <input v-model="inputValue" type="text" placeholder="Search Pokémon..." class="w-full p-2 rounded-lg" />
        <h2 class="text-xl font-semibold mb-4 mt-4 text-white">Select a Pokémon:</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="pokemon in pokemonList" :key="pokemon.name" @click="goToPokemonDetail(pokemon.name)"
            class="cursor-pointer bg-red-600 text-white hover:bg-red-700 p-3 rounded-lg shadow-md text-center">
            <img :src="getPokemonImageUrl(getPokemonIdFromUrl(pokemon.url))" alt="pokemon.name"
              class="w-20 h-20 mx-auto mb-2" />
            <span class="capitalize">{{ pokemon.name }}</span>
          </div>
        </div>
        <div v-if="isLoading" class="text-center text-white mt-4">
          Loading more Pokémon...
        </div>
      </div>
    </div>
  </div>
</template>
