<script setup lang="ts">
import { ref, computed } from 'vue';
import { PokemonDetails } from '@/interfaces/Pokemon';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
  previous: PokemonDetails | '';
  next: PokemonDetails | '';
  other: string[];
}>();

defineEmits<{
  (e: 'navigate', direction: 'previous' | 'next'): void;
}>();

const currentIndex = ref(0);

const nextImage = () => {
  if (currentIndex.value < props.other.length - 3) {
    currentIndex.value += 3;
  } else {
    currentIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 3;
  } else {
    currentIndex.value = Math.max(0, props.other.length - 3);
  }
};

const visibleImages = computed(() => {
  return props.other.slice(currentIndex.value, currentIndex.value + 3);
});
</script>

<template>
  <div class="flex flex-col items-center w-full">
    <div class="flex justify-between items-center w-full">
      <button v-if="previous" @click="router.push(`/pokemondetail/${previous.name}`)" class="flex flex-col items-center"
        :aria-label="previous ? `Go to ${previous.name}` : 'Go to previous'">
        <img v-if="previous" :src="previous.sprites?.other['official-artwork'].front_default"
          class="object-contain aspect-[1.11] w-[90px]" />
        <div
          class="overflow-hidden flex-1 shrink gap-2 px-4 py-2 mt-5 bg-sky-700 h-auto min-h-[60px] rounded-full w-auto min-w-[60px] text-white text-3xl font-bold">
          &lt;
        </div>
      </button>

      <button v-else class="flex flex-col items-center" aria-label="Previous evolution">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/6d68e11debc844a1ade269bfeb7cc3c0/1aa5f61aa7172c587cc8d8c12cddf81a213ce9ea26d9990faeb6151aca9c6fe6?apiKey=6d68e11debc844a1ade269bfeb7cc3c0&"
          class="object-contain aspect-[1.11] w-[90px]" />
        <div
          class="overflow-hidden flex-1 shrink gap-2 px-4 py-2 mt-5 bg-sky-700 h-[60px] min-h-[60px] rounded-full w-[60px] text-white text-3xl font-bold">
          &lt;
        </div>
      </button>
      <div class="col">
        <div class=" text-lg font-bold">Alternative Images</div>
        <div class="flex gap-1 items-center" role="navigation" aria-label="Alternative Carousel">
          <button @click="prevImage" class="overflow-hidden px-1 py-1.5 rounded-lg bg-red-500"
            aria-label="Previous Alternative">&lt;</button>
          <div class="flex gap-1">
            <img v-for="(image, index) in visibleImages" :key="index" :src="image" alt="Alternative Image"
              class="object-contain w-10 rounded-full aspect-square" />
          </div>
          <button @click="nextImage" class="overflow-hidden px-1 py-1.5 rounded-lg bg-red-500"
            aria-label="Next Alternative">&gt;</button>
        </div>
      </div>

      <button v-if="next" @click="router.push(`/pokemondetail/${next.name}`)" class="flex flex-col items-center"
        :aria-label="`Go to ${(next as PokemonDetails).name}`">
        <img :src="next.sprites?.other['official-artwork'].front_default"
          class="object-contain aspect-[0.98] w-[114px]" />
        <div
          class="overflow-hidden flex-1  gap-2 px-4 py-2 bg-sky-700 h-[60px] min-h-[60px] rounded-full w-[60px] text-white text-3xl font-bold">
          <p>&gt;</p>
        </div>
      </button>

      <button v-else class="flex flex-col items-center" aria-label="Next evolution">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/6d68e11debc844a1ade269bfeb7cc3c0/1aa5f61aa7172c587cc8d8c12cddf81a213ce9ea26d9990faeb6151aca9c6fe6?apiKey=6d68e11debc844a1ade269bfeb7cc3c0&"
          class="object-contain aspect-[0.98] w-[114px]" />
        <div
          class="overflow-hidden flex-1 shrink gap-2 px-4 py-2 bg-sky-700 h-[60px] min-h-[60px] rounded-full w-[60px] text-white text-3xl font-bold">
          &gt;
        </div>
      </button>
    </div>
  </div>
</template>
