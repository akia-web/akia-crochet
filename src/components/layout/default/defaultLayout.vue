<template>
  <div class="bg-site min-h-100vh">
    <header class="sticky top-0 z-50 ">
      <div>
        <NavBar></NavBar>
      </div>
    </header>

    <div class="w-[90%] mx-auto">
      <Toast></Toast>
      <div class="mt-4 min-h-[85vh]">
        <RouterView/>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>


<script setup lang="ts">
import NavBar from '@/components/Nav/PrincipalNav/NavBarComponent.vue';
import { RouterView } from 'vue-router';
import FooterComponent from '@/components/Footer/FooterComponent.vue';
</script>