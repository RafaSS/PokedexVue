// src/store/pokemon.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchPokemonList, fetchPokemonDetails } from '../api/pokemonApi';
import type { PokemonDetails, PokemonList } from '../interfaces/Pokemon';

export const usePokemonStore = defineStore('pokemon', () => {
  const pokemonList = ref<PokemonList | null>(null);
  const selectedPokemon = ref<PokemonDetails | null>(null);
  const favoritePokemon = ref<PokemonDetails[]>([]);

  async function loadPokemonList(limit = 10, offset = 0) {
    pokemonList.value = await fetchPokemonList(limit, offset);
  }

  async function loadPokemonDetails(name: string) {
    selectedPokemon.value = await fetchPokemonDetails(name);
  }

  function saveFavoritePokemon(pokemon: PokemonDetails) {
    const storedFavorites = localStorage.getItem('favoritePokemon');
    const favoritePokemonList = storedFavorites ? JSON.parse(storedFavorites) : [];
    favoritePokemonList.push(pokemon);
    localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemonList));
    favoritePokemon.value = favoritePokemonList;
  }

  function removeFavoritePokemon(name: string) {
    const storedFavorites = localStorage.getItem('favoritePokemon');
    if (storedFavorites) {
      const favoritePokemonList = JSON.parse(storedFavorites).filter((pokemon: PokemonDetails) => pokemon.name !== name);
      localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemonList));
      favoritePokemon.value = favoritePokemonList;
    }
  }

  function isFavoritePokemon(name: string): boolean {
    const storedFavorites = localStorage.getItem('favoritePokemon');
    if (storedFavorites) {
      const favoritePokemonList = JSON.parse(storedFavorites);
      return favoritePokemonList.some((pokemon: PokemonDetails) => pokemon.name === name);
    }
    return false;
  }

  function loadFavoritePokemon(): void {
    const storedFavorites = localStorage.getItem('favoritePokemon');
    favoritePokemon.value =  JSON.parse(storedFavorites || '[]');
  }

  return {
    pokemonList,
    selectedPokemon,
    favoritePokemon,
    loadPokemonList,
    loadPokemonDetails,
    saveFavoritePokemon,
    removeFavoritePokemon,
    loadFavoritePokemon,
    isFavoritePokemon,
  };
});
