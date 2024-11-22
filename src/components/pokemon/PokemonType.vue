<template>
    <div class="flex overflow-hidden gap-2.5 justify-center items-center px-2 py-0.5 bg-opacity-80 rounded-xl" :class="typeColor" role="status" :aria-label="`Pokemon type: ${type}`">
        <span class="flex-1 font-bold capitalize">{{ type }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    type: string;
}>();

const typeColor = computed(() => {
    switch (props.type) {
        case 'water':
            return 'bg-blue-400';
        case 'fairy':
            return 'bg-rose-300';
        case 'fire':
            return 'bg-red-500';
        case 'grass':
            return 'bg-green-400';
        case 'electric':
            return 'bg-yellow-300';
        case 'ice':
            return 'bg-blue-200';
        case 'fighting':
            return 'bg-red-700';
        case 'poison':
            return 'bg-purple-400';
        case 'ground':
            return 'bg-yellow-700';
        case 'flying':
            return 'bg-indigo-300';
        case 'psychic':
            return 'bg-pink-400';
        case 'bug':
            return 'bg-green-600';
        case 'rock':
            return 'bg-gray-500';
        case 'ghost':
            return 'bg-purple-700';
        case 'dragon':
            return 'bg-indigo-700';
        case 'dark':
            return 'bg-gray-800';
        case 'steel':
            return 'bg-gray-400';
        case 'normal':
            return 'bg-gray-300';
        default:
            return 'bg-gray-200';
    }
});
</script>