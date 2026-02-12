<template>
  <div class="p-[10px]">
    <h1>Récapitulatif de la commande</h1>
    <div v-if="orderDetails">
      <div class="flex justify-between flex-wrap">
        <div v-for="packageBoxtal in orderDetails.orderPackages" class="w-full md:w-[calc(95%-250px)]">
          <OrderDetailsTimelineComponent :data="packageBoxtal.history"
                                         :trackingUrl="packageBoxtal.urlTracking"
                                         :refBoxtal="packageBoxtal.ref"
                                         :items="packageBoxtal.items"

          />
        </div>

        <RecapArticleOrderDetailsComponent :itemsList="orderDetails.orderItems"
                                           :tips="orderDetails.tips"
                                           :addingLivraisonPrice="orderDetails.addingLivraisonPrice"
                                           :totalAmount="orderDetails.totalAmount"
                                           class="min-w-[250px]"/>
      </div>


      <div>
        <AddressOrderDetailComponent v-model:billingAddress="orderDetails.billingAddress"
                                     v-model:deliveryAddress="orderDetails.deliveryAddress"
                                     v-model:isGuest="orderDetails.isGuest"
                                     :orderId="orderDetails.orderId"
        />

      </div>
    </div>


      <Loader height="300px" class="mt-8" v-else/>

  </div>


</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiGet } from '@/services/request-service.ts';
import { api } from '@/functions/api.ts';
import { env } from '@/environnement.ts';
import type { OrderDetailDto } from '@/interfaces/order-detail.dto.ts';
import RecapAddressComponent from '@/components/RecapAddress/RecapAddressComponent.vue';
import OrderDetailsTimelineComponent from '@/components/Profile/order/order-details/orderDetailsTimelineComponent.vue';
import AddressOrderDetailComponent from '@/components/Profile/order/order-details/AddressOrderDetailComponent.vue';
import RecapArticleOrderDetailsComponent
  from '@/components/Profile/order/order-details/recapArticleOrderDetailsComponent.vue';
import { useRouter } from 'vue-router';
import Loader from '@/components/Loader/Loader.vue';

const props = defineProps<{
  id: string,
}>();

const loading = ref(false);
const orderDetails = ref<OrderDetailDto | null>(null);
const router = useRouter();

onMounted(async () => {
  loading.value = true;
  await apiGet(`${api(env.order.crud)}/${props.id}`, 'GET', true).then(response => response.json())
      .then(data => {
        console.warn(data);
        orderDetails.value = data;
      }).catch(error => {
        router.push('/');
      }).finally(() => loading.value = false);
});
</script>