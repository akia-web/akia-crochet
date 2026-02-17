<template>
  <h1 class="pt-4 ml-[20px] md:ml-0">Toutes les peluches</h1>
  <div class="flex justify-center md:justify-normal gap-2 mt-4 flex-wrap mb-4">
    <div v-if="products && products.length > 0" class="flex gap-2 flex-wrap justify-center">
      <div v-for="product in products" :key="product.id">
        <ProductCardComponent :product="product"/>
      </div>
    </div>

    <div v-else>
      <p>Pas de produits pour le moments</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { ProductDto } from '@/interfaces/product.dto.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import ProductCardComponent from '@/components/Products/ProductCardComponent.vue';
import { PRODUCTS_DETAILS_ROUTE } from '@/router/routes-name.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';

const products = ref<ProductDto[]>([]);
const storeProductsCart = useProductsCartStore();


onMounted(async () => {
  await getProducts('tous les produits');
  await storeProductsCart.getLocalStorageCart();
});

const getProducts = async (category: string): Promise<any> => {
  fetch(api(env.products.crud))
      .then(response => response.json())
      .then(data => {
        products.value = data;
      })
      .catch(error => {
      });
};

</script>

