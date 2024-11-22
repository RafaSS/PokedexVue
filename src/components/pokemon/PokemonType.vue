<template>
    <div class="flex overflow-hidden gap-2.5 justify-center items-center px-2 py-0.5 bg-opacity-80 rounded-xl" :class="typeColor" role="status" :aria-label="`Pokemon type: ${type}`">
      <span class="flex-1">{{ type }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps<{
    type: string;
  }>();
  
  const typeColor = computed(() => ({
    'bg-blue-400': props.type === 'Water',
    'bg-rose-300': props.type === 'Fairy'
  }));
  </script>