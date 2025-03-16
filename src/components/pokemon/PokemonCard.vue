<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { usePokemonStore } from '../../store/pokemon'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps<{
    pokemon: any
    showFavoriteButton?: boolean
    showId?: boolean
  }>()

  const router = useRouter()
  const pokemonStore = usePokemonStore()

  onMounted(() => {
    if (pokemonStore.favoritePokemon.length === 0) {
      const storedFavorites = localStorage.getItem('favoritePokemon')
      if (storedFavorites) {
        pokemonStore.favoritePokemon = JSON.parse(storedFavorites)
      }
    }
  })

  const isFavorite = computed(() => {
    return pokemonStore.favoritePokemon.some(
      (pokemon) => pokemon.name === props.pokemon.name
    )
  })

  const pokemonId = computed(() => {
    if ('id' in props.pokemon && props.pokemon.id) {
      return props.pokemon.id.toString()
    }
    if ('url' in props.pokemon && props.pokemon.url) {
      return getPokemonIdFromUrl(props.pokemon.url)
    }
    return ''
  })

  const imageUrl = computed(() => {
    if ('sprite' in props.pokemon && props.pokemon.sprite) {
      return props.pokemon.sprite
    }
    return getPokemonImageUrl(pokemonId.value)
  })

  function getPokemonIdFromUrl(url: string): string {
    const match = url.match(/\/(\d+)\/$/)
    return match ? match[1] : ''
  }

  function getPokemonImageUrl(id: string): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  }

  function goToDetail() {
    router.push(`/pokemondetail/${props.pokemon.name}`)
  }

  function toggleFavorite() {
    const id =
      'url' in props.pokemon
        ? parseInt(getPokemonIdFromUrl(props.pokemon.url))
        : props.pokemon.id || parseInt(pokemonId.value)

    if (isFavorite.value) {
      pokemonStore.removeFavoritePokemon(props.pokemon.name)
    } else {
      console.log('Saving favorite pokemon:', {
        pokemon_id: id,
        name: props.pokemon.name,
        url: `pokemon/${props.pokemon.name}`,
      })
      pokemonStore.saveFavoritePokemon({
        pokemon_id: id,
        name: props.pokemon.name,
        url: `pokemon/${props.pokemon.name}`,
      })
    }
  }
</script>

<template>
  <div
    class="bg-red-500 rounded-xl overflow-hidden shadow-md cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative"
  >
    <div
      v-if="showFavoriteButton"
      class="absolute top-2 right-2 z-10"
      @click.stop="toggleFavorite"
    >
      <img
        v-if="isFavorite"
        src="../../assets/newStar.svg"
        :alt="t('pokemon.removeFavorite')"
        class="w-6 h-6 transition-transform duration-200 hover:scale-125"
      />
      <img
        v-else
        src="../../assets/newStarDisabled.svg"
        :alt="t('pokemon.addFavorite')"
        class="w-6 h-6 transition-transform duration-200 hover:scale-125"
      />
    </div>
    <div
      class="bg-gradient-radial from-white/30 to-black/10 p-4 flex justify-center items-center h-30"
      @click="goToDetail"
    >
      <img
        :src="imageUrl"
        :alt="pokemon.name"
        class="w-20 h-20 object-contain transition-transform duration-300 filter drop-shadow-md hover:scale-110"
        loading="lazy"
      />
    </div>
    <div class="bg-white p-3 relative" @click="goToDetail">
      <span
        v-if="showId"
        class="absolute -top-5 right-2.5 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-bold"
      >
        #{{ pokemonId }}
      </span>
      <h3
        class="capitalize font-semibold text-base text-gray-900 text-center m-0"
      >
        {{ pokemon.name }}
      </h3>
    </div>
  </div>
</template>
