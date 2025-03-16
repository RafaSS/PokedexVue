<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"
      ></div>
      <h2 class="text-xl font-medium text-gray-900">
        Completing authentication...
      </h2>
      <p class="mt-2 text-sm text-gray-500">
        Please wait while we complete your login process.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '../plugins/supabase.ts'
  import { cookieService } from '../service/cookieService'

  const router = useRouter()

  onMounted(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Get the URL hash or query parameters
      const hash = window.location.hash
      const query = window.location.search

      try {
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error during auth callback:', error)
          router.push('/login?error=auth_callback_failed')
          return
        }

        // If successfully logged in and we have a user
        if (data?.session?.user) {
          // Get the temp user ID from the URL (if provided by our OAuth redirect)
          const urlParams = new URLSearchParams(query || hash.substring(1))
          const tempUserId =
            urlParams.get('temp_user_id') || cookieService.getTempUserId()

          // If we have both user ID and temp user ID, migrate favorites
          if (data.session.user.id && tempUserId) {
            try {
              // Call a function to migrate favorites from temp user to authenticated user
              // This should be implemented in your favoriteService
              await supabase.rpc('migrate_favorites', {
                p_temp_user_id: tempUserId,
                p_user_id: data.session.user.id,
              })

              // Clear the temp user ID cookie since we've migrated it
              cookieService.clearTempUserId()
            } catch (migrationError) {
              console.error('Error migrating favorites:', migrationError)
            }
          }

          // Redirect to home page or previous page
          router.push('/')
        } else {
          // No session, redirect to login
          router.push('/login')
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err)
        router.push('/login?error=unexpected_error')
      }
    }

    // Call the handler
    handleAuthCallback()
  })
</script>
