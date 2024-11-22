<script setup lang="ts">
import { EvolutionChain, PokemonDetails } from '@/interfaces/Pokemon';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps<{
  previous: PokemonDetails | '';
  next: PokemonDetails | '';
  other: string[];
}>();

defineEmits<{
  (e: 'navigate', direction: 'previous' | 'next'): void;
}>();
</script>

<template>
  <div class="flex justify-between items-center w-full">
    <button v-if="previous" @click="router.push(`/pokemondetail/${previous.name}`)" class="flex flex-col items-center"
      :aria-label="previous ? `Go to ${previous.name}` : 'Go to previous'">
      <img v-if="previous" :src="previous.sprites?.other['official-artwork'].front_default"
        class="object-contain aspect-[1.11] w-[90px]" />
      <div
        class="overflow-hidden flex-1 shrink gap-2 px-3 mt-5 bg-sky-700 h-[60px] min-h-[60px] rounded-[100px] w-[60px] text-white text-3xl font-bold">
        &lt;-</div>
    </button>

    <button v-else class="flex flex-col items-center" aria-label="Previous evolution">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/6d68e11debc844a1ade269bfeb7cc3c0/1aa5f61aa7172c587cc8d8c12cddf81a213ce9ea26d9990faeb6151aca9c6fe6?apiKey=6d68e11debc844a1ade269bfeb7cc3c0&"
        class="object-contain aspect-[1.11] w-[90px]" />
      <div
        class="overflow-hidden flex-1 shrink gap-2 px-3 mt-5 bg-sky-700 h-[60px] min-h-[60px] rounded-[100px] w-[60px] text-white text-3xl font-bold">
        &lt;-</div>
    </button>

    <div class="flex gap-1 items-center" role="navigation" aria-label="Evolution chain">
      <button class="overflow-hidden px-1 py-1.5 rounded-lg bg-neutral-100"
        aria-label="Previous evolution">&lt;-</button>
      <img v-for="(other, index) in other" :key="index" :src="other" :alt="'asd'"
        class="object-contain w-10 rounded-full aspect-square" />
      <button class="overflow-hidden px-1 py-1.5 rounded-lg bg-neutral-100" aria-label="Next evolution">-&gt;</button>
    </div>

    <button v-if="next" @click="router.push(`/pokemondetail/${next.name}`)" class="flex flex-col items-center"
      :aria-label="`Go to ${(next as PokemonDetails).name}`">
      <img :src="next.sprites?.other['official-artwork'].front_default"
        class="object-contain aspect-[0.98] w-[114px]" />
      <div
        class="overflow-hidden flex-1 shrink gap-2 px-3 bg-sky-700 h-[60px] min-h-[60px] rounded-[100px] w-[60px] text-white text-3xl font-bold">
        -&gt;</div>
    </button>

    <button v-else class="flex flex-col items-center" aria-label="Next evolution">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/6d68e11debc844a1ade269bfeb7cc3c0/1aa5f61aa7172c587cc8d8c12cddf81a213ce9ea26d9990faeb6151aca9c6fe6?apiKey=6d68e11debc844a1ade269bfeb7cc3c0&"
        class="object-contain aspect-[0.98] w-[114px]" />
      <div
        class="overflow-hidden flex-1 shrink gap-2 px-3 bg-sky-700 h-[60px] min-h-[60px] rounded-[100px] w-[60px] text-white text-3xl font-bold">
        -&gt;</div>
    </button>
  </div>
</template>
