<template>
  Les produits suivants sont en rupture de stock. <br>
  Leur commande reste possible, avec un délai d’expédition de 3 semaines.

  <div v-if="objectList" class="mt-4">
    <div v-for="item in objectList"
         class="flex gap-4 items-center">
      <img :src="item.productVariant.images[0].url" alt=""
           class="w-[50px]">
      <p>{{ item.product.name }} - {{ item.productVariant.name }}</p>
      <p>{{ divideBy100(item.productVariant.price) }} €</p>
      <Button label="pré-commander" @click="validateProduct(item)"/>
      <Button icon="pi pi-trash"
              label="Supprimer"
      class="button-action-transparent" @click="deleteProduct(item)"></Button>
    </div>
  </div>

</template>
<script lang="ts" setup>
import { inject, ref, watch } from 'vue';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { divideBy100 } from '@/functions/convertions.ts';

const dialogRef = inject<any>('dialogRef');
const storeProductsCart = useProductsCartStore();

const objectList = ref<ProductShopDto[]>([]);


if (dialogRef?.value?.data) {
  objectList.value = dialogRef.value.data.list;
}



const validateProduct = async (product: ProductShopDto) => {
  product.preOrder = true;
  product.acceptedPreOrder = true;
  await storeProductsCart.updateCart(product);
  const findIndex = objectList.value.findIndex((element: ProductShopDto)=> element.productVariant.id === product.productVariant.id)
  objectList.value.splice(findIndex, 1);
  if (objectList.value.length === 0) {
    dialogRef.value.close();
  }

};

const deleteProduct = async (product: ProductShopDto) => {
  const findIndex = objectList.value.findIndex((element: ProductShopDto)=> element.productVariant.id === product.productVariant.id)
  objectList.value.splice(findIndex, 1);
  storeProductsCart.deleteProduct(product);
  if (objectList.value.length === 0) {
    dialogRef.value.close();
  }
}


</script>