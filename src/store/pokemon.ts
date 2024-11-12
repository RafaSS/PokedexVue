// src/store/pokemon.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchPokemonList, fetchPokemonDetails } from '../api/pokemonApi';
import type { PokemonDetails, PokemonList } from '../interfaces/Pokemon';

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemonList = ref<PokemonList | null>(null);
  const selectedPokemon = ref<PokemonDetails | null>(null);

  async function loadPokemonList(limit = 10, offset = 0) {
    pokemonList.value = await fetchPokemonList(limit, offset);
  }

  async function loadPokemonDetails(name: string) {
    selectedPokemon.value = await fetchPokemonDetails(name);
  }

  async function saveFavoritePokemon(pokemon: PokemonDetails) {

  }

  async function removeFavoritePokemon(pokemon: PokemonDetails) { }

  async function loadFavoritePokemon(pokemon: PokemonDetails) { }



  return {
    pokemonList,
    selectedPokemon,
    loadPokemonList,
    loadPokemonDetails,
  };
});
