import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PokemonDetailsView from '../views/PokemonDetailsView.vue'
import FavouritesView from '../views/FavouritesView.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/pokemondetail/:name', component: PokemonDetailsView },
  { path: '/favourites', component: FavouritesView },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
