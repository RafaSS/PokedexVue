<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    label: string
    value: number
  }>()

  const formattedLabel = computed(() => {
    const label = props.label.replace('-', ' ')
    return label === 'hp'
      ? 'HP'
      : label.charAt(0).toUpperCase() + label.slice(1)
  })

  const barWidth = computed(() => {
    return `${Math.min((props.value / 150) * 100, 100)}%`
  })

  const barColor = computed(() => {
    if (props.value >= 100) return '#4CAF50'
    if (props.value >= 70) return '#8BC34A'
    if (props.value >= 50) return '#FFEB3B'
    if (props.value >= 30) return '#FF9800'
    return '#F44336'
  })
</script>

<template>
  <div class="stat-container">
    <div class="stat-header">
      <div class="stat-label">{{ formattedLabel }}</div>
      <div class="stat-value">{{ value }}</div>
    </div>
    <div class="stat-bar-container">
      <div
        class="stat-bar"
        :style="{ width: barWidth, backgroundColor: barColor }"
        :class="{ 'animate-pulse': value > 90 }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
  .stat-container {
    width: 100%;
    margin-bottom: 12px;
    transition: transform 0.2s;
  }

  .stat-container:hover {
    transform: translateX(5px);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .stat-label {
    font-weight: 600;
    text-transform: capitalize;
    color: #ffffff;
  }

  .stat-value {
    font-family: 'Roboto Mono', monospace;
    font-weight: 600;
    color: #ffffff;
  }

  .stat-bar-container {
    height: 10px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
  }

  .stat-bar {
    height: 100%;
    border-radius: 10px;
    transition:
      width 1s ease-in-out,
      background-color 0.5s;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
</style>
