<script setup lang="ts">
  import { RouterView } from 'vue-router'
  import NavBar from './components/layout/NavBar.vue'
  import CookieConsentPopup from './components/CookieConsentPopup.vue'
</script>

<template>
  <NavBar />
  <RouterView />
  <CookieConsentPopup />
</template>

<style scoped></style>
