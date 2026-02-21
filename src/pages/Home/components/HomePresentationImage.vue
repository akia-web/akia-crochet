<template>
  <div v-if="config" class="bg-white rounded-lg p-[10px] mb-8 relative">
    <img :src="config.imageUrl"
         class="h-[80vh] w-full object-cover"
         alt="">

    <div class="absolute bottom-[100px] left-1/2 -translate-x-1/2 shadow-lg ">
      <Button label="Voir les nouveautés" icon="pi pi-shopping-cart" @click="goToPage"/>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { HomeConfigDto } from '@/interfaces/home-config.dto.ts';
import { onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import { useRouter } from 'vue-router';

const config = ref<HomeConfigDto>();
const router = useRouter();
onMounted(async () => {
  apiGet(api(env.homePage.active), 'GET', true)
      .then(response => response.json())
      .then((data: HomeConfigDto) => {
        console.warn(data);
        config.value = data;
      });
});

const goToPage = () => {
  router.push(`/${config.value?.path}`);
};
</script>


<style scoped>

</style>