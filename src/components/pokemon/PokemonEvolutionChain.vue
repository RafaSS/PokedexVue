<template>
    <div class="flex gap-1 items-center self-stretch my-auto leading-snug text-center whitespace-nowrap max-md:mt-10 max-sm:mx-auto max-sm:mb-auto"
        role="navigation" aria-label="Pokemon Evolution Chain">
        <button
            class="overflow-hidden self-stretch px-1 py-1.5 my-auto w-6 rounded-lg bg-neutral-100 min-w-[24px] focus:ring-2 focus:ring-sky-600"
            aria-label="Previous evolution">
            &lt;-
        </button>
        <img v-for="i in 4" :key="i" loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/6d68e11debc844a1ade269bfeb7cc3c0/1aa5f61aa7172c587cc8d8c12cddf81a213ce9ea26d9990faeb6151aca9c6fe6?apiKey=6d68e11debc844a1ade269bfeb7cc3c0&"
            :alt="`Evolution stage ${i}`"
            class="object-contain shrink-0 self-stretch my-auto w-10 rounded-full aspect-square" />
        <button
            class="overflow-hidden self-stretch px-1 py-1.5 my-auto w-6 rounded-lg bg-neutral-100 min-w-[24px] focus:ring-2 focus:ring-sky-600"
            aria-label="Next evolution">
            -&gt;
        </button>
    </div>
</template>