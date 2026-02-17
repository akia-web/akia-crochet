<template>

  <div v-if="storeProductsCart.productCartLength >0" class="mt-12">
    <div class="bg-white p-[20px] md:w-[60%] lg:w-[40%] m-auto">
      <h2 class="font-bold text-center mb-8 text-lg">Récapitulatif du panier</h2>
      <RecapCartView :isRecapPage="true"></RecapCartView>
    </div>

    <div class="flex justify-center mt-8">
      <Button label="Passer au paiement"
              @click="goTo(PAYMENT_ROUTE)"></Button>
    </div>
  </div>

  <div v-else
       class="bg-white p-[20px] md:w-[60%] m-auto h-[80vh] flex justify-center align-center flex-col">
    <img src="@/assets/icones/quokka-triste.png" alt=""
         class="w-[150px] mb-8">
    <p>Il n'y a pas de produits dans votre panier</p>
    <Button label="Voir le catalogue produits"
            @click="goTo(PRODUCTS_ROUTE)"
            class="mt-8"/>
  </div>

  <DynamicDialog/>
</template>
<script lang="ts" setup>

import { useRouter } from 'vue-router';
import { PAYMENT_ROUTE, PRODUCTS_ROUTE } from '@/router/routes-name.ts';
import { onMounted } from 'vue';
import { useProductsCartStore } from '@/stores/productsCart.ts';
import RecapCartView from '@/components/paymentFormsComponents/recapCart/recapCartView.vue';


const router = useRouter();
const storeProductsCart = useProductsCartStore();


const goTo = (url: string) => {
  router.push({ name: url });
};

onMounted(() => {
  if (storeProductsCart.openSlider) {
    storeProductsCart.updateVisibility(false);
  }
  storeProductsCart.updateLivraisonPrice(0);
  storeProductsCart.updateTips(0);
});
</script>