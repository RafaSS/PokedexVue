import { defineStore } from 'pinia'
import type { FavouritePokemon } from '../interfaces/Pokemon'
import { favoriteService } from '../service/favoriteService'

export const usePokemonStore = defineStore('pokemonStore', {
  state: () => ({
    favoritePokemon: [] as FavouritePokemon[],
    totalFavoritePokemon: 0,
    loading: false,
    error: null as Error | null,
  }),
  getters: {},
  actions: {
    async saveFavoritePokemon(pokemon: FavouritePokemon) {
      try {
        this.loading = true
        this.error = null
        const { error } = await favoriteService.addFavorite(pokemon)
        if (error) throw error
        this.favoritePokemon.push(pokemon)
        this.totalFavoritePokemon++
      } catch (error) {
        this.error = error as Error
        console.error('Failed to save favorite pokemon:', error)
      } finally {
        this.loading = false
      }
    },
    async removeFavoritePokemon(name: string) {
      try {
        this.loading = true
        this.error = null
        const { error } = await favoriteService.removeFavorite(name)
        if (error) throw error
        this.favoritePokemon = this.favoritePokemon.filter(
          (pokemon: FavouritePokemon) => pokemon.name !== name
        )
        this.totalFavoritePokemon--
      } catch (error) {
        this.error = error as Error
        console.error('Failed to remove favorite pokemon:', error)
      } finally {
        this.loading = false
      }
    },
    async isFavoritePokemon(name: string): Promise<boolean> {
      try {
        this.error = null
        const { isFavorite, error } = await favoriteService.isFavorite(name)
        if (error) throw error
        return isFavorite
      } catch (error) {
        this.error = error as Error
        console.error('Failed to check favorite status:', error)
        return false
      }
    },
    async loadFavoritePokemon(page: number, pageSize: number) {
      try {
        this.loading = true
        this.error = null
        const { data, count, error } = await favoriteService.getFavorites(
          page,
          pageSize
        )
        if (error) throw error
        this.favoritePokemon = data
        this.totalFavoritePokemon = count
      } catch (error) {
        this.error = error as Error
        console.error('Failed to load favorite pokemon:', error)
      } finally {
        this.loading = false
      }
    },
  },
})
