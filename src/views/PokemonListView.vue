<template>
    <div>
      <h1>Pokédex</h1>
      <div v-if="loading">Loading...</div>
      <div v-else>
        <ul>
          <li v-for="pokemon in pokemonList?.results || []" :key="pokemon.name">
            {{ pokemon.name }}
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { fetchPokemonList } from '../api/pokemonApi';
  import type { PokemonList } from '../interfaces/Pokemon';
  
  export default defineComponent({
    name: 'PokemonListView',
    setup() {
      const pokemonList = ref<PokemonList>();
      const loading = ref(true);
  
      // Fetch data when the component is mounted
      onMounted(async () => {
        try {
          pokemonList.value = await fetchPokemonList(100000, 0);
        } catch (error) {
          console.error("Error fetching Pokémon:", error);
        } finally {
          loading.value = false;
        }
      });
  
      return { pokemonList, loading };
    },
  });
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    color: #333;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
  </style>
  