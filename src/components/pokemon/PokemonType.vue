<template>
  <div
    class="flex overflow-hidden gap-2 justify-center items-center px-3 py-1 bg-opacity-90 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    :class="[typeColor, textColor]"
    role="status"
    :aria-label="`Pokemon type: ${type}`"
  >
    <span
      v-if="typeEmoji"
      class="flex items-center justify-center mr-1 animate-pulse hover:animate-[wiggle_0.5s_ease-in-out] type-icon"
    >
      {{ typeEmoji }}
    </span>
    <span class="flex-1 font-bold capitalize text-sm">{{ type }}</span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    type: string
  }>()

  const typeColor = computed(() => {
    switch (props.type) {
      case 'water':
        return 'bg-gradient-to-br from-blue-400 to-blue-600'
      case 'fairy':
        return 'bg-gradient-to-br from-pink-300 to-pink-500'
      case 'fire':
        return 'bg-gradient-to-br from-red-500 to-red-700'
      case 'grass':
        return 'bg-gradient-to-br from-green-400 to-green-600'
      case 'electric':
        return 'bg-gradient-to-br from-yellow-300 to-yellow-500'
      case 'ice':
        return 'bg-gradient-to-br from-blue-200 to-blue-400'
      case 'fighting':
        return 'bg-gradient-to-br from-red-700 to-red-900'
      case 'poison':
        return 'bg-gradient-to-br from-purple-400 to-purple-600'
      case 'ground':
        return 'bg-gradient-to-br from-yellow-700 to-yellow-900'
      case 'flying':
        return 'bg-gradient-to-br from-indigo-300 to-indigo-500'
      case 'psychic':
        return 'bg-gradient-to-br from-pink-400 to-pink-600'
      case 'bug':
        return 'bg-gradient-to-br from-green-600 to-green-800'
      case 'rock':
        return 'bg-gradient-to-br from-gray-500 to-gray-700'
      case 'ghost':
        return 'bg-gradient-to-br from-purple-700 to-purple-900'
      case 'dragon':
        return 'bg-gradient-to-br from-indigo-700 to-indigo-900'
      case 'dark':
        return 'bg-gradient-to-br from-gray-800 to-gray-950'
      case 'steel':
        return 'bg-gradient-to-br from-gray-400 to-gray-600'
      case 'normal':
        return 'bg-gradient-to-br from-gray-300 to-gray-500'
      default:
        return 'bg-gradient-to-br from-gray-200 to-gray-400'
    }
  })

  const textColor = computed(() => {
    const darkTypes = ['normal', 'electric', 'ice', 'fairy']
    return darkTypes.includes(props.type) ? 'text-gray-800' : 'text-white'
  })

  const typeEmoji = computed(() => {
    switch (props.type) {
      case 'water':
        return '💧'
      case 'fire':
        return '🔥'
      case 'grass':
        return '🌿'
      case 'electric':
        return '⚡'
      case 'ice':
        return '❄️'
      case 'fighting':
        return '👊'
      case 'poison':
        return '☠️'
      case 'ground':
        return '🌍'
      case 'flying':
        return '🦅'
      case 'psychic':
        return '🔮'
      case 'bug':
        return '🐛'
      case 'rock':
        return '🪨'
      case 'ghost':
        return '👻'
      case 'dragon':
        return '🐉'
      case 'dark':
        return '🌑'
      case 'steel':
        return '⚙️'
      case 'fairy':
        return '✨'
      case 'normal':
        return '⭐'
      default:
        return ''
    }
  })
</script>

<style>
  @keyframes wiggle {
    0% {
      transform: rotate(0deg);
    }
    25% {
      transform: rotate(-5deg);
    }
    50% {
      transform: rotate(0deg);
    }
    75% {
      transform: rotate(5deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>
