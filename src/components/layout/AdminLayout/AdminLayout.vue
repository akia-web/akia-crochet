<template>
  <div class="bg-site min-h-100vh">
    <header>
      <div>
        <NavBar></NavBar>
      </div>
    </header>
    <div class="flex mt-1">
      <LeftBarComponent></LeftBarComponent>
      <div class="ml-2 mr-2 w-100">
        <RouterView/>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import LeftBarComponent from '@/components/Admin/LeftBar/LeftBarComponent.vue';
import NavBar from '@/components/Nav/NavBarComponent.vue';
</script>