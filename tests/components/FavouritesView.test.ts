import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { shallowMount } from '@vue/test-utils';
import FavouritesView from '../../src/views/FavouritesView.vue';
import { usePokemonStore } from '../../src/store/pokemon';

const routes = [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/pokemondetail/:name', component: { template: '<div>Pokemon Detail</div>' } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

describe('FavouritesView', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        router.push('/');
        router.isReady();
    });

    it('renders correctly', () => {
        const wrapper = shallowMount(FavouritesView, {
            global: {
                plugins: [router],
            },
        });
        expect(wrapper.exists()).toBe(true);
    });

    it('displays the correct title', () => {
        const wrapper = shallowMount(FavouritesView, {
            global: {
                plugins: [router],
            },
        });
        expect(wrapper.find('h1').text()).toBe('Favourites');
    });

    it('navigates to the next page', async () => {
        const wrapper = shallowMount(FavouritesView, {
            global: {
                plugins: [router],
            },
        });

        const store = usePokemonStore();
        store.favoritePokemon = Array(20).fill({ name: 'Pikachu' });
        store.totalFavoritePokemon = 20;
        wrapper.vm.currentPage = 1;
        await wrapper.vm.$nextTick();
        console.log(wrapper.vm.totalPokemons);
        const nextButton = wrapper.find('[data-test="next"]');
        await nextButton.trigger('click');
        expect(wrapper.vm.currentPage).toBe(2);
    });

    it('navigates to the previous page', async () => {
        const wrapper = shallowMount(FavouritesView, {
            global: {
                plugins: [router],
            },
        });

        const store = usePokemonStore();
        store.favoritePokemon = Array(20).fill({ name: 'Pikachu' });
        wrapper.vm.currentPage = 2;
        await wrapper.vm.$nextTick();

        const prevButton = wrapper.find('[data-test="previous"]');
        await prevButton.trigger('click');

        expect(wrapper.vm.currentPage).toBe(1);
    });

    // it('navigates to the Pokémon detail page', async () => {
    //     const wrapper = shallowMount(FavouritesView, {
    //         global: {
    //             plugins: [router],
    //         },
    //     });

    //     const store = usePokemonStore();
    //     store.favoritePokemon = [{ name: 'Pikachu' }];

    //     await wrapper.vm.$nextTick();

    //     const pokemonItem = wrapper.find('li:contains("Pikachu")');
    //     await pokemonItem.trigger('click');

    //     expect(wrapper.vm.$route.path).toBe('/pokemondetail/Pikachu');
    // });
});
