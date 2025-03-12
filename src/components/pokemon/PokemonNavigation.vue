<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { PokemonDetails } from '../../interfaces/Pokemon'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const props = defineProps<{
    previous: PokemonDetails | ''
    next: PokemonDetails | ''
    other: string[]
  }>()

  const emit = defineEmits<{
    (e: 'navigate', direction: 'previous' | 'next'): void
    (e: 'selectImage', image: string): void
  }>()

  const currentIndex = ref(0)

  const nextImage = () => {
    if (currentIndex.value < props.other.length - 3) {
      currentIndex.value += 3
    } else {
      currentIndex.value = 0
    }
  }

  const prevImage = () => {
    if (currentIndex.value > 0) {
      currentIndex.value -= 3
    } else {
      currentIndex.value = Math.max(0, props.other.length - 3)
    }
  }

  const visibleImages = computed(() => {
    return props.other.slice(currentIndex.value, currentIndex.value + 3)
  })

  const selectImage = (image: string) => {
    emit('selectImage', image)
  }
</script>

<template>
  <div class="pokemon-navigation">
    <div class="navigation-container">
      <button
        v-if="previous"
        @click="router.push(`/pokemondetail/${previous.name}`)"
        class="nav-button prev-button"
        :aria-label="previous ? `Go to ${previous.name}` : 'Go to previous'"
      >
        <div class="pokemon-preview">
          <img
            v-if="previous"
            :src="previous.sprites?.other['official-artwork'].front_default"
            class="pokemon-image"
            :alt="previous.name"
          />
          <span class="pokemon-name">{{ previous.name }}</span>
        </div>
        <div class="nav-arrow prev-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
      </button>

      <button
        v-else
        class="nav-button prev-button disabled"
        aria-label="No previous evolution"
        disabled
      >
        <div class="pokemon-preview empty">
          <div class="empty-pokemon"></div>
          <span class="pokemon-name">No Previous</span>
        </div>
        <div class="nav-arrow prev-arrow disabled">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
      </button>

      <div class="alternatives-container">
        <h3 class="alternatives-title">Alternative Images</h3>
        <div class="alternatives-carousel" role="navigation" aria-label="Alternative Carousel">
          <button
            @click="prevImage"
            class="carousel-button"
            aria-label="Previous Alternative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="carousel-arrow">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div class="alternatives-images">
            <div 
              v-for="(image, index) in visibleImages"
              :key="index"
              class="alternative-image-container"
              @click="selectImage(image)"
            >
              <img
                :src="image"
                alt="Alternative Image"
                class="alternative-image"
              />
            </div>
          </div>
          
          <button
            @click="nextImage"
            class="carousel-button"
            aria-label="Next Alternative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="carousel-arrow">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <button
        v-if="next"
        @click="router.push(`/pokemondetail/${next.name}`)"
        class="nav-button next-button"
        :aria-label="`Go to ${(next as PokemonDetails).name}`"
      >
        <div class="nav-arrow next-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div class="pokemon-preview">
          <img
            :src="next.sprites?.other['official-artwork'].front_default"
            class="pokemon-image"
            :alt="next.name"
          />
          <span class="pokemon-name">{{ next.name }}</span>
        </div>
      </button>

      <button
        v-else
        class="nav-button next-button disabled"
        aria-label="No next evolution"
        disabled
      >
        <div class="nav-arrow next-arrow disabled">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow-icon">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
        <div class="pokemon-preview empty">
          <div class="empty-pokemon"></div>
          <span class="pokemon-name">No Next</span>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.pokemon-navigation {
  width: 100%;
  padding: 1rem 0;
}

.navigation-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-button {
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.nav-button:hover {
  transform: translateY(-3px);
}

.nav-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pokemon-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100px;
}

.pokemon-image {
  width: 90px;
  height: 90px;
  object-fit: contain;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}

.nav-button:hover .pokemon-image {
  transform: scale(1.1);
}

.pokemon-name {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: white;
  text-transform: capitalize;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

.empty-pokemon {
  width: 90px;
  height: 90px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #0284c7; /* bg-sky-600 */
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.prev-button .nav-arrow {
  margin-right: 0.5rem;
}

.next-button .nav-arrow {
  margin-left: 0.5rem;
}

.nav-button:hover .nav-arrow {
  transform: scale(1.1);
  background-color: #0369a1; /* bg-sky-700 */
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: white;
}

.alternatives-container {
  flex: 1;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1rem;
}

.alternatives-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.75rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.alternatives-carousel {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.carousel-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background-color: #ef4444; /* bg-red-500 */
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.carousel-button:hover {
  background-color: #dc2626; /* bg-red-600 */
  transform: scale(1.05);
}

.carousel-arrow {
  width: 16px;
  height: 16px;
  color: white;
}

.alternatives-images {
  display: flex;
  gap: 0.5rem;
  margin: 0 0.5rem;
}

.alternative-image-container {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.1);
  position: relative;
}

.alternative-image-container:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.alternative-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .navigation-container {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .alternatives-container {
    order: 3;
    max-width: 100%;
    margin: 1rem 0;
  }
  
  .alternatives-title {
    text-align: center;
  }
}
</style>
