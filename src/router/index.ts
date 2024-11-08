import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PokemonDetailsView from '../views/PokemonDetailsView.vue'
import PokemonListView from '../views/PokemonListView.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/pokemondetail/:name', component: PokemonDetailsView },
  { path: '/pokemonlist', component: PokemonListView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
