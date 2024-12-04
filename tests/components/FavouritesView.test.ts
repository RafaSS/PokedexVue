import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import router from '../../src/router/index'
import { mount } from '@vue/test-utils'
import FavouritesView from '../../src/views/FavouritesView.vue'
import { usePokemonStore } from '../../src/store/pokemon'

describe('FavouritesView', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it('renders correctly', () => {
    const wrapper = mount(FavouritesView, {
      global: {
        plugins: [router, pinia],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('displays the correct title', () => {
    const wrapper = mount(FavouritesView, {
      global: {
        plugins: [router, pinia],
      },
    })
    expect(wrapper.find('h1').text()).toBe('Favourites')
  })

  // it('navigates to the next page', async () => {
  //     const wrapper = mount(FavouritesView, {
  //         global: {
  //             plugins: [router, pinia],
  //         },
  //     });

  //     const store = usePokemonStore();
  //     store.favoritePokemon = Array(20).fill({ name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' });

  //     store.changePage(1);
  //     await wrapper.vm.$nextTick();
  //     const nextButton = wrapper.find('[data-test="next"]');
  //     console.log(nextButton);

  //     await nextButton.trigger('click');
  //     expect(store.currentPage).toBe(2);
  // });

  it('navigates to the previous page', async () => {
    const wrapper = mount(FavouritesView, {
      global: {
        plugins: [router, pinia],
      },
    })

    const store = usePokemonStore()
    store.favoritePokemon = Array(20).fill({ name: 'Pikachu' })
    store.favoritePokemon = Array(20).fill({
      name: 'Pikachu',
      url: 'https://pokeapi.co/api/v2/pokemon/pikachu',
    })

    const prevButton = wrapper.find('[data-test="previous"]')
    await prevButton.trigger('click')

    expect(wrapper.vm.currentPage).toBe(1)
  })

  it('navigates to the Pokémon detail page', async () => {
    const wrapper = mount(FavouritesView, {
      global: {
        plugins: [router, pinia],
      },
    })

    const store = usePokemonStore()
    store.favoritePokemon = [
      { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
    ]
    store.favoritePokemon = [
      { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/pikachu' },
    ]
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    const pokemonItem = wrapper.get('[data-test="pokemon-Pikachu"]')
    await pokemonItem.trigger('click')

    expect(router.currentRoute.value.path).toBe('/pokemondetail/Pikachu')
  })
})
