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
    // Save the favorite pokemon to the local storage
    const favoritePokemon = localStorage.getItem('favoritePokemon');
    if (favoritePokemon) {
      const favoritePokemonList = JSON.parse(favoritePokemon);
      favoritePokemonList.push(pokemon);
      localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemonList));
    } else {
      localStorage.setItem('favoritePokemon', JSON.stringify([pokemon]));
    }
  }

  async function removeFavoritePokemon(name: string) {
    const favoritePokemon = localStorage.getItem('favoritePokemon');
    if (favoritePokemon) {
      const favoritePokemonList = JSON.parse(favoritePokemon);
      const newFavoritePokemonList = favoritePokemonList.filter((pokemon: PokemonDetails) => pokemon.name !== name);
      localStorage.setItem('favoritePokemon', JSON.stringify(newFavoritePokemonList));
    }
  }

  async function isFavoritePokemon(name: string) {
    const favoritePokemon = localStorage.getItem('favoritePokemon');
    if (favoritePokemon) {
      const favoritePokemonList = JSON.parse(favoritePokemon);
      return favoritePokemonList.some((pokemon: PokemonDetails) => pokemon.name === name);
    } else {
      return false;
    }
  }

  async function loadFavoritePokemon() {
    const favoritePokemon = localStorage.getItem('favoritePokemon');
    if (favoritePokemon) {
      const favoritePokemonList = JSON.parse(favoritePokemon);
      return favoritePokemonList;
    } else {
      return [];
    }
  }



  return {
    pokemonList,
    selectedPokemon,
    loadPokemonList,
    loadPokemonDetails,
    saveFavoritePokemon,
    removeFavoritePokemon,
    loadFavoritePokemon,
    isFavoritePokemon,
  };
});

