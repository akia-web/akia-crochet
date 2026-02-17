<template>

  <div class="flex items-center">
    <Button
        icon="pi pi-shopping-cart"
        class="p-button-transparent text-black"
        @click="updateVisibility"
    />

    <div
        class="bg-[var(--action-color)] rounded-full p-[10px] h-[20px] w-[20px] flex justify-center align-center items-center">
      <div class="text-white text-xs font-bold">
        {{ storeProductsCart.productCartLength }}
      </div>

    </div>
  </div>


  <Drawer v-model:visible="openSlider" position="right">
    <template #header>
      <div class="flex items-center gap-2">
        <h2>Panier</h2>
      </div>
    </template>

    <div v-for="product in products">
      <div class="flex items-center border-b mt-1"
      v-if="(product.preOrder && product.acceptedPreOrder) || !product.preOrder">
        <img :src="product.productVariant.images[0].url" alt="" class="w-[100px] h-[100px] object-cover">

        <div class="flex flex-col w-full ml-4">
          <div>
            <Chip v-if="product.preOrder">Pré-commande</Chip>
         </div>

          <div class="flex w-full items-center ml-4">
            <p class="w-[40%]">{{ product.product.name }} - {{ product.productVariant.name }}</p>
            <p class="w-[40%] text-center">{{ divideBy100(product.quantity * product.productVariant.price) }} €</p>

            <Button icon="pi pi-trash"
                    class="w-[25%] p-button-transparent text-black"
                    @click="deleteProduct(product)"/>
          </div>

        </div>
      </div>

    </div>

    <DynamicDialog/>

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
        <RouterLink :to="{name: RECAP_CART_ROUTE}" class="w-full bg-actionColor text-white p-[10px] text-center">
          Commander
        </RouterLink>

      </div>
    </template>
  </Drawer>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import { divideBy100 } from '@/functions/convertions.ts';
import { configOpenDialog } from '@/config/openDialogConfig.ts';
import type { SocialMediaDto } from '@/interfaces/social-media.dto.ts';
import { useDialog } from 'primevue';
import { storeToRefs } from 'pinia';
import ListOutOfStockProduct from '@/components/dialog-modal/list-out-of-stock-product.vue';
import { useRoute } from 'vue-router';
import { RECAP_CART_ROUTE } from '@/router/routes-name.ts';

const storeProductsCart = useProductsCartStore();
const { openSlider } = storeToRefs(storeProductsCart);
const dialog = useDialog();
const route = useRoute();

onMounted(() => {
  storeProductsCart.getProductsCartLength()
})

watch(openSlider, async (newVal, oldVal) => {
  if (newVal) {
    await storeProductsCart.getLocalStorageCart();
    if (storeProductsCart.openModal) {
      openDialog();
    }
  }
});

const products = computed(() => {
  return storeProductsCart.productsCart
})

const deleteProduct = (product: ProductShopDto) => {
  storeProductsCart.deleteProduct(product);
};


const updateVisibility = () => {
  if(route.path !== '/Payment' && route.path !==`/${RECAP_CART_ROUTE}` ) {
    storeProductsCart.updateVisibility();
  }
};

const openDialog = () => {
  dialog.open(ListOutOfStockProduct, {
    props: configOpenDialog('Liste des produits à modifier', false),
    data: {
      list: storeProductsCart.listOutOfStocks
    },
    onClose: (options: { data: SocialMediaDto }) => {
      if (options?.data) {
        // mediaUrls.value.push({ type: options.data.type, url: options.data.url });
      }
    }
  });
};

</script>