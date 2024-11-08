


<script setup lang="ts">
import { useRoute } from 'vue-router';
import { defineComponent, ref, onMounted } from 'vue';
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
  <div>
    <h1>Pokemon Details</h1>
    <p>{{ pokemonDetail?.name }}</p>
    <p>{{ pokemonDetail?.height }}</p>
    <p>{{ pokemonDetail?.weight }}</p>
  </div>
</template>

<style scoped></style>
