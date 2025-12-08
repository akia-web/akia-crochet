<template>
  <div class="bg-site min-h-100vh">
    <header>
      <div>
        <NavBar></NavBar>
      </div>
    </header>

    <div class="w-[90%] md:w-1/2 mx-auto">
      <Toast></Toast>
      <div class="mt-4 min-h-[85vh]">
        <RouterView/>
      </div>
    </div>
    <FooterComponent/>
  </div>
</template>


<script setup lang="ts">
import NavBar from '@/components/Nav/NavBarComponent.vue';
import { RouterView } from 'vue-router';
import FooterComponent from '@/components/Footer/FooterComponent.vue';
</script>