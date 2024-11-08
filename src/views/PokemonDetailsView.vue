<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div>
    <h1>Pokemon Details</h1>
    <p>{{ route.params.slug }}</p>
  </div>
</template>

<style scoped>

</style>
