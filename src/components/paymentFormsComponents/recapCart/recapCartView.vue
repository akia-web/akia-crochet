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

    <div v-if="!props.isRecapPage">
      <p v-if="livraison !== 0">Livraison : {{ livraison }}€</p>
      <p v-if="tips !== 0">Pourboires : {{ tips }}€</p>
    </div>

    <p class="mt-4 text-right">Total: {{ totalPrice }} €</p>
  </div>

  <DynamicDialog/>
</template>

<script lang="ts" setup>
import { useProductsCartStore } from '@/stores/productsCart.ts';
import { computed, onMounted, ref, watch } from 'vue';
import type { ProductShopDto } from '@/interfaces/product-shop.dto.ts';
import RecapCardList from '@/components/paymentFormsComponents/recapCart/recapCardList.vue';
import ListOutOfStockProduct from '@/components/dialog-modal/list-out-of-stock-product.vue';
import { configOpenDialog } from '@/config/openDialogConfig.ts';
import { useDialog } from 'primevue';

const storeProductsCart = useProductsCartStore();
const dialog = useDialog();


onMounted(async () => {
  await storeProductsCart.getLocalStorageCart();
});

const openModal = computed(() =>  storeProductsCart.openModal)

watch(openModal, (newVal) => {
  if(newVal) {
    openDialog();
  }

});

const livraison = computed(() => storeProductsCart.livraisonPrice);
const tips = computed(() => storeProductsCart.tipsPrice);

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

const totalPrice = computed(() => {
  if (!props.isRecapPage) {
    console.warn('hello')
    return storeProductsCart.totalPrice + storeProductsCart.tipsPrice + storeProductsCart.livraisonPrice;
  }else{
    console.warn('coucou')
    return storeProductsCart.totalPrice;
  }
});

const props = defineProps({
  isRecapPage: Boolean,
});


const openDialog = () => {
  console.warn('openDialog');
  dialog.open(ListOutOfStockProduct, {
    props: configOpenDialog('Liste des produits à modifier', false),
    data: {
      list: storeProductsCart.listOutOfStocks
    },
    onClose: () => {
    }
  });
};
</script>