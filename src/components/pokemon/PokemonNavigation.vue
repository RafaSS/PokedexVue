<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { PokemonDetails } from '../../interfaces/Pokemon'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

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
  <div class="w-full py-6 mt-4">
    <div
      class="flex justify-between items-center w-full bg-black/15 rounded-2xl p-6 shadow-lg backdrop-blur-md border border-white/10"
    >
      <button
        v-if="previous"
        @click="router.push(`/pokemondetail/${previous.name}`)"
        class="flex items-center bg-white/5 border border-white/10 cursor-pointer transition-all duration-300 ease-in-out p-3 rounded-xl shadow-md hover:translate-y-[-3px] hover:bg-white/10 hover:shadow-xl active:translate-y-[-1px] animate-fadeIn"
        :aria-label="previous ? `Go to ${previous.name}` : 'Go to previous'"
      >
        <div class="flex flex-col items-center max-w-[100px]">
          <img
            v-if="previous"
            :src="previous.sprites?.other['official-artwork'].front_default"
            class="w-[90px] h-[90px] object-contain transition-transform duration-300 ease-in-out filter drop-shadow-lg hover:scale-110 hover:-rotate-5"
            :alt="previous.name"
          />
          <span
            class="mt-3 text-[0.95rem] text-white capitalize font-bold text-shadow shadow-black/50 tracking-wide"
          >
            {{ previous.name }}
          </span>
        </div>
        <!-- <div
          class="flex justify-center items-center w-[42px] h-[42px] bg-sky-600 rounded-full shadow-md transition-all duration-300 ease-in-out ml-3 hover:scale-110 hover:bg-sky-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-[22px] h-[22px] text-white"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div> -->
      </button>

      <button
        v-else
        class="flex items-center bg-white/5 border border-white/10 p-3 rounded-xl opacity-50 cursor-not-allowed animate-fadeIn"
        aria-label="No previous evolution"
        disabled
      >
        <div class="flex flex-col items-center max-w-[100px]">
          <div
            class="w-[90px] h-[90px] bg-white/8 rounded-full flex items-center justify-center relative overflow-hidden"
          >
            <div
              class="absolute w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent top-0 left-0 animate-shine"
            ></div>
          </div>
          <span
            class="mt-3 text-[0.95rem] text-white capitalize font-bold text-shadow shadow-black/50 tracking-wide"
          >
            {{ t('pokemonNavigation.previous') }}
          </span>
        </div>
        <!-- <div
          class="flex justify-center items-center w-[42px] h-[42px] bg-sky-600 rounded-full shadow-md ml-3 opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-[22px] h-[22px] text-white"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div> -->
      </button>

      <!-- Alternative Images -->
      <div
        class="flex-1 max-w-[350px] flex flex-col items-center mx-5 animate-fadeIn"
      >
        <h3
          class="text-[1.15rem] font-bold text-white mb-3 text-shadow shadow-black/30"
        >
          {{ t('pokemonNavigation.alternativeImages') }}
        </h3>
        <div
          class="flex items-center bg-black/20 rounded-2xl p-3 shadow-inner border border-white/8 w-full"
          role="navigation"
          aria-label="Alternative Carousel"
        >
          <button
            @click="prevImage"
            class="flex justify-center items-center w-9 h-9 bg-red-500 rounded-xl cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-red-600 hover:scale-110 hover:shadow-lg active:scale-95"
            aria-label="Previous Alternative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-[18px] h-[18px] text-white"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="flex gap-3 mx-3">
            <div
              v-for="(image, index) in visibleImages"
              :key="index"
              class="w-[60px] h-[60px] rounded-xl overflow-hidden cursor-pointer transition-all duration-250 ease-in-out bg-white/10 relative border-2 border-transparent shadow-md hover:translate-y-[-5px] hover:scale-105 hover:shadow-lg hover:border-white/30 hover:z-10"
              @click="selectImage(image)"
            >
              <img
                :src="image"
                alt="Alternative Image"
                class="w-full h-full object-contain transition-transform duration-300 ease hover:scale-110"
              />
            </div>
          </div>

          <button
            @click="nextImage"
            class="flex justify-center items-center w-9 h-9 bg-red-500 rounded-xl cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:bg-red-600 hover:scale-110 hover:shadow-lg active:scale-95"
            aria-label="Next Alternative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-[18px] h-[18px] text-white"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <button
        v-if="next"
        @click="router.push(`/pokemondetail/${next.name}`)"
        class="flex items-center bg-white/5 border border-white/10 cursor-pointer transition-all duration-300 ease-in-out p-3 rounded-xl shadow-md hover:translate-y-[-3px] hover:bg-white/10 hover:shadow-xl active:translate-y-[-1px] animate-fadeIn"
        :aria-label="`Go to ${(next as PokemonDetails).name}`"
      >
        <!-- <div
          class="flex justify-center items-center w-[42px] h-[42px] bg-sky-600 rounded-full shadow-md transition-all duration-300 ease-in-out mr-3 hover:scale-110 hover:bg-sky-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-[22px] h-[22px] text-white"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div> -->
        <div class="flex flex-col items-center max-w-[100px]">
          <img
            :src="next.sprites?.other['official-artwork'].front_default"
            class="w-[90px] h-[90px] object-contain transition-transform duration-300 ease-in-out filter drop-shadow-lg hover:scale-110 hover:rotate-5"
            :alt="next.name"
          />
          <span
            class="mt-3 text-[0.95rem] text-white capitalize font-bold text-shadow shadow-black/50 tracking-wide"
          >
            {{ next.name }}
          </span>
        </div>
      </button>

      <button
        v-else
        class="flex items-center bg-white/5 border border-white/10 p-3 rounded-xl opacity-50 cursor-not-allowed animate-fadeIn"
        aria-label="No next evolution"
        disabled
      >
        <!-- <div
          class="flex justify-center items-center w-[42px] h-[42px] bg-sky-600 rounded-full shadow-md mr-3 opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-[22px] h-[22px] text-white"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div> -->
        <div class="flex flex-col items-center max-w-[100px]">
          <div
            class="w-[90px] h-[90px] bg-white/8 rounded-full flex items-center justify-center relative overflow-hidden"
          >
            <div
              class="absolute w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent top-0 left-0 animate-shine"
            ></div>
          </div>
          <span
            class="mt-3 text-[0.95rem] text-white capitalize font-bold text-shadow shadow-black/50 tracking-wide"
          >
            {{ t('pokemonNavigation.next') }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%) rotate(45deg);
    }
    20%,
    100% {
      transform: translateX(100%) rotate(45deg);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }

  .animate-shine {
    animation: shine 3s infinite;
  }

  .text-shadow {
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    .flex.justify-between.items-center {
      flex-direction: column;
      gap: 2rem;
      padding: 1.25rem;
    }

    .flex-1.max-w-\[350px\] {
      order: 3;
      max-width: 100%;
      margin: 1rem 0;
    }

    .text-\[1\.15rem\].font-bold.text-white {
      text-align: center;
    }

    button.flex.items-center {
      width: 100%;
      justify-content: space-between;
    }
  }

  @media (max-width: 480px) {
    .flex.gap-3 {
      gap: 0.5rem;
    }

    .w-\[60px\].h-\[60px\] {
      width: 50px;
      height: 50px;
    }
  }
</style>
