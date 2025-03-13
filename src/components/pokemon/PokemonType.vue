<template>
  <div
    class="flex overflow-hidden gap-2 justify-center items-center px-3 py-1 bg-opacity-90 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
    :class="[typeColor, textColor]"
    role="status"
    :aria-label="`Pokemon type: ${type}`"
  >
    <span v-if="typeIcon" class="type-icon" v-html="typeIcon"></span>
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

  const typeIcon = computed(() => {
    switch (props.type) {
      case 'water':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 2c-5.33 4-8 8.4-8 12a8 8 0 0 0 16 0c0-3.6-2.67-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-1.77.5-3.95 3-7 2.5 3.05 3 5.23 3 7 0 1.66-1.34 3-3 3s-3-1.34-3-3c0-.07 0-.15.01-.22.25.44.71.74 1.24.74.83 0 1.5-.67 1.5-1.5 0-.6-.35-1.11-.85-1.35.84-.38 1.38-1.22 1.38-2.15 0-.75-.35-1.42-.89-1.86.88-.57 1.47-1.55 1.47-2.66 0-.71-.28-1.35-.73-1.83.33-.04.63-.17.89-.32.22.34.41.71.57 1.08.66-.37 1.25-.73 1.75-1.09-.19-.38-.37-.76-.54-1.17C10.38 2.23 10.99 2 11.63 2c.71 0 1.37.27 1.87.73-.3.31-.57.64-.82.97.17.21.31.44.44.69.1-.2.2-.4.32-.58C14.15 4.54 15 5.63 15 7c0 1.23-.67 2.31-1.67 2.89.23.45.35.96.35 1.5 0 1.24-.67 2.33-1.67 2.91.37.74.6 1.58.6 2.47 0 3.03-2.47 5.5-5.5 5.5s-5.5-2.47-5.5-5.5c0-2.76 2.09-5.37 5.25-8.13C8.17 10.23 9 11.63 9 13c0 1.66-1.34 3-3 3z"/></svg>'
      case 'fire':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 23c-4.41 0-8-3.59-8-8 0-2.52 1.17-4.41 2.67-6.19.42-.1.83.14.83.59 0 .26-.15.52-.37.7-.65.51-1.38 1.47-1.38 2.62 0 1.68 1.31 3.09 3 3.28.91.1 1.73-.29 2.28-1.04.55-.75.72-1.73.45-2.62-.27-.89-.91-1.59-1.76-1.9-1.27-.47-2.14-1.7-2.14-3.17 0-3.09 2.11-5.32 4.88-5.32 2.77 0 4.88 2.23 4.88 5.32 0 1.47-.87 2.7-2.14 3.17-1.16.43-1.95 1.61-1.95 2.9 0 1.73 1.41 3.14 3.14 3.14.62 0 1.19-.21 1.64-.57.22-.18.37-.44.37-.7 0-.45.42-.69.83-.59 1.5 1.78 2.67 3.67 2.67 6.19 0 4.41-3.59 8-8 8zm0-17c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm3-3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1z"/></svg>'
      case 'grass':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 22c-4.97 0-9-4.03-9-9 0-4.63 3.5-8.44 8-8.94V2.06C6.49 2.52 3 6.48 3 11c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.23-.82-4.27-2.16-5.84l-1.42 1.42C18.72 7.92 19 9.42 19 11c0 3.86-3.14 7-7 7zm-1.5-2.5h2.5v-2.5H15c-.55 0-1-.45-1-1s.45-1 1-1h3c.55 0 1 .45 1 1V19c0 .55-.45 1-1 1h-6.5c-.55 0-1-.45-1-1s.45-1 1-1zm7-9.5c.55 0 1 .45 1 1v3c0 .55-.45 1-1 1s-1-.45-1-1V12h-1.5v2.5c0 .55-.45 1-1 1s-1-.45-1-1v-3c0-.55.45-1 1-1H15c.55 0 1 .45 1 1V13h1v-1.5c0-.55.45-1 1-1zm-6-1c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1h3c0-.55.45-1 1-1s1 .45 1 1v1zm-3-5c0-.55.45-1 1-1h2.5c.55 0 1 .45 1 1s-.45 1-1 1H9.5v1.5c0 .55-.45 1-1 1s-1-.45-1-1V4z"/></svg>'
      case 'electric':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.88 0 .33.75.31.78-1.28 2.28-3.22 5.68-5.81 10.22z"/></svg>'
      case 'psychic':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.48.41-2.86 1.12-4.06.24.14.49.26.76.36.17.07.31.21.36.39.08.32.1.65.1.98 0 2.08 1.6 3.82 3.66 3.96 2.06.14 3.98-1.32 4.32-3.35.34-2.03-.88-4-2.82-4.53-.34-.09-.69-.11-1.03-.07-.08.01-.16.03-.24.05-.72.15-1.35.56-1.73 1.21-.38.65-.39 1.41-.03 2.05.36.65 1.01 1.09 1.73 1.21.78.16 1.58-.02 2.12-.55.55-.53.79-1.31.67-2.07-.12-.76-.58-1.38-1.28-1.67v-.01c-.06-.02-.12-.05-.18-.07.18-.13.38-.26.58-.38.2-.12.41-.23.62-.33 1.06 1.27 1.68 2.89 1.68 4.61 0 4.4-3.58 7.96-8 7.96z"/></svg>'
      case 'bug':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M12 3c-4.42 0-8 3.58-8 8 0 2.03.76 3.87 2 5.28V19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-2.72c1.24-1.41 2-3.25 2-5.28 0-4.42-3.58-8-8-8zm0 14.5c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm-6 0c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm6.05 3.21l-1.09 1.09c-.82.82-2.15.82-2.97 0l-1.09-1.09c-.29-.29-.77-.29-1.06 0-.29.29-.29.77 0 1.06l1.09 1.09c.7.7 1.62 1.05 2.54 1.05s1.84-.35 2.54-1.05l1.09-1.09c.29-.29.29-.77 0-1.06-.29-.29-.76-.29-1.05 0z"/></svg>'
      case 'flying':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M22 16v-2l-8.5-5V3.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5V9L2 14v2l8.5-2.5V19L8 20.5V22l4-1 4 1v-1.5L13.5 19v-5.5L22 16z"/></svg>'
      case 'dragon':
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4"><path d="M16.85 19.85L12 15l-4.85 4.85-1.41-1.41 4.85-4.85L8.5 11.5c-.29-.29-.29-.77 0-1.06.29-.29.77-.29 1.06 0l1.44 1.44 1.75-1.75-1.85-1.85c-.29-.29-.29-.77 0-1.06.29-.29.77-.29 1.06 0l1.41 1.41 1.41-1.41c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-1.85 1.85 1.75 1.75L16.2 10.5c.29-.29.77-.29 1.06 0 .29.29.29.77 0 1.06l-2.1 2.1 4.85 4.85-1.16 1.34z"/></svg>'
      default:
        return '' // Return empty for types without icons
    }
  })
</script>

<style scoped>
  .type-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    animation: pulse 2s infinite ease-in-out;
  }

  @keyframes pulse {
    0% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.7;
    }
  }

  div:hover .type-icon {
    animation: wiggle 0.5s ease-in-out;
  }

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
