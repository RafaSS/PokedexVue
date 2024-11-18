// src/store/pokemon.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PokemonDetails } from '../interfaces/Pokemon';

export const usePokemonStore = defineStore('pokemon', () => {
  const favoritePokemon = ref<PokemonDetails[]>([]);
  const totalFavoritePokemon = ref(0);

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

  function loadFavoritePokemon(page: number, pageSize: number): void {
    const storedFavorites = localStorage.getItem('favoritePokemon');
    totalFavoritePokemon.value = storedFavorites ? JSON.parse(storedFavorites).length : 0;
    const favoritePokemonList = JSON.parse(storedFavorites || '[]');
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    favoritePokemon.value = favoritePokemonList.slice(start, end);
  }

  return {
    favoritePokemon,
    saveFavoritePokemon,
    removeFavoritePokemon,
    loadFavoritePokemon,
    isFavoritePokemon,
    totalFavoritePokemon,
  };
});
