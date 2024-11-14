
import { describe, it, expect, beforeEach } from 'vitest';
import FavouritesView from '../../src/views/FavouritesView.vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
describe('FavouritesView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it('renders correctly', () => {
    const wrapper = mount(FavouritesView);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the correct title', () => {
    const wrapper = mount(FavouritesView);
    expect(wrapper.find('h1').text()).toBe('Favourites');
  });
});