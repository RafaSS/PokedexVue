import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetailsView from '../views/PokemonDetailsView.vue'
import FavouritesView from '../views/FavouritesView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/pokemondetail/:name', component: PokemonDetailsView },
  { path: '/favorites', component: FavouritesView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
