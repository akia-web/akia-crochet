<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "@/components/Nav/NavBar.vue";
</script>

<template>
  <header>
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

    <div class="wrapper">
      <p class="bg-fuchsia-300">lala</p>
   <nav-bar></nav-bar>
    </div>
  </header>

  <RouterView />
</template>


