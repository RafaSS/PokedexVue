<template>
  <div class="w-[170px] h-[43px] relative">
    <div class="w-[136px] h-2 left-[34px] top-[35px] absolute rounded">
      <div
        :style="{ width: barWidth }"
        class="h-2 left-0 top-0 absolute bg-white rounded"
      ></div>
    </div>
    <div
      class="left-0 top-0 absolute text-black text-1xl font-semibold font-['Inter'] leading-[28.80px] uppercase"
    >
      {{ label }}
    </div>
    <div
      class="w-[30px] h-3 left-0 top-[31px] absolute text-white text-sm font-normal font-['Roboto Mono'] leading-[14px] uppercase"
    >
      {{ value }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    label: string
    value: number
  }>()

  const barWidth = computed(() => {
    return `${(props.value / 100) * 136}px`
  })
</script>
