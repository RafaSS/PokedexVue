<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  fetchPokemonDetails,
  fetchPokemonEvolutionChain,
  fetchPokemonSpecies,
  fetchTypeDetails,
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
const selectedImage = ref<string | undefined>(undefined);
const weaknesses = ref<string[]>([]);

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

  const halfDamage = new Set<string>();
  const doubleDamage = new Set<string>();

  for (const type of pokemonDetail.value?.types || []) {
    const typeDetails = await fetchTypeDetails(type.type.name);
    for (const damageRelation of typeDetails.damage_relations.double_damage_from) {
      doubleDamage.add(damageRelation.name);
    }
    for (const damageRelation of typeDetails.damage_relations.half_damage_from) {
      halfDamage.add(damageRelation.name);
    }
    //weakness is the diference between double damage and half damage
    weaknesses.value = Array.from(doubleDamage).filter((type) => !halfDamage.has(type));
  }

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

  selectedImage.value = pokemonDetail.value?.sprites?.other['official-artwork'].front_default || undefined;
};

onMounted(loadData);
watch(() => route.params.name, loadData);

const getAltArtWork = async (pokemon: PokemonDetails) => {
  const otherArtWork: string[] = [];
  if (!pokemon?.sprites?.other) return otherArtWork;
  for (const key in pokemon.sprites.other) {
    if (key !== 'official-artwork') {
      const artwork = pokemon.sprites.other[key as keyof typeof pokemon.sprites.other];
      if (artwork.front_default) {
        otherArtWork.push(artwork.front_default);
      }
    }
  }
  if (!pokemon.sprites.versions) return otherArtWork;
  for (const key in pokemon.sprites.versions) {
    if (key !== 'generation-viii') {
      const version = pokemon.sprites.versions[key as keyof typeof pokemon.sprites.versions];
      for (const subKey in version) {
        if (subKey !== 'icons') {
          const artwork = version[subKey as keyof typeof version] as { front_default?: string };
          if (artwork.front_default) {
            otherArtWork.push(artwork.front_default);
          }
        }
      }
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
    store.saveFavoritePokemon({ id: pokemonDetail.value?.id as number, name: pokemonDetail.value?.name as string, url: 'pokemon/' + pokemonDetail.value?.name });
  }
  isFavorite.value = !isFavorite.value;
};

const updateSelectedImage = (image: string) => {
  selectedImage.value = image;
};
</script>

<template>
  <article class="flex overflow-hidden flex-col self-center px-20 py-8 bg-red-500 rounded-3xl max-md:px-5 md:m-20"
    role="article" aria-labelledby="pokemon-name">
    <section
      class="relative flex flex-col pt-3 pr-4 pb-0.5 pl-16 w-full bg-sky-600 rounded-3xl max-md:pl-5 max-md:max-w-full"
      aria-label="Pokemon Information">
      <div class="absolute top-4 right-4 cursor-pointer" @click="toggleFavorite">
        <img v-if="isFavorite" src="../assets/star.svg" alt="Remove from Favorites" class="w-8 h-8" />
        <img v-else src="../assets/starDisabledg" alt="Add to Favorites" class="w-8 h-8" />
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
            <img :src="selectedImage" :alt="`${pokemonDetail?.name} official artwork`"
              class="object-contain grow mx-auto w-full aspect-[1.25] max-w-[442px] max-md:mt-3 max-md:max-w-full"
              loading="lazy" style="image-rendering: pixelated;" />
          </div>
        </div>
      </div>
      <div class="flex flex-col p-2">
        <div class="flex items-center gap-4  max-md:ml-2.5">
          <span class="text-white font-bold">Types:</span>
          <div class="flex gap-2">
            <PokemonType v-for="type in pokemonDetail?.types" :key="type.type.name" :type="type.type.name" />
          </div>
        </div>
        <div class="flex items-center gap-4  mt-2 max-md:ml-2.5">
          <span class="text-white font-bold">Weaknesses:</span>
          <div class="flex gap-2">
            <PokemonType v-for="weakness in weaknesses" :key="weakness" :type="weakness" />
          </div>
        </div>
      </div>
    </section>
    <nav class="flex flex-row pb-2.5 mx-auto mt-4 w-full max-w-full grow-0 max-md:pl-5" aria-label="Pokemon navigation">
      <PokemonNavigation :previous="previousEvolutionDetail || ''" :next="nextEvolutionDetail || ''"
        :other="otherArtWork" @selectImage="updateSelectedImage" />
    </nav>
  </article>
</template>
