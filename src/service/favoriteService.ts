import { supabase } from '../plugins/supabase.ts'
import type { FavouritePokemon } from '../interfaces/Pokemon.ts'
import { cookieService } from './cookieService.ts'

// Table name for favorites
const FAVORITES_TABLE = 'favorites'

export const favoriteService = {
  /**
   * Gets all favorite Pokémon for the current user (authenticated or temporary)
   */
  async getFavorites(page = 1, pageSize = 20) {
    try {
      // Get current user or use temp user ID
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const userId = user?.id || cookieService.getTempUserId()

      // Calculate pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      // Query favorites from Supabase
      const { data, error, count } = await supabase
        .from(FAVORITES_TABLE)
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      return {
        data: data as FavouritePokemon[],
        count: count || 0,
        error: null,
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      return { data: [], count: 0, error }
    }
  },

  /**
   * Adds a Pokémon to favorites
   */
  async addFavorite(pokemon: FavouritePokemon) {
    console.log('Adding favorite pokemon:', pokemon.pokemon_id)
    try {
      // Get current user or use temp user ID
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const userId = user?.id || cookieService.getTempUserId()

      // Insert into Supabase
      const { data, error } = await supabase
        .from(FAVORITES_TABLE)
        .insert([
          {
            user_id: userId,
            pokemon_id: pokemon.pokemon_id,
            name: pokemon.name,
            url: pokemon.url,
          },
        ])
        .select()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return { data: null, error }
    }
  },

  /**
   * Removes a Pokémon from favorites
   */
  async removeFavorite(name: string) {
    try {
      // Get current user or use temp user ID
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const userId = user?.id || cookieService.getTempUserId()

      // Delete from Supabase
      const { error } = await supabase
        .from(FAVORITES_TABLE)
        .delete()
        .eq('user_id', userId)
        .eq('name', name)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return { error }
    }
  },

  /**
   * Checks if a Pokémon is in favorites
   */
  async isFavorite(name: string) {
    try {
      // Get current user or use temp user ID
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const userId = user?.id || cookieService.getTempUserId()

      // Query Supabase
      const { data, error } = await supabase
        .from(FAVORITES_TABLE)
        .select('name')
        .eq('user_id', userId)
        .eq('name', name)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return { isFavorite: !!data, error: null }
    } catch (error) {
      console.error('Error checking favorite status:', error)
      return { isFavorite: false, error }
    }
  },

  /**
   * Migrates temporary user favorites to authenticated user
   */
  async migrateTempFavorites(tempUserId: string, userId: string) {
    console.log(
      'Migrating temporary user favorites to authenticated user:',
      tempUserId,
      userId
    )
    try {
      // Get all favorites for temp user
      const { data: tempFavorites, error: fetchError } = await supabase
        .from(FAVORITES_TABLE)
        .select('*')
        .eq('user_id', tempUserId)

      if (fetchError) throw fetchError
      if (!tempFavorites || tempFavorites.length === 0) return { error: null }

      // Update user_id for all temporary favorites
      const { error: updateError } = await supabase.rpc('migrate_favorites', {
        p_temp_user_id: tempUserId,
        p_user_id: userId,
      })

      if (updateError) throw updateError

      return { error: null }
    } catch (error) {
      console.error('Error migrating favorites:', error)
      return { error }
    }
  },
}
