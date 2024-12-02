<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePokemonStore } from '../store/pokemon';

const router = useRouter();
const pokemonList = ref<{ name: string, sprite: string }[]>([]);
const store = usePokemonStore();
const currentPage = computed(() => store.currentPage);
const itemsPerPage = ref(10);
const totalPokemons = ref(0);

// Expose currentPage and itemsPerPage to parent component
defineExpose({ currentPage, itemsPerPage, totalPokemons });

// Fetch Pokémon list for the current page
const loadData = () => {
    store.loadFavoritePokemon(currentPage.value, itemsPerPage.value);
    pokemonList.value = store.favoritePokemon.map(pokemon => ({
        name: pokemon.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`
    }));
    totalPokemons.value = store.totalFavoritePokemon;
};

// Handle next/previous page navigation
const goToNextPage = async () => {
    if (store.currentPage < Math.ceil(totalPokemons.value / itemsPerPage.value)) {
        store.changePage(store.currentPage + 1);
    }
};

const goToPreviousPage = async () => {
    if (store.currentPage > 1) {
        store.changePage(store.currentPage - 1);
    }
};

// Watch for changes in currentPage and itemsPerPage
watch([currentPage, itemsPerPage], loadData);

// Load initial Pokémon list
onMounted(loadData);

// Redirect to Pokémon detail route
const goToPokemonDetail = (name: string) => {
    router.push(`/pokemondetail/${name}`);
};
</script>

<template>
    <!-- Pokémon List with Pagination -->
    <div class="max-w-2xl mx-auto p-5">
        <div class="bg-red-600 p-5 rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold mb-4 text-white">Select a Pokémon:</h2>
            <div class="grid grid-cols-2 gap-4 m-24">
                <div v-for="pokemon in pokemonList" :key="pokemon.name" @click="goToPokemonDetail(pokemon.name)"
                    class="cursor-pointer text-white hover:underline col items-center w-auto p-2 rounded-lg shadow-md">
                    <img :src="pokemon.sprite" alt="pokemon" >
                    <span>{{ pokemon.name }}</span>
                </div>
            </div>

            <!-- Pagination Controls -->
            <div class="flex justify-between items-center mt-6">
                <button data-test="previous" @click="goToPreviousPage" :disabled="currentPage === 1"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <span class="text-red-700">
                    Page {{ currentPage }} of {{ Math.ceil(totalPokemons / itemsPerPage) }}
                </span>
                <button @click="goToNextPage()" data-test="next"
                    :disabled="currentPage >= Math.ceil(totalPokemons / itemsPerPage)"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}
</style>
