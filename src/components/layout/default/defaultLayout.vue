<template>
  <div class="bg-site min-h-100vh">
    <header>
      <div>
        <NavBar></NavBar>
      </div>
    </header>

    <div class="w-80">
      <Toast></Toast>
      <div class="mt-1">
        <RouterView/>
      </div>

    </div>

  </div>
</template>


<script setup lang="ts">
import NavBar from '@/components/Nav/NavBarComponent.vue';
import { RouterView } from 'vue-router';
</script>