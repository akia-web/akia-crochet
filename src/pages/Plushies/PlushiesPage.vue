<template>
  <h1 class="pt-4 ml-[20px] md:ml-0">Toutes les peluches</h1>
  <div class="flex justify-center md:justify-normal gap-2 mt-4 flex-wrap mb-4">
    <div v-if="peluches && peluches.length > 0" class="flex gap-2 flex-wrap justify-center">
      <div v-for="peluche in peluches" :key="peluche.id">
        <PelucheCardComponent :plushie="peluche"/>
      </div>
    </div>

    <div v-else>
      <p>Pas de produits pour le moments</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { PlushieDto } from '@/interfaces/plushieDto.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import PelucheCardComponent from '@/components/Peluches/PelucheCardComponent.vue';
import { PLUSHIES_DETAILS_ROUTE } from '@/router/routes-name.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';

const peluches = ref<PlushieDto[]>([]);
const storeProductsCart = useProductsCartStore();


onMounted(async () => {
  await getPeluches('tous les produits');
  await storeProductsCart.getLocalStorageCart();
});

const getPeluches = async (category: string): Promise<any> => {
  fetch(api(env.plushies.crud))
      .then(response => response.json())
      .then(data => {
        peluches.value = data;
      })
      .catch(error => {
      });
};

</script>

