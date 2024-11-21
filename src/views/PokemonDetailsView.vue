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
  <div class="Frame3 w-[1920px] h-[1080px] relative bg-white">
    <div
      class="Card w-[1678px] h-[547px] p-6 left-[142px] top-[102px] absolute bg-[#3085c6] rounded-[27px] border border-[#d9d9d9] justify-start items-start gap-6 inline-flex">
      <div class="Body grow shrink basis-0 h-[374px] flex-col justify-start items-start gap-4 inline-flex">
        <div class="Marill self-stretch text-neutral-100 text-7xl font-bold font-['Inter'] leading-[86.40px]">
          {{ pokemonDetail?.name }}
        </div>
        <div class="Frame2 w-96 grid grid-cols-2 gap-4">
          <div v-for="stat in pokemonDetail?.stats" :key="stat.stat.name" class="col-span-1">
            <div class="Hp left-0 top-0 text-black text-2xl font-semibold font-['Inter'] leading-[28.80px]">
              {{ stat.stat.name }}
              <svg xmlns="http://www.w3.org/2000/svg" width="138" height="7" viewBox="0 0 138 7" fill="none">
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

  <img class="Marill w-[1006px] h-[795px] left-[600px] top-[200px] absolute "
    :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonDetail?.id}.svg`" />

  <div class="Group1 w-[132px] h-[153px] left-[142px] top-[784px] absolute">
    <img class="Image1 w-[90px] h-[81px] left-[21px] top-0 absolute shadow"
      :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${previousEvolutionDetail?.id}.svg`" />
    <div
      class="Button w-[132px] h-[52.47px] p-3 left-0 top-[100.53px] absolute bg-[#185fa0] rounded-lg justify-center items-center gap-2 inline-flex"
      @click="goToEvolution('previous')">
      <div class="Button text-neutral-100 text-base font-normal font-['Inter'] leading-none">
        < </div>
      </div>
    </div>
    <div class="Group2 w-[134px] h-[170px] left-[1686px] top-[767px] absolute">
      <img class="1 w-[114px] h-[116px] left-[3px] top-0 absolute shadow"
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${nextEvolutionDetail?.id}.svg`" />
      <div
        class="Button w-[134px] h-[51px] p-3 left-0 top-[119px] absolute bg-[#175ea0] rounded-lg justify-center items-center gap-2 inline-flex"
        @click="goToEvolution('next')">
        <div class="Button text-neutral-100 text-base font-normal font-['Inter'] leading-none">></div>
      </div>
    </div>
</template>
