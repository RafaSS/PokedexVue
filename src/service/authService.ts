import { supabase } from '../plugins/supabase.ts'
import { cookieService } from './cookieService.ts'

const FAVORITES_TABLE = 'favorites'

export const authService = {
  /**
   * Signs up a user with email and password
   */
  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            temp_user_id: cookieService.getTempUserId(),
          },
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Signs in a user with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Signs in a user with OAuth provider
   */
  async signInWithOAuth(provider: 'google' | 'github' | 'facebook') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            temp_user_id: cookieService.getTempUserId(),
          },
        },
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Signs out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  /**
   * Gets the current user session
   */
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  /**
   * Gets the current user
   */
  async getUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  },

  async isAuthenticated() {
    const { data, error } = await this.getSession()
    if (error) throw error
    return !!data?.session
  },

  async migrateTempFavorites(tempUserId: string, userId: string) {
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
