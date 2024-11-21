<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchPokemonDetails,
  fetchPokemonEvolutionChain,
  fetchPokemonSpecies,
} from '../api/pokemonApi';
import {
  EvolutionChain,
  PokemonDetails,
  PokemonSpecies,
} from '../interfaces/Pokemon';
import { usePokemonStore } from '../store/pokemon';

const route = useRoute();
const router = useRouter();
const pokemonDetail = ref<PokemonDetails>();
const pokemonEvolution = ref<EvolutionChain>();
const pokemonSpecies = ref<PokemonSpecies>();
const isFavorite = ref(false);
const previousEvolutionDetail = ref<PokemonDetails>();
const nextEvolutionDetail = ref<PokemonDetails>();

const loadData = async () => {
  pokemonDetail.value = await fetchPokemonDetails(route.params.name as string);
  pokemonSpecies.value = await fetchPokemonSpecies(route.params.name as string);
  pokemonEvolution.value = await fetchPokemonEvolutionChain(
    extractEvolutionIdFromUrl(
      pokemonSpecies.value?.evolution_chain.url as string,
    ),
  );
  isFavorite.value = usePokemonStore().isFavoritePokemon(
    pokemonDetail.value.name as string,
  );

  const previousSpecies = findPreviousEvolution(
    pokemonEvolution.value?.chain,
    route.params.name as string,
  );
  const nextSpecies = findNextEvolution(
    pokemonEvolution.value?.chain,
    route.params.name as string,
  );

  if (previousSpecies) {
    previousEvolutionDetail.value = await fetchPokemonDetails(previousSpecies);
  }
  if (nextSpecies) {
    nextEvolutionDetail.value = await fetchPokemonDetails(nextSpecies);
  }
};

// Call loadData on component mount
onMounted(loadData);

// Watch for changes in route parameter and reload data when it changes
watch(() => route.params.name, loadData);

const goToEvolution = async (direction: 'next' | 'previous') => {
  if (direction === 'next') {
    if (nextEvolutionDetail.value) {
      router.push(`/pokemondetail/${nextEvolutionDetail.value.name}`);
    }
  } else if (direction === 'previous') {
    if (previousEvolutionDetail.value) {
      router.push(`/pokemondetail/${previousEvolutionDetail.value.name}`);
    }
  }
};

// Helper functions remain the same

const findPreviousEvolution = (
  chain: any,
  currentName: string,
): string | null => {
  if (!chain) return null;

  if (chain.evolves_to.some((e: any) => e.species.name === currentName)) {
    return chain.species.name;
  }
  for (const evolution of chain.evolves_to) {
    const result = findPreviousEvolution(evolution, currentName);
    if (result) return result;
  }

  return null;
};

const findNextEvolution = (chain: any, currentName: string): string | null => {
  if (!chain) return null;
  if (chain.species.name === currentName && chain.evolves_to[0]) {
    return chain.evolves_to[0].species.name;
  }
  for (const evolution of chain.evolves_to) {
    const result = findNextEvolution(evolution, currentName);
    if (result) return result;
  }
  return null;
};

const extractEvolutionIdFromUrl = (url: string): number => {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
};
</script>

<template>
  <div class="w-full h-screen relative bg-white">
    <div
      class="w-11/12 md:w-4/5 lg:w-3/4 h-auto p-6 mx-auto mt-8 relative bg-[#3085c6] rounded-[27px] border border-[#d9d9d9]">
      <div class="flex flex-col justify-start items-start gap-4">
        <div class="w-full text-neutral-100 text-3xl md:text-5xl lg:text-7xl font-bold font-['Inter'] leading-tight">
          {{ pokemonDetail?.name }}
        </div>
        <div class="w-full md:w-96 grid grid-cols-2 gap-4">
          <div v-for="stat in pokemonDetail?.stats" :key="stat.stat.name" class="col-span-1">
            <div class="text-black text-lg md:text-2xl font-semibold font-['Inter'] leading-relaxed">
              {{ stat.stat.name }}
              <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-2" viewBox="0 0 138 7" fill="none">
                <path d="M3 4H135" stroke="#949494" stroke-width="6" stroke-linecap="round" />
                <path :d="'M3 3.97861L' + (3 + stat.base_stat) + ' 3.9998'" stroke="white" stroke-width="6"
                  stroke-linecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <img class="w-1/2 md:w-2/5 lg:w-1/3 h-auto absolute right-8 top-1/4 transform -translate-y-1/4"
    :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonDetail?.id}.svg`" />

  <div class="w-24 md:w-32 absolute left-4 md:left-8 bottom-8">
    <img class="w-16 md:w-20 h-auto mx-auto shadow"
      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${previousEvolutionDetail?.id}.svg`" />
    <div class="w-full p-3 mt-4 bg-[#185fa0] rounded-lg text-center cursor-pointer" @click="goToEvolution('previous')">
      <div class="text-neutral-100 text-base font-normal font-['Inter']">
        < </div>
      </div>
    </div>

    <div class="w-24 md:w-32 absolute right-4 md:right-8 bottom-8">
      <img class="w-16 md:w-20 h-auto mx-auto shadow"
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${nextEvolutionDetail?.id}.svg`" />
      <div class="w-full p-3 mt-4 bg-[#175ea0] rounded-lg text-center cursor-pointer" @click="goToEvolution('next')">
        <div class="text-neutral-100 text-base font-normal font-['Inter']">></div>
      </div>
    </div>
</template>
