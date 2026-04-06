<template>


  <div v-if="listOutOfStock && listOutOfStock.length>0 " class="mt-4">
    Les produits suivants sont en rupture de stock. <br>
    Leur commande reste possible, avec un délai d’expédition de 3 semaines.
    <div v-for="item in listOutOfStock"
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

  <div v-if="listDeletedProduct  && listDeletedProduct.length>0" class="mt-4">
    <p class="mb-4">Les produits suivants ne sont plus disponible et ne peuvent plus être commandés. <br>
    Ils ont été supprimé de votre panier</p> 
    <div v-for="item in listDeletedProduct"
         class="flex gap-4 items-center">
      <img :src="item.productVariant.images[0].url" alt=""
           class="w-[50px]">
      <p>{{ item.product.name }} - {{ item.productVariant.name }}</p>
      <p>{{ divideBy100(item.productVariant.price) }} €</p>
    </div>
    <div class="flex flex-row-reverse">
    <Button v-if="listOutOfStock.length===0" @click="deletedAllProductDeletedProductList" class="mt-4">Ok</Button>
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

const listOutOfStock = ref<ProductShopDto[]>([]);
const listDeletedProduct = ref<ProductShopDto[]>([]);


if (dialogRef?.value?.data) {
  listOutOfStock.value = dialogRef.value.data.listOutOfStock;
  listDeletedProduct.value = dialogRef.value.data.listDeletedProduct;
}



const validateProduct = async (product: ProductShopDto) => {
  product.preOrder = true;
  product.acceptedPreOrder = true;
  await storeProductsCart.updateCart(product);
  const findIndex = listOutOfStock.value.findIndex((element: ProductShopDto)=> element.productVariant.id === product.productVariant.id)
  listOutOfStock.value.splice(findIndex, 1);
  if (listOutOfStock.value.length === 0) {
    dialogRef.value.close();
  }

};

const deletedAllProductDeletedProductList = () => {
  listDeletedProduct.value.forEach((element)=>{
    storeProductsCart.deleteProduct(element)
     dialogRef.value.close();
  })
}

const deleteProduct = async (product: ProductShopDto) => {
  const findIndex = listOutOfStock.value.findIndex((element: ProductShopDto)=> element.productVariant.id === product.productVariant.id)
  listOutOfStock.value.splice(findIndex, 1);
  storeProductsCart.deleteProduct(product);
  if (listOutOfStock.value.length === 0) {
    if(listDeletedProduct.value.length>0){
      deletedAllProductDeletedProductList()
      return
    }
  
    dialogRef.value.close();
  }

}


</script>