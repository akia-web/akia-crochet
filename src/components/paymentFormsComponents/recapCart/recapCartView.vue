<template>
  <div>

    <RecapCardList :title="'Expédition immediate'"
                   :isRecapPage="props.isRecapPage"
                   :list="productsToSendImmediately"
                   class="mb-8"/>
    <RecapCardList :title="'pré-commande (3 semaines)'"
                   :isRecapPage="props.isRecapPage"
                   :list="productsToSendAfter"/>

    <hr class="mt-4 mb-4 border-actionColor">

    <p class="mt-4 text-right">Total: {{ storeProductsCart.totalPrice }} €</p>
  </div>

  <DynamicDialog/>
</template>

<script lang="ts" setup>
import { useProductsCartStore } from '@/stores/productsCart.ts';
import { computed, onMounted, ref } from 'vue';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import RecapCardList from '@/components/paymentFormsComponents/recapCart/recapCardList.vue';
import { storeToRefs } from 'pinia';
import ListOutOfStockProduct from '@/components/dialog-modal/list-out-of-stock-product.vue';
import { configOpenDialog } from '@/config/openDialogConfig.ts';
import type { SocialMediaDto } from '@/interfaces/social-media.dto.ts';
import { useDialog } from 'primevue';

const storeProductsCart = useProductsCartStore();
const dialog = useDialog();


onMounted(async () => {
  await storeProductsCart.getLocalStorageCart();
  if (storeProductsCart.openModal) {
    openDialog();
  }
});

const productsToSendImmediately = computed<ProductShopDto[]>(() =>
    storeProductsCart.productsCart.filter(
        product => !product.preOrder
    )
);

const productsToSendAfter = computed<ProductShopDto[]>(() =>
    storeProductsCart.productsCart.filter(
        product => product.preOrder && product.acceptedPreOrder
    )
);

const props = defineProps({
  isRecapPage: Boolean,
});


const openDialog = () => {
  dialog.open(ListOutOfStockProduct, {
    props: configOpenDialog('Liste des produits à modifier', false),
    data: {
      list: storeProductsCart.listOutOfStocks
    },
    onClose: (options: { data: SocialMediaDto }) => {
      if (options?.data) {
      }
    }
  });
};
</script>