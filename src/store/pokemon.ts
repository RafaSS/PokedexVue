import { defineStore } from 'pinia';
import type { FavouritePokemon } from '../interfaces/Pokemon';

export const usePokemonStore = defineStore('pokemonStore', {
  state: () => ({
    favoritePokemon: [] as FavouritePokemon[], // List of favorite Pokémon
    currentPage: 1,
    itemsPerPage: 10,
    totalFavoritePokemon: localStorage.getItem('favoritePokemon') ? JSON.parse(localStorage.getItem('favoritePokemon') || '[]').length : 0,
  }),
  getters: {
    paginatedFavoritePokemon(state) {
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const end = start + state.itemsPerPage;
      return state.favoritePokemon.slice(start, end);
    },
    totalPages(state) {
      return Math.ceil(state.favoritePokemon.length / state.itemsPerPage);
    },
  },
  actions: {
    saveFavoritePokemon(pokemon: FavouritePokemon) {
      const storedFavorites = localStorage.getItem('favoritePokemon');
      const favoritePokemonList = storedFavorites ? JSON.parse(storedFavorites) : [];
      favoritePokemonList.push(pokemon);
      localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemonList));
      this.favoritePokemon = favoritePokemonList;
      this.totalFavoritePokemon = favoritePokemonList.length;
    },
    removeFavoritePokemon(name: string) {
      const storedFavorites = localStorage.getItem('favoritePokemon');
      if (storedFavorites) {
        const favoritePokemonList = JSON.parse(storedFavorites).filter((pokemon: FavouritePokemon) => pokemon.name !== name);
        localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemonList));
        this.favoritePokemon = favoritePokemonList;
        this.totalFavoritePokemon = favoritePokemonList.length;
      }
    },
    isFavoritePokemon(name: string): boolean {
      const storedFavorites = localStorage.getItem('favoritePokemon');
      if (storedFavorites) {
        const favoritePokemonList = JSON.parse(storedFavorites);
        return favoritePokemonList.some((pokemon: FavouritePokemon) => pokemon.name === name);
      }
      return false;
    },
    loadFavoritePokemon(page: number, pageSize: number) {
      const storedFavorites = localStorage.getItem('favoritePokemon');
      this.totalFavoritePokemon = storedFavorites ? JSON.parse(storedFavorites).length : 0;
      const favoritePokemonList = JSON.parse(storedFavorites || '[]');
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      this.favoritePokemon = favoritePokemonList.slice(start, end);
    },
    changePage(page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.loadFavoritePokemon(page, this.itemsPerPage);
      }
    }
  }
});
