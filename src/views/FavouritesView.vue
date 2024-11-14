<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePokemonStore } from '../store/pokemon';

const router = useRouter();
const pokemonList = ref<{ name: string }[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPokemons = ref(0);

// Fetch Pokémon list for the current page
const fetchPokemons = async () => {
    const store = usePokemonStore();
    await store.loadFavoritePokemon();
    pokemonList.value = store.favoritePokemon;
    totalPokemons.value = store.favoritePokemon.length;
};

// Handle next/previous page navigation
const goToNextPage = () => {
    if (currentPage.value < Math.ceil(totalPokemons.value / itemsPerPage.value)) {
        currentPage.value += 1;
        fetchPokemons();
    }
};

const goToPreviousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
        fetchPokemons();
    }
};

// Load initial Pokémon list
onMounted(fetchPokemons);

// Redirect to Pokémon detail route
const goToPokemonDetail = (name: string) => {
    router.push(`/pokemondetail/${name}`);
};
</script>

<template>
    <!-- Navbar -->
    <nav class="bg-red-600 p-4 text-white flex justify-between items-center">
        <h1 class="text-lg font-bold cursor-pointer" @click="router.push('/')">Pokedex</h1>
        <div class="flex space-x-4">
            <button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-100" @click="router.push('/')">
                Home
            </button>
            <button class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-100">
                Favorites
            </button>
        </div>
    </nav>

    <!-- Pokémon List with Pagination -->
    <div class="max-w-2xl mx-auto p-5">
        <div class="bg-red-600 p-5 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold mb-4 text-white">Select a Pokémon:</h2>
            <ul class="space-y-2">
                <li v-for="pokemon in pokemonList" :key="pokemon.name" @click="goToPokemonDetail(pokemon.name)"
                    class="cursor-pointer text-white hover:underline">
                    {{ pokemon.name }}
                </li>
            </ul>

            <!-- Pagination Controls -->
            <div class="flex justify-between items-center mt-6">
                <button @click="goToPreviousPage" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <span class="text-red-700">
                    Page {{ currentPage }} of {{ Math.ceil(totalPokemons / itemsPerPage) }}
                </span>
                <button @click="goToNextPage" :disabled="currentPage >= Math.ceil(totalPokemons / itemsPerPage)"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
