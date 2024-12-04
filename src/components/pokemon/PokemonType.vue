<template>
  <div
    class="flex overflow-hidden gap-2.5 justify-center items-center px-2 py-0.5 bg-opacity-90 rounded-xl"
    :class="[typeColor, textColor]"
    role="status"
    :aria-label="`Pokemon type: ${type}`"
  >
    <span class="flex-1 font-bold capitalize">{{ type }}</span>
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
        return 'bg-blue-500'
      case 'fairy':
        return 'bg-pink-400'
      case 'fire':
        return 'bg-red-600'
      case 'grass':
        return 'bg-green-500'
      case 'electric':
        return 'bg-yellow-400'
      case 'ice':
        return 'bg-blue-300'
      case 'fighting':
        return 'bg-red-800'
      case 'poison':
        return 'bg-purple-500'
      case 'ground':
        return 'bg-yellow-800'
      case 'flying':
        return 'bg-indigo-400'
      case 'psychic':
        return 'bg-pink-500'
      case 'bug':
        return 'bg-green-700'
      case 'rock':
        return 'bg-gray-600'
      case 'ghost':
        return 'bg-purple-800'
      case 'dragon':
        return 'bg-indigo-800'
      case 'dark':
        return 'bg-gray-900'
      case 'steel':
        return 'bg-gray-500'
      case 'normal':
        return 'bg-gray-400'
      default:
        return 'bg-gray-300'
    }
  })

  const textColor = computed(() => {
    switch (props.type) {
      case 'water':
      case 'fairy':
      case 'grass':
      case 'electric':
      case 'ice':
      case 'flying':
      case 'psychic':
      case 'bug':
      case 'dragon':
      case 'normal':
        return 'text-white'
      case 'fire':
      case 'fighting':
      case 'poison':
      case 'ground':
      case 'rock':
      case 'ghost':
      case 'dark':
      case 'steel':
        return 'text-white'
      default:
        return 'text-black'
    }
  })
</script>
