<template>
  <div v-show="list && list.length > 0">
    <h2 class=" font-semibold text-sm text-actionColor">{{ title }}</h2>
    <table class="w-full mt-2">
      <tbody>
      <tr v-for="product in list" :key="product.productVariant.id">
        <td class="pt-[10px] w-[25%]">
          <div class="relative w-[70px] ">
            <img :src="product.productVariant.images[0].url"
                 alt=""
                 class="w-[70px] h-[70px] object-cover"/>

            <div class="absolute -top-1 -right-2 min-w-[25px] min-h-[25px]
            px-1 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center border border-white">
              <p>{{ product.quantity }}</p>
            </div>
          </div>

        </td>
        <td class=" w-[25%]">
          <p class="md:text-center">{{ product.product.name }} {{
              product.product.productVariants && product.product.productVariants?.length > 1 ? `- ` + product.productVariant.name : ''
            }}</p>
        </td>
        <td class="md:p-[10px]  w-[25%]">
          <p class="text-right"> {{ divideBy100(product.productVariant.price * product.quantity) }} €</p>
          <p class="text-xs text-right italic text-gray-400">({{ product.quantity }} x
            {{ divideBy100(product.productVariant.price) }} €)</p>
        </td>
        <td v-if="isRecapPage" class="text-center  w-[25%]">
          <Button icon="pi pi-trash"
                  class="button-action-transparent" @click="deleteProduct(product)"
          label="Supprimer"></Button>
        </td>
      </tr>
      </tbody>
    </table>

    <div>

    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, type PropType, reactive, ref } from 'vue';
import { divideBy100 } from '@/functions/convertions.ts';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';

const storeProductsCart = useProductsCartStore();
const props = defineProps({
  isRecapPage: Boolean,
  title: String,
  list: Array as PropType<ProductShopDto[]>,
});

const deleteProduct = (product: ProductShopDto) => {
  storeProductsCart.deleteProduct(product);
}


</script>