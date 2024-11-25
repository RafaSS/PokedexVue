<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  fetchPokemonDetails,
  fetchPokemonEvolutionChain,
  fetchPokemonSpecies,
} from '../api/pokemonApi';

import PokemonStat from '../components/pokemon/PokemonStat.vue';
import PokemonType from '../components/pokemon/PokemonType.vue';
import PokemonNavigation from '../components/pokemon/PokemonNavigation.vue';

import {
  EvolutionChain,
  PokemonDetails,
  PokemonSpecies,
} from '../interfaces/Pokemon';
import { usePokemonStore } from '../store/pokemon';

const route = useRoute();
const pokemonDetail = ref<PokemonDetails>();
const otherArtWork = ref<string[]>([]);
const pokemonEvolution = ref<EvolutionChain>();
const pokemonSpecies = ref<PokemonSpecies>();
const isFavorite = ref(false);
const previousEvolutionDetail = ref<PokemonDetails>();
const nextEvolutionDetail = ref<PokemonDetails>();

const loadData = async () => {
  pokemonDetail.value = await fetchPokemonDetails(route.params.name as string);
  pokemonSpecies.value = await fetchPokemonSpecies(route.params.name as string);
  otherArtWork.value = await getAltArtWork(pokemonDetail.value as PokemonDetails);
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

onMounted(loadData);
watch(() => route.params.name, loadData);

const getAltArtWork = async (pokemon: PokemonDetails) => {
  const otherArtWork: string[] = [];
  if (!pokemon?.sprites?.other) return otherArtWork;
  for (const key in pokemon?.sprites?.other) {
    if (key !== 'official-artwork') {
      const artwork = pokemon.sprites.other[key as keyof typeof pokemon.sprites.other];
      otherArtWork.push(artwork.front_default);
    }
  }
  return otherArtWork;
};

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

const toggleFavorite = () => {
  const store = usePokemonStore();
  if (isFavorite.value) {
    store.removeFavoritePokemon(pokemonDetail.value?.name as string);
  } else {
    store.saveFavoritePokemon({name: pokemonDetail.value?.name as string, url: 'pokemon/' + pokemonDetail.value?.name});
  }
  isFavorite.value = !isFavorite.value;
};
</script>

<template>
  <article class="flex overflow-hidden flex-col self-center px-20 py-8 bg-red-500 rounded-3xl max-md:px-5"
    role="article" aria-labelledby="pokemon-name">
    <section class="relative flex flex-col pt-3 pr-4 pb-0.5 pl-16 w-full bg-sky-600 rounded-3xl max-md:pl-5 max-md:max-w-full"
      aria-label="Pokemon Information">
      <div class="absolute top-4 right-4 cursor-pointer" @click="toggleFavorite">
        <img v-if="isFavorite" src="../assets/star.svg" alt="Remove from Favorites" class="w-8 h-8" />
        <img v-else src="../assets/starDisabled.svg" alt="Add to Favorites" class="w-8 h-8" />
      </div>
      <div class="flex flex-col max-md:max-w-full">
        <div class="flex gap-5 max-md:flex-col">
          <div class="flex flex-col w-[43%] max-md:ml-0 max-md:w-full">
            <div class="flex flex-col mt-1 w-full max-md:mt-4">
              <h1 id="pokemon-name"
                class="self-center ml-4 w-auto tracking-tighter leading-tight text-5xl text-center text-white max-md:ml-2.5 max-md:text-4xl">
                {{ pokemonDetail?.name }}
              </h1>
              <div class="flex flex-wrap gap-12 items-start mt-5 min-h-[239px]">
                <PokemonStat v-for="(stat, index) in pokemonDetail?.stats" :key="index" :label="stat.stat.name"
                  :value="stat.base_stat" />
              </div>
            </div>
          </div>
          <div class="flex flex-col ml-5 w-[57%] max-md:ml-0 max-md:w-full">
            <img :src="pokemonDetail?.sprites?.other['official-artwork'].front_default"
              :alt="`${pokemonDetail?.name} official artwork`"
              class="object-contain grow mx-auto w-full aspect-[1.25] max-w-[442px] max-md:mt-3 max-md:max-w-full"
              loading="lazy" />
          </div>
        </div>
      </div>
      <div
        class="flex gap-5 justify-between items-center ml-32 max-w-full text-xs font-bold leading-relaxed text-white whitespace-nowrap w-[111px] max-md:ml-2.5">
        <PokemonType v-for="type in pokemonDetail?.types" :key="type.type.name" :type="type.type.name" />
      </div>
    </section>
    <nav class="flex flex-row pb-2.5 mx-auto mt-4 w-full max-w-full grow-0 max-md:pl-5" aria-label="Pokemon navigation">
      <PokemonNavigation :previous="previousEvolutionDetail || ''" :next="nextEvolutionDetail || ''"
        :other="otherArtWork " />
    </nav>
  </article>
</template>
