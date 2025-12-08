<template>

  <div class="flex items-center">
    <Button
        icon="pi pi-shopping-cart"
        class="p-button-transparent text-black"
        @click="visible = !visible"
    />

    <div class="bg-[var(--action-color)] rounded-full p-[10px] h-[20px] w-[20px] flex justify-center align-center items-center">
      <div class="text-white text-xs font-bold">
        {{storeProductsCart.productsCart.length.toString()}}
      </div>

    </div>
  </div>


  <Drawer v-model:visible="visible" position="right">
    <template #header>
      <div class="flex items-center gap-2">
        <h2>Panier</h2>
      </div>
    </template>

    <div v-for="product in storeProductsCart.productsCart"
         class="flex items-center border-b mt-1">
      <img :src="product.image" alt="" class="w-[100px] h-[100px] object-cover">
      <p class="w-[40%] text-center">{{ product.name }}</p>
      <p class="w-[40%] text-center">{{ divideBy100(product.price) }} €</p>

      <Button icon="pi pi-trash"
              class="w-[25%] p-button-transparent text-black"
              @click="deleteProduct(product)"/>
    </div>

    <p v-if="storeProductsCart.productsCart.length === 0" class="mt-8">
     Il n'y a pas de produits dans votre panier
    </p>

    <template #footer>
      <div class="flex justify-between mb-4 border-t pt-[10px]">
        <p>
          TOTAL
        </p>
        <p>{{ storeProductsCart.totalPrice }} EUROS</p>
      </div>

      <div class="flex items-center gap-2">
        <Button label="Commander"
                icon="pi pi-card"
                class="flex-auto"/>
      </div>
    </template>
  </Drawer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import { divideBy100 } from '@/functions/convertions.ts';

const visible = ref<boolean>(false);
const storeProductsCart = useProductsCartStore();

onMounted(()=> {
storeProductsCart.getLocalStorageCart()
})


const deleteProduct = (product: ProductShopDto) => {
  storeProductsCart.deleteProduct(product);
};

</script>