import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PokemonDetailsView from '../views/PokemonDetailsView.vue'
import FavouritesView from '../views/FavouritesView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
import AuthCallbackView from '../views/AuthCallbackView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/pokemondetail/:name', component: PokemonDetailsView },
  { path: '/favorites', component: FavouritesView },
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignupView },
  { path: '/auth/callback', component: AuthCallbackView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
