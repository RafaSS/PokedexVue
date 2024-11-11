<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import { fetchPokemonDetails } from '../api/pokemonApi';
import type { PokemonDetails } from '../interfaces/Pokemon';

const route = useRoute();
const pokemonDetail = ref<PokemonDetails>();

onMounted(async () => {
  pokemonDetail.value = await fetchPokemonDetails(route.params.name as string);
  console.log(pokemonDetail.value);
});
</script>

<template>
  <div class="max-w-md mx-auto p-5 border border-gray-300 rounded-lg shadow-md bg-red-500">
    <h1 class="text-2xl font-bold mb-4">{{ pokemonDetail?.name }}</h1>
    <div class="flex flex-col items-center">
      <img :src="pokemonDetail?.sprites?.front_default" alt="Pokemon Image" class="mb-4">
      <p><strong>Height:</strong> {{ pokemonDetail?.height }}</p>
      <p><strong>Weight:</strong> {{ pokemonDetail?.weight }}</p>
      <p><strong>Base Experience:</strong> {{ pokemonDetail?.base_experience }}</p>
      <p><strong>Abilities:</strong></p>
      <ul>
        <li v-for="ability in pokemonDetail?.abilities" :key="ability.ability.name">
          {{ ability.ability.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
