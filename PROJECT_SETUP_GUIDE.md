# PokedexVue Project Setup Guide

This guide explains how to create a Vue.js Pokedex application like this one from scratch.

## Prerequisites

- Node.js (v16 or higher)
- npm or Yarn
- Git

## Step 1: Create a New Vue Project

```bash
# Create a new Vue 3 project with Vite
npm create vite@latest pokedex -- --template vue-ts

# Navigate to the project directory
cd pokedex

# Install dependencies
npm install
```

## Step 2: Install Required Dependencies

```bash
# Install Vue Router and Pinia for state management
npm install vue-router@4 pinia

# Install Tailwind CSS for styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Supabase for backend
npm install @supabase/supabase-js

# Install Vue I18n for internationalization
npm install vue-i18n@next

# Install additional utilities
npm install js-cookie uuid vue-cookies
npm install -D @types/js-cookie @types/uuid

# Install testing libraries
npm install -D vitest happy-dom @testing-library/vue @vue/test-utils
```

## Step 3: Configure the Project

### Configure Tailwind CSS

Create or update the `tailwind.config.js` file:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to your CSS in `src/style.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Configure Vue Router

Create a router directory and setup:

```bash
mkdir -p src/router
```

Create `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-detail',
      component: () => import('../views/PokemonDetailView.vue')
    }
  ]
})

export default router
```

### Configure Pinia Store

Create a stores directory:

```bash
mkdir -p src/stores
```

Create `src/stores/pokemon.ts`:

```typescript
import { defineStore } from 'pinia'
import type { Pokemon } from '../types/pokemon'

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as Pokemon[],
    selectedTypes: [] as string[],
    loading: false,
    error: null as string | null
  }),
  
  getters: {
    filteredPokemons: (state) => {
      if (state.selectedTypes.length === 0) return state.pokemons
      
      return state.pokemons.filter(pokemon => {
        // Count how many of the selected types this pokemon has
        const matchingTypesCount = state.selectedTypes.filter(type => 
          pokemon.types.includes(type)
        ).length
        
        // Only keep pokemon that have ALL the selected types (AND logic)
        return matchingTypesCount === state.selectedTypes.length
      })
    }
  },
  
  actions: {
    async fetchPokemonList() {
      try {
        this.loading = true
        // Fetch from API or Supabase here
        // ...
        this.loading = false
      } catch (error) {
        this.error = 'Failed to fetch Pokemon'
        this.loading = false
      }
    },
    
    toggleTypeFilter(type: string) {
      if (this.selectedTypes.includes(type)) {
        this.selectedTypes = this.selectedTypes.filter(t => t !== type)
      } else {
        this.selectedTypes.push(type)
      }
    }
  }
})
```

### Configure Vue I18n

Create i18n directory:

```bash
mkdir -p src/i18n
```

Create English and Portuguese language files:

`src/i18n/en.ts`:
```typescript
export default {
  header: {
    title: 'Pokedex',
    search: 'Search'
  },
  filters: {
    types: 'Types',
    clear: 'Clear Filters'
  }
}
```

`src/i18n/pt.ts`:
```typescript
export default {
  header: {
    title: 'Pokedex',
    search: 'Buscar'
  },
  filters: {
    types: 'Tipos',
    clear: 'Limpar Filtros'
  }
}
```

### Configure Supabase

Create a plugins directory:

```bash
mkdir -p src/plugins
```

Create `src/plugins/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string

export const supabase = createClient(supabaseUrl, supabaseKey)
```

Create `.env` and `.env.example` files:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

## Step 4: Create TypeScript Types

Create a types directory:

```bash
mkdir -p src/types
```

Create `src/types/pokemon.ts`:

```typescript
export interface Pokemon {
  id: number
  name: string
  imageUrl: string
  types: string[]
  height: number
  weight: number
  abilities: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    specialAttack: number
    specialDefense: number
    speed: number
  }
}
```

## Step 5: Create Components

Create basic components structure:

```bash
mkdir -p src/components/layout
mkdir -p src/components/pokemon
mkdir -p src/views
```

## Step 6: Update Main.ts

Update `src/main.ts`:

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index'
import { createI18n } from 'vue-i18n'
import en from './i18n/en'
import pt from './i18n/pt'

const app = createApp(App)
const pinia = createPinia()
const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    pt,
  },
})

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
```

## Step 7: Configure Vercel Deployment

Create a `vercel.json` file in the root directory:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Step 8: Start Development Server

```bash
npm run dev
```

## Additional Steps

1. Build Pokemon Type component with appropriate styling
2. Implement API fetching logic
3. Create responsive layouts for mobile and desktop
4. Implement cookie consent functionality
5. Build detailed Pokemon view page
6. Add loading indicators and error handling
7. Create a deployment pipeline for Vercel

## Testing

Run tests:

```bash
npm run test
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to Vercel or other hosting platforms.
