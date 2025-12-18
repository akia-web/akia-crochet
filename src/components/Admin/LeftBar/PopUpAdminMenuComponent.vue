<template>
  <div class="relative h-[calc(100%-100px)]">
    <div class="mb-[40px]">
      <RouterLink to="/" class="flex justify-center mt-[50px] mb-[100px]">
        <img class="logo"
             alt="logo Akia"
             src="@/assets/logo-base-line.png">
      </RouterLink>
    </div>

    <a v-for="item in adminMenuItems"
       @click="navigateTo(item.url)"
       class="flex justify-center mb-[20px]">
      <p :class="'pi pi-'+item.icon"
         class="mr-2"></p>
      <p>{{ item.label }}</p>
    </a>

    <div class="absolute bottom-0 left-0 w-full">
      <div class="flex justify-center">
        <Button @click="disconnect">Déconnexion</Button>
      </div>
    </div>
  </div>


</template>
<script lang="ts" setup>
import { adminMenuItems } from '@/components/Admin/LeftBar/config/menu-items.ts';

const emit = defineEmits(['naviate', 'disconnect']);

const disconnect = () => {
  emit('disconnect');
};

const navigateTo = (url: string) => {
  emit('naviate', url);
};
</script>

<style scoped src="./style.css"></style>